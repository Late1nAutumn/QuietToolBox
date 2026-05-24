import {
  NODE_WIDTH,
  NODE_HEIGHT,
  COL_W,
  ROW_H,
  TYPE_DEFAULTS,
  INITIAL_VISIBLE_LIMIT,
  RELAX_MAX_NODES,
} from './constant';

let _idCounter = 0;
const nextId = () => `n${++_idCounter}`;

export function typeOf(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v; // object, string, number, boolean
}

// ── Build nodes from a JSON value ─────────────────────────────────────────

export function jsonToNodes(value) {
  const nodes = [];
  function walk(v, key, parentId) {
    const id = nextId();
    const type = typeOf(v);
    const base = {
      id, parentId, key, type,
      x: 0, y: 0, width: NODE_WIDTH, height: NODE_HEIGHT,
    };
    if (type === 'object') {
      nodes.push(base);
      for (const [k, child] of Object.entries(v)) walk(child, k, id);
    } else if (type === 'array') {
      nodes.push(base);
      v.forEach((child, i) => walk(child, i, id));
    } else {
      nodes.push({ ...base, value: v });
    }
  }
  walk(value, 'root', null);
  return nodes;
}

// ── Rebuild a JSON value from nodes ───────────────────────────────────────

export function nodesToJson(nodes) {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const childrenOf = buildChildrenMap(nodes);
  const root = nodes.find(n => n.parentId == null);
  if (!root) return null;
  function build(id) {
    const n = byId.get(id);
    const kids = childrenOf.get(id) || [];
    if (n.type === 'object') {
      const obj = {};
      for (const cid of kids) obj[byId.get(cid).key] = build(cid);
      return obj;
    }
    if (n.type === 'array') {
      const sorted = kids.slice().sort(
        (a, b) => byId.get(a).key - byId.get(b).key
      );
      return sorted.map(build);
    }
    return n.value;
  }
  return build(root.id);
}

// ── Helpers ───────────────────────────────────────────────────────────────

export function buildChildrenMap(nodes) {
  const map = new Map();
  for (const n of nodes) {
    if (n.parentId == null) continue;
    if (!map.has(n.parentId)) map.set(n.parentId, []);
    map.get(n.parentId).push(n.id);
  }
  return map;
}

export function descendantsOf(nodes, id) {
  const childrenOf = buildChildrenMap(nodes);
  const out = new Set();
  function walk(nid) {
    for (const c of (childrenOf.get(nid) || [])) {
      out.add(c);
      walk(c);
    }
  }
  walk(id);
  return out;
}

// All compound (object/array) node ids — used for "Collapse all"
export function allCompoundIds(nodes) {
  return new Set(
    nodes
      .filter(n => n.type === 'object' || n.type === 'array')
      .map(n => n.id)
  );
}

/**
 * BFS-collapse: caps the initial visible node count so a huge JSON
 * doesn't paint thousands of cards on first render.
 *
 * Spec / behavior:
 * - Visit the root (visible = 1). Walk layer-by-layer in BFS order.
 * - For each compound popped: if expanding it (its children count)
 *   would push `visible` over `limit`, ADD it to the collapsed set
 *   and don't enqueue its children. Otherwise enqueue and account.
 * - Shallow always wins. Deeper compounds get collapsed first when
 *   the budget runs out.
 * - Default `limit` = INITIAL_VISIBLE_LIMIT (constant.js, 50).
 *
 * Called by:
 * - Initial mount (sample or saved doc).
 * - handleJsonChange (every textarea-driven rebuild — IDs are fresh).
 * - handleReset (workspace reset button).
 */
export function bfsInitialCollapse(nodes, limit = INITIAL_VISIBLE_LIMIT) {
  const childrenOf = buildChildrenMap(nodes);
  const byId = new Map(nodes.map(n => [n.id, n]));
  const root = nodes.find(n => n.parentId == null);
  if (!root) return new Set();
  const collapsed = new Set();
  const queue = [root.id];
  let visibleCount = 1; // root itself
  while (queue.length > 0) {
    const id = queue.shift();
    const node = byId.get(id);
    if (node.type !== 'object' && node.type !== 'array') continue;
    const kids = childrenOf.get(id) || [];
    if (kids.length === 0) continue;
    if (visibleCount + kids.length > limit) {
      collapsed.add(id);
      continue;
    }
    visibleCount += kids.length;
    for (const k of kids) queue.push(k);
  }
  return collapsed;
}

export function hiddenIds(nodes, collapsedIds) {
  const hidden = new Set();
  const childrenOf = buildChildrenMap(nodes);
  function hideSubtree(id) {
    for (const c of (childrenOf.get(id) || [])) {
      hidden.add(c);
      hideSubtree(c);
    }
  }
  for (const id of collapsedIds) hideSubtree(id);
  return hidden;
}

// ── Locking helpers ───────────────────────────────────────────────────────

/**
 * Expand explicit per-node locks into the full "frozen" set used by
 * every layout pass.
 *
 * Spec / behavior:
 * - The lock button on a card toggles ONE id in `lockedIds`.
 * - Spec says: locking a node freezes its WHOLE descendant chain. So
 *   the frozen set = lockedIds ∪ descendants of each locked id.
 * - Manual drag and editing still work on frozen nodes — the lock
 *   only constrains automatic layout passes.
 * - "Drag with children" ignores locks: the user is in control of a
 *   manual move, so frozen descendants ride along anyway.
 */
export function frozenSet(nodes, lockedIds) {
  const out = new Set();
  for (const id of lockedIds) {
    out.add(id);
    for (const d of descendantsOf(nodes, id)) out.add(d);
  }
  return out;
}

function visibleLeavesUnder(id, collapsedIds, childrenOf) {
  if (collapsedIds.has(id)) return 1;
  const kids = childrenOf.get(id) || [];
  if (kids.length === 0) return 1;
  return kids.reduce((sum, c) => sum + visibleLeavesUnder(c, collapsedIds, childrenOf), 0);
}

/**
 * Global tidy-tree layout. Returns nodes with updated x/y.
 *
 * Layout spec / behavior:
 * - x = depth * COL_W. Shallow on the left, deep on the right.
 * - Leaves: y = cursorRow * ROW_H; cursorRow++ after assigning.
 * - Parents: y = midpoint of their first/last visible-child y.
 * - Collapsed compounds count as leaves (their subtree is skipped).
 *
 * Lock semantics:
 * - A frozen node (lockedIds + descendants) keeps its current x/y.
 * - The visit still reserves a vertical slot for the frozen subtree
 *   equal to `visibleLeavesUnder` so non-frozen siblings don't pile
 *   on top of it on paper.
 * - After tidy assigns positions, a single relaxCollisions pass runs
 *   with pinned = frozen — pushes any tidied node that happens to
 *   land on a frozen AABB out of the way.
 *
 * Performance notes:
 * - Without locks: pure O(n) tidy. No relax pass — handles tens of
 *   thousands of nodes in tens of ms.
 * - With locks: extra O(n²) relax (capped by maxIterations = 80).
 * - canonicalJson re-derivation is more expensive than this pass at
 *   large n — see OakHeart.jsx structureVersion note.
 *
 * Called by:
 * - handleAutoLayout (the "Auto layout" toolbar button).
 * - handleExpandAll (only when autoLayoutOnExpand is on).
 * - handleReset (workspace reset).
 */
export function layoutTree(nodes, collapsedIds = new Set(), lockedIds = new Set()) {
  const childrenOf = buildChildrenMap(nodes);
  const root = nodes.find(n => n.parentId == null);
  if (!root) return nodes;

  const frozen = frozenSet(nodes, lockedIds);

  const positions = new Map();
  let cursorRow = 0;

  function visit(id, depth) {
    if (frozen.has(id)) {
      // Reserve vertical space matching the subtree's visible leaf count;
      // keep current coordinates by not writing to `positions`.
      const leaves = visibleLeavesUnder(id, collapsedIds, childrenOf);
      const startRow = cursorRow;
      cursorRow += leaves;
      return (startRow + (leaves - 1) / 2) * ROW_H;
    }
    const kids = collapsedIds.has(id) ? [] : (childrenOf.get(id) || []);
    if (kids.length === 0) {
      const y = cursorRow * ROW_H;
      cursorRow++;
      positions.set(id, { x: depth * COL_W, y });
      return y;
    }
    const ys = kids.map(c => visit(c, depth + 1));
    const y = (ys[0] + ys[ys.length - 1]) / 2;
    positions.set(id, { x: depth * COL_W, y });
    return y;
  }

  visit(root.id, 0);

  const laid = nodes.map(n => {
    if (frozen.has(n.id)) return n;
    const p = positions.get(n.id);
    return p ? { ...n, x: p.x, y: p.y } : n;
  });

  return frozen.size > 0 ? relaxCollisions(laid, { pinnedIds: frozen }) : laid;
}

/**
 * Subtree-local tidy-tree layout. Re-positions only nodes inside the
 * subtree rooted at `rootId`; other branches stay where they were.
 *
 * Spec / behavior:
 * - Runs tidy-tree starting at rootId, depth 0, then translates so
 *   the root stays at its current (x, y) — root acts as the anchor.
 * - If a descendant is itself expanded, its grandchildren also re-
 *   arrange (recursive by nature of tidy-tree).
 * - DEFAULT for the "auto-layout on expand" toolbar toggle is ON;
 *   it's wired through dispatch('toggle', id) when expanding (not
 *   when collapsing). Spec: collapsing does not trigger any layout.
 *
 * Lock semantics (spec: "ignore the locked targets and their children"):
 * - Frozen subtrees inside the subtree being laid out are NOT
 *   repositioned — their current x/y is preserved.
 * - The visit still reserves a vertical slot for each frozen subtree
 *   (= its visible-leaf count) so non-frozen siblings space around
 *   them correctly.
 *
 * Dodging external siblings (spec adjustment 2025-05-24):
 * - After tidy assigns positions, a relaxCollisions pass runs with
 *   PINNED = (everything outside the subtree) ∪ (frozen inside) ∪
 *   ({rootId} as the anchor). Only the non-frozen, non-root subtree
 *   members can shift, and they push themselves away from external
 *   neighbors instead of overlapping them.
 *
 * Performance notes:
 * - Tidy pass: O(subtree).
 * - Relax pass: both-pinned pairs short-circuit, so real cost is
 *   O(subtree × n) per iteration. For small subtrees inside a big
 *   tree this is OK; very large subtrees can degrade to O(n²).
 *
 * Called by:
 * - dispatch('toggle', id) when expanding AND autoLayoutOnExpand
 *   is on. Expand-all uses layoutTree instead (it touches the whole
 *   tree, so the subtree-only path doesn't apply).
 */
export function layoutSubtree(nodes, rootId, collapsedIds = new Set(), lockedIds = new Set()) {
  const root = nodes.find(n => n.id === rootId);
  if (!root) return nodes;

  const childrenOf = buildChildrenMap(nodes);
  const frozen = frozenSet(nodes, lockedIds);

  const positions = new Map();
  let cursorRow = 0;

  function visit(id, depth) {
    if (id !== rootId && frozen.has(id)) {
      const leaves = visibleLeavesUnder(id, collapsedIds, childrenOf);
      const startRow = cursorRow;
      cursorRow += leaves;
      return (startRow + (leaves - 1) / 2) * ROW_H;
    }
    const kids = collapsedIds.has(id) ? [] : (childrenOf.get(id) || []);
    if (kids.length === 0) {
      const y = cursorRow * ROW_H;
      cursorRow++;
      positions.set(id, { x: depth * COL_W, y });
      return y;
    }
    const ys = kids.map(c => visit(c, depth + 1));
    const y = (ys[0] + ys[ys.length - 1]) / 2;
    positions.set(id, { x: depth * COL_W, y });
    return y;
  }

  visit(rootId, 0);

  // Anchor the subtree at root's current position.
  const rootNew = positions.get(rootId);
  const dx = root.x - rootNew.x;
  const dy = root.y - rootNew.y;

  const laid = nodes.map(n => {
    if (frozen.has(n.id)) return n;
    const p = positions.get(n.id);
    if (!p) return n; // outside the subtree
    return { ...n, x: p.x + dx, y: p.y + dy };
  });

  // Dodge external siblings: pin everything that should NOT move
  // during the cleanup pass — external nodes, frozen nodes, and the
  // root anchor — and let the rest of the just-laid subtree absorb
  // the displacement.
  const pinned = new Set();
  for (const n of laid) {
    if (!positions.has(n.id) || frozen.has(n.id) || n.id === rootId) {
      pinned.add(n.id);
    }
  }
  return relaxCollisions(laid, { pinnedIds: pinned });
}

// ── Edit operations (pure; return new nodes array) ────────────────────────

// Direct type+value setter for modal flow (no parse heuristics).
export function setNodeValue(nodes, id, newType, newValue) {
  return nodes.map(n =>
    n.id === id ? { ...n, type: newType, value: newValue } : n
  );
}

export function editValue(nodes, id, rawString) {
  let parsed;
  try { parsed = JSON.parse(rawString); }
  catch { parsed = rawString; }
  const type = typeOf(parsed);
  // Compound parses are not allowed via simple edit — keep as string instead
  if (type === 'object' || type === 'array') {
    return nodes.map(n => n.id === id ? { ...n, type: 'string', value: rawString } : n);
  }
  return nodes.map(n => n.id === id ? { ...n, type, value: parsed } : n);
}

export function renameKey(nodes, id, newKey) {
  return nodes.map(n => n.id === id ? { ...n, key: newKey } : n);
}

export function addChild(nodes, parentId, requestedKey, type) {
  const parent = nodes.find(n => n.id === parentId);
  if (!parent || (parent.type !== 'object' && parent.type !== 'array')) return nodes;

  const siblings = nodes.filter(n => n.parentId === parentId);
  let key;
  if (parent.type === 'array') {
    key = siblings.length;
  } else {
    key = requestedKey;
    if (siblings.some(s => s.key === key)) {
      let i = 2;
      while (siblings.some(s => s.key === `${requestedKey}_${i}`)) i++;
      key = `${requestedKey}_${i}`;
    }
  }

  const id = nextId();
  const base = {
    id, parentId, key, type,
    x: parent.x + COL_W,
    y: parent.y + siblings.length * ROW_H,
    width: NODE_WIDTH, height: NODE_HEIGHT,
  };
  const isCompound = type === 'object' || type === 'array';
  const newNode = isCompound ? base : { ...base, value: TYPE_DEFAULTS[type] };
  return [...nodes, newNode];
}

/**
 * AABB push-apart relaxation over an unsorted node list.
 *
 * Algorithm (per pair (a, b) every iteration):
 * - Compute center-to-center dx, dy and per-axis overlap with
 *   `padding` slack.
 * - If both overlaps are positive (true intersection), resolve on
 *   the SHORTER axis (smallest displacement to separate):
 *     • neither pinned → each side moves half the overlap apart
 *     • one pinned → the unpinned side absorbs the full overlap
 *     • both pinned → skip (cannot resolve)
 * - One iteration = one full pair sweep. The loop exits the moment
 *   an iteration completes without any move.
 *
 * Options:
 * - padding (default 8 world-px) — breathing space added to AABB.
 * - maxIterations (default 80) — hard cap so degenerate cases don't
 *   spin forever.
 * - pinnedIds (Set) — ids that never move.
 * - maxNodes (default RELAX_MAX_NODES) — if `nodes.length` exceeds
 *   this, the pass bails out immediately and returns input unchanged.
 *   The algorithm is O(n²) per iteration; without this guard, big
 *   JSON freezes the UI. Caller can override (pass Infinity) when it
 *   knows the input is bounded (e.g. an already-localized subset).
 *
 * Trade-off when the cap kicks in:
 * - layoutTree with locks: tidied nodes may visually overlap frozen
 *   AABBs.
 * - layoutSubtree: re-laid subtree may overlap external siblings.
 * - applyAddChild: new node may overlap an existing sibling.
 * Users can manually drag to resolve in all three cases.
 *
 * Called by:
 * - layoutTree (only when frozen.size > 0) — keeps tidied nodes
 *   away from frozen ones.
 * - layoutSubtree — pinned = external + frozen + root; keeps the
 *   re-laid subtree from overlapping external siblings.
 * - applyAddChild in OakHeart.jsx — pushes a newly-added child and
 *   its sibling neighbors apart so the new node doesn't stack on
 *   top of existing ones; pinned = frozen.
 */
export function relaxCollisions(
  nodes,
  {
    padding = 8,
    maxIterations = 80,
    pinnedIds = new Set(),
    maxNodes = RELAX_MAX_NODES,
  } = {}
) {
  if (nodes.length > maxNodes) return nodes;
  const next = nodes.map(n => ({ ...n }));
  for (let iter = 0; iter < maxIterations; iter++) {
    let moved = false;
    for (let i = 0; i < next.length; i++) {
      for (let j = i + 1; j < next.length; j++) {
        const a = next[i], b = next[j];
        const aw = a.width ?? NODE_WIDTH;
        const ah = a.height ?? NODE_HEIGHT;
        const bw = b.width ?? NODE_WIDTH;
        const bh = b.height ?? NODE_HEIGHT;
        const dx = (b.x + bw / 2) - (a.x + aw / 2);
        const dy = (b.y + bh / 2) - (a.y + ah / 2);
        const overlapX = (aw + bw) / 2 + padding - Math.abs(dx);
        const overlapY = (ah + bh) / 2 + padding - Math.abs(dy);
        if (overlapX > 0 && overlapY > 0) {
          const aPinned = pinnedIds.has(a.id);
          const bPinned = pinnedIds.has(b.id);
          if (aPinned && bPinned) continue;
          if (overlapX < overlapY) {
            const shift = (overlapX / 2) * (dx >= 0 ? 1 : -1);
            if (aPinned) b.x += 2 * shift;
            else if (bPinned) a.x -= 2 * shift;
            else { a.x -= shift; b.x += shift; }
          } else {
            const shift = (overlapY / 2) * (dy >= 0 ? 1 : -1);
            if (aPinned) b.y += 2 * shift;
            else if (bPinned) a.y -= 2 * shift;
            else { a.y -= shift; b.y += shift; }
          }
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  return next;
}

export function deleteSubtree(nodes, id) {
  const target = nodes.find(n => n.id === id);
  if (!target || target.parentId == null) return nodes; // can't delete root

  const toDelete = descendantsOf(nodes, id);
  toDelete.add(id);

  let result = nodes.filter(n => !toDelete.has(n.id));

  // Reindex array siblings to maintain contiguous indices
  const parent = nodes.find(n => n.id === target.parentId);
  if (parent && parent.type === 'array') {
    const sibs = result
      .filter(n => n.parentId === parent.id)
      .sort((a, b) => a.key - b.key);
    const reidx = new Map();
    sibs.forEach((s, i) => { if (s.key !== i) reidx.set(s.id, i); });
    if (reidx.size > 0) {
      result = result.map(n => reidx.has(n.id) ? { ...n, key: reidx.get(n.id) } : n);
    }
  }
  return result;
}
