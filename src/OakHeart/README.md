# OakHeart — JSON tree viewer/editor

JSON document → spatial canvas. Each value (object, array, primitive)
becomes a card on an [Isles](../Isles/README.md) infinite canvas. This
README documents the **layout algorithm**: how positions are assigned,
how locks and the "auto-layout on expand" option interact with it, and
which helpers live where.

> Read this if you're modifying anything in `Oak.js` (positions, locks,
> collision relaxation) or in `OakHeart.jsx` (handlers that trigger
> layout). Card visual layout is unrelated and lives in
> `components/Node.jsx` + `OakHeart.css`.

---

## Coordinate model

- Each node has `x`, `y` in **world space** (Isles' coordinate system —
  pan/zoom is handled by the canvas, layout never reads camera state).
- All nodes use a uniform box: `NODE_WIDTH × NODE_HEIGHT` (see
  `constant.js`).
- Layout snaps positions to a grid defined by `COL_W = NODE_WIDTH +
  H_GAP` (horizontal) and `ROW_H = NODE_HEIGHT + V_GAP` (vertical).
- Edges are derived from `parentId` on each node; the layer that draws
  them does not influence positions.

---

## Visibility (collapse)

- `collapsedIds: Set<id>` lives in `OakHeart.jsx`. A node in this set is
  itself visible, but its descendants are hidden.
- `hiddenIds(nodes, collapsedIds)` (in `Oak.js`) returns the set of
  hidden descendants. The visible list passed to Isles is
  `nodes.filter(n => !hidden.has(n.id))`.

---

## Lock model

- `lockedIds: Set<id>` lives in `OakHeart.jsx`. A locked id and its full
  descendant chain form the **frozen set**, computed by `frozenSet(nodes,
  lockedIds)` in `Oak.js`.
- Frozen semantics: **layout will not reposition a frozen node**. Manual
  drag and editing still work — the lock only constrains automatic
  layout (the "Auto layout" button, "Expand all" with auto-layout-on-
  expand, individual expand with auto-layout-on-expand, and the
  collision relaxation after Add Child).
- The lock button is rendered for every node (between `+ Child` /
  `Edit` and `Delete`). Clicking dispatches `dispatch('lock', id)`,
  which toggles the id in `lockedIds`.

---

## Layout algorithms

There are two public layout entry points in `Oak.js`, plus a collision
relaxer that both use.

### `layoutTree(nodes, collapsedIds, lockedIds) → nodes`

Global tidy-tree layout from the root, with **lock-aware** pinning.

Algorithm:

1. Compute the frozen set (`lockedIds` ∪ descendants of locked).
2. Recursive depth-first visit from the root:
   - **Frozen subtree** (`frozen.has(id)`): do NOT recurse to assign
     positions. Reserve a vertical slot equal to the subtree's visible
     leaf count (`visibleLeavesUnder`). Return the midpoint of the
     reserved rows as this node's "virtual y" so the parent's midpoint
     calculation still works.
   - **Leaf or collapsed compound** (no visible children): assign
     `(x, y) = (depth * COL_W, cursorRow * ROW_H)` and advance
     `cursorRow`.
   - **Compound with visible children**: recurse, then set this node's
     y to the midpoint of `(firstChild.y, lastChild.y)` so the parent
     sits centered against its children.
3. Apply the assigned positions to all non-frozen nodes (frozen keep
   their existing coordinates).
4. If any nodes are frozen, run `relaxCollisions` with `pinnedIds =
   frozen` — this pushes any tidied node that happens to overlap a
   frozen AABB out of the way.

Output: a new `nodes` array with updated `x`/`y` on the moved nodes,
same identity for unchanged ones.

### `layoutSubtree(nodes, rootId, collapsedIds, lockedIds) → nodes`

In-place tidy-tree limited to one subtree. Used by:

- the per-node expand toggle (chevron click), when
  `autoLayoutOnExpand` is on
- — but NOT by "Expand all", which calls `layoutTree` instead.

Algorithm:

1. Compute the frozen set as in `layoutTree`.
2. Run tidy-tree starting at `rootId`, depth `0`, building a `positions`
   map. Frozen subtrees inside still reserve vertical space without
   updating positions (so the tidied siblings don't pile onto them).
3. The tidy-tree placed the root at `(0, midY)`. Translate the entire
   computed `positions` map by `(root.x - 0, root.y - midY)` so the
   root stays at its current coordinates and the subtree fans out
   below/right of it.
4. Apply translated positions to every non-frozen node that was visited.
   Nodes outside the subtree are left untouched.

> Note: outside-the-subtree nodes are **not** pushed apart. The newly-
> placed subtree can overlap with sibling subtrees on the canvas — this
> is intentional. Spec: re-layout follows the expanded node's position,
> with no global cleanup. Users can hit "Auto layout" for that.

### `relaxCollisions(nodes, { padding, maxIterations, pinnedIds }) → nodes`

AABB push-apart used after layout passes that may leave overlaps.

Per iteration, every pair `(i, j)` is checked:

- Compute center-to-center `dx`, `dy`, then
  `overlapX = (aw + bw)/2 + padding - |dx|` (same for Y).
- If both overlaps are positive, the pair overlaps. Resolve along the
  **shorter** axis (smaller overlap), splitting the displacement:
  - Neither pinned: each side moves by `overlap / 2` opposite the
    other.
  - One pinned: the unpinned side absorbs the full `overlap`.
  - Both pinned: skip the pair (cannot resolve).
- A pass without any movement terminates the loop early.

`maxIterations` caps the worst case (default `80`). Padding defaults
to `8` world px.

There is also a hard input-size guard, `maxNodes`, defaulting to
`RELAX_MAX_NODES` (currently `500`). If `nodes.length` exceeds it,
the pass returns its input unchanged. The algorithm is O(n²) per
iteration and on tree sizes around 1MB+ JSON it freezes the UI;
this cap is the simple "good enough" trade — overlap may persist
but the workspace stays interactive. Callers can pass a larger
`maxNodes` if they know the input is bounded (e.g. an already-
localized subset of the tree).

### `bfsInitialCollapse(nodes, limit) → Set<id>`

Used only on initial load (sample / saved doc / paste). BFS from the
root; when expanding a layer would push the visible node count over
`INITIAL_VISIBLE_LIMIT` (default 50), the offending compound nodes are
auto-collapsed. Keeps first paint cheap even for huge JSON.

---

## When each algorithm runs

| User action | Layout called |
| ----------- | ------------- |
| Initial mount | `bfsInitialCollapse` → `layoutTree(nodes, collapsed, /* no locks */)` |
| Load saved doc / sample | same as initial mount |
| Textarea-driven JSON change | rebuilds tree from scratch via `buildInitialTree` (no global re-layout of existing positions — positions are reset for the new tree); **camera intentionally not re-centered** |
| Drag a node | no layout pass; positions updated directly (with descendants if "Drag with children" is on) |
| Add child | `addChild` → `relaxCollisions(pinnedIds = frozen)` (locks pinned so siblings move away from them) |
| Delete node | no layout pass |
| Click chevron to expand | if `autoLayoutOnExpand`: `layoutSubtree(nodes, id, nextCollapsed, lockedIds)` |
| Click chevron to collapse | no layout pass |
| "Expand all" | `setCollapsedIds(empty)`; if `autoLayoutOnExpand`: `layoutTree(nodes, empty, lockedIds)` |
| "Collapse all" | `setCollapsedIds(allCompoundIds)`; no layout pass |
| "Auto layout" button | `layoutTree(nodes, collapsed, lockedIds)`; also re-centers camera |

---

## Interaction rules between flags and locks

- **Locks override auto-layout in every pathway**. Auto-layout-on-
  expand still re-arranges visible non-frozen children; if a child or
  any descendant is locked, that subtree slot is reserved but not
  repositioned — the rest of the siblings flow around it.
- **Drag with children** (`dragWithChildren`) ignores locks: the user
  is dragging manually, so they're in control. If a locked subtree is a
  descendant of the dragged node, it rides along with the manual move.
- Lock is per-node, not per-subtree. Locking a parent freezes its
  whole descendant chain; unlocking only that parent does not unfreeze
  individual descendants if they were locked separately.

---

## File map

```
src/OakHeart/
  Oak.js              All layout / mutation pure functions (see above).
  OakHeart.jsx        Page component. Owns state (nodes, collapsedIds,
                      lockedIds, theme, modal, sidebar/toolbar flags).
                      Wires the action dispatcher and calls Oak.js helpers.
  OakHeart.css        Theme variables + component styles. Two themes
                      (.oak--light / .oak--dark); node card colors are
                      shared except for the dim-mode body background.
  constant.js         NODE_WIDTH / NODE_HEIGHT / H_GAP / V_GAP +
                      INITIAL_VISIBLE_LIMIT + the SAMPLE_JSON document.
  README.md           This file.
  components/
    Node.jsx          One card. React.memo + stable dispatch so only
                      the dragged/edited node re-renders per frame.
    JsonSidebar.jsx   Right-side textarea. Two-way bound, debounce 300ms.
                      Collapses to a 22px strip.
    Modal{...}.jsx    Edit / Rename / AddChild / DeleteConfirm modals,
                      consumed by the shared <Modal> wrapper.
  translation/
    context.js        Collection + context enums.
    EN.js / CN.js     String packs.
    translator.js     `translator(ctx, lang, collection)` lookup.
```

---

## Large JSON cost

Empirical observation (logged from a 1400KB user document): the
dominant cost on auto-layout / drag is **not** the tidy-tree pass
itself — that's O(n) and runs in tens of ms even at tens of thousands
of nodes. The killer was `canonicalJson` re-derivation:
`nodesToJson` (O(n)) + `JSON.stringify` (O(n) over a deep tree of
~1MB) runs ~10–100ms each, and was firing on **every** `nodes`
change, including each drag frame and each layout pass.

The fix: split structural from positional updates. `OakHeart.jsx`
holds a `structureVersion` counter that bumps only on the five
mutation paths (`handleJsonChange`, `applyEditValue`, `applyRename`,
`applyAddChild`, `applyDelete`). The `canonicalJson` `useMemo` is
keyed on `[structureVersion]`, not `[nodes]`, so position-only
updates skip the re-derive entirely. The JsonSidebar effect and the
debounced save effect both downstream of `canonicalJson` therefore
also skip work in the common case.

If a 1400KB JSON still chokes after this, the remaining suspects
are:

- React reconciliation of large arrays passed to Isles. Isles already
  virtualizes the rendered set, but `sortedElements = [...elements].sort(...)`
  inside Isles still runs over the full list on every render.
- Browser repaint of a 1400KB `<textarea>` value (only triggers when
  structure actually changes; not on layout).
- GC pressure from allocating tens of thousands of new node objects in
  `prev.map(...)` on each layout.

Mitigations not yet implemented (out of scope for this prototype):
chunked layout via `requestIdleCallback`; storing positions in a
parallel `Map<id, {x,y}>` instead of cloning node objects; lifting
sort out of Isles' render path.

---

## Modification recipes

| You want to… | Edit |
| ------------ | ---- |
| Change card size or spacing | `NODE_WIDTH` / `NODE_HEIGHT` / `H_GAP` / `V_GAP` in `constant.js` |
| Change initial node cap | `INITIAL_VISIBLE_LIMIT` in `constant.js` (read by `bfsInitialCollapse`) |
| Make auto-layout push more aggressively | `padding` arg to `relaxCollisions` (also exposed via the second arg in callers) |
| Add a new dispatcher action | Add a key to `actionsRef.current` in `OakHeart.jsx` and call `dispatch('your-action', id)` from a button |
| Persist a new piece of canvas state | Add a `FIELD.X` in `src/utils/localStorage.js`, expose getter/setter under `STORE.OAK_HEART`, and wire a debounced effect in `OakHeart.jsx`. Read the header comment in `localStorage.js` for the rules |
| Replace tidy-tree with something else | Swap `layoutTree` / `layoutSubtree` implementations. Their input/output contract is `(nodes, collapsedIds, lockedIds) → nodes`. Keep that and the rest of the app is unaffected |
