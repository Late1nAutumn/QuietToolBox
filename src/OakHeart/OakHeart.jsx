/**
 * OakHeart — JSON tree viewer/editor on the Isles infinite canvas.
 *
 * Layout: toolbar on top, then canvas (left) + JSON sidebar (right).
 * Sidebar's textarea is two-way bound to the canvas — see JsonSidebar.jsx.
 *
 * Theme: dark/light via CSS-variable class swap on the root .oak element.
 *   Persisted to localStorage (STORE.OAK_HEART); first visit follows
 *   prefers-color-scheme.
 *
 * Camera: Isles owns pan/zoom internally. We use the imperative ref API
 *   (centerOn) to re-frame after auto layout, paste, and reset.
 */

import './OakHeart.css';
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { Isles } from '../Isles';
import Modal from '../components/Modal';
import NexusButton from '../Home/NexusButton/NexusButton';
import { DIRECTION } from '../utils/enums';
import { LOCALSTORAGE, STORE } from '../utils/localStorage';
import { useGlobal } from '../context/GlobalContext';
import { translator } from './translation/translator';
import {
  TRANSLATE_COLLECTION,
  TOOLBAR_CONTEXT,
  NOTICE_CONTEXT,
} from './translation/context';
import {
  SAMPLE_JSON,
  NODE_WIDTH,
  NODE_HEIGHT,
  H_GAP,
  VIRTUALIZE_OVERSCAN,
  RELAX_MAX_NODES,
} from './constant';
import {
  jsonToNodes,
  nodesToJson,
  layoutTree,
  layoutSubtree,
  hiddenIds,
  buildChildrenMap,
  descendantsOf,
  allCompoundIds,
  bfsInitialCollapse,
  setNodeValue,
  renameKey,
  addChild,
  deleteSubtree,
  relaxCollisions,
  frozenSet,
} from './Oak';
import { Node } from './components/Node';
import { JsonSidebar } from './components/JsonSidebar';
import { ModalEditValue } from './components/ModalEditValue';
import { ModalRenameKey } from './components/ModalRenameKey';
import { ModalAddChild } from './components/ModalAddChild';
import { ModalDeleteConfirm } from './components/ModalDeleteConfirm';

// ── Init/reset helpers ────────────────────────────────────────────────────

function buildInitialTree(json) {
  const fresh = jsonToNodes(json);
  const collapsed = bfsInitialCollapse(fresh);
  return { nodes: layoutTree(fresh, collapsed), collapsed };
}

function pickInitialTheme() {
  const saved = LOCALSTORAGE[STORE.OAK_HEART].getTheme();
  if (saved === 'dark' || saved === 'light') return saved;
  return 'dark';
}

// Re-center camera between root and the first visible child layer.
function recenterCamera(islesRef, nodes, collapsedIds) {
  if (!islesRef.current) return;
  const root = nodes.find(n => n.parentId == null);
  if (!root) return;
  const hidden = hiddenIds(nodes, collapsedIds);
  const childrenOf = buildChildrenMap(nodes);
  const kids = (childrenOf.get(root.id) || [])
    .filter(cid => !hidden.has(cid))
    .map(cid => nodes.find(n => n.id === cid))
    .filter(Boolean);
  const cx = root.x + NODE_WIDTH + H_GAP / 2;
  let cy;
  if (kids.length === 0) {
    cy = root.y + NODE_HEIGHT / 2;
  } else {
    const ys = kids.map(k => k.y + NODE_HEIGHT / 2);
    cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  }
  islesRef.current.centerOn({ x: cx, y: cy });
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function OakHeart() {
  // Compute initial state from saved doc if present, else sample.
  // Single jsonToNodes pass keeps the nodes/collapsed sets id-consistent.
  const initialRef = useRef(null);
  if (initialRef.current === null) {
    const saved = LOCALSTORAGE[STORE.OAK_HEART].getJsonDoc();
    initialRef.current = buildInitialTree(saved ?? SAMPLE_JSON);
  }

  const [nodes, setNodes] = useState(initialRef.current.nodes);
  const [collapsedIds, setCollapsedIds] = useState(initialRef.current.collapsed);
  const [theme, setTheme] = useState(pickInitialTheme);
  const [modal, setModal] = useState(null); // { type, nodeId } | null
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dragWithChildren, setDragWithChildren] = useState(false);
  const [autoLayoutOnExpand, setAutoLayoutOnExpand] = useState(true);
  const [lockedIds, setLockedIds] = useState(() => new Set());

  // Bumped on STRUCTURAL changes only (edit value, rename key, add child,
  // delete, full-tree replace from textarea). Position-only updates (drag,
  // auto-layout, layout-on-expand) do NOT bump it. canonicalJson reads
  // this so the sidebar and save effect don't re-derive a 1400KB string
  // on every drag frame or layout pass. See README §"Large JSON cost".
  const [structureVersion, setStructureVersion] = useState(0);
  const bumpStructure = () => setStructureVersion(v => v + 1);

  // Compose the sidebar warning indicator. Currently has one source:
  // relaxCollisions self-disables above RELAX_MAX_NODES, so any auto
  // push-apart (after add child, after subtree expand, after locked
  // auto-layout) silently no-ops. Surfaced as a hoverable ⚠ next to
  // the sync pill rather than a transient toast — the condition is
  // stable while the tree is large, so a persistent indicator fits
  // better than a popup.
  const warningMessage = nodes.length > RELAX_MAX_NODES
    ? translator(NOTICE_CONTEXT.RELAX_DISABLED, lang, TRANSLATE_COLLECTION.NOTICE)
    : null;

  const { lang } = useGlobal();
  const t = (ctx) => translator(ctx, lang, TRANSLATE_COLLECTION.TOOLBAR);

  const islesRef = useRef(null);

  // ── Persist theme ──
  useEffect(() => {
    LOCALSTORAGE[STORE.OAK_HEART].setTheme(theme);
  }, [theme]);

  // ── Initial camera centering (after Isles is mounted) ──
  useEffect(() => {
    recenterCamera(islesRef, initialRef.current.nodes, initialRef.current.collapsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Esc closes modal ──
  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => { if (e.key === 'Escape') setModal(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal]);

  // ── Visible/edges/childCount derivation ──
  const { visibleNodes, edges, childCountById } = useMemo(() => {
    const hidden = hiddenIds(nodes, collapsedIds);
    const visible = nodes.filter(n => !hidden.has(n.id));
    const visIds = new Set(visible.map(n => n.id));
    const childrenOf = buildChildrenMap(nodes);
    const childCount = new Map();
    for (const [pid, kids] of childrenOf) childCount.set(pid, kids.length);
    const eds = visible
      .filter(n => n.parentId != null && visIds.has(n.parentId))
      .map(n => ({
        id: `${n.parentId}->${n.id}`,
        source: n.parentId,
        target: n.id,
      }));
    return { visibleNodes: visible, edges: eds, childCountById: childCount };
  }, [nodes, collapsedIds]);

  // Canonical JSON for the sidebar. Empty tree → empty string (sidebar
  // shows placeholder, no parse error). Otherwise pretty-printed.
  //
  // Deps are [structureVersion] (not [nodes]) on purpose: dragging, auto-
  // layout, and expand-driven re-layout all mutate `nodes` (positions) but
  // don't change structure, so the canonical string stays identical. With
  // huge JSON (the user hit a freeze at 1400KB), re-deriving this on every
  // layout pass dominated frame time. eslint-disable below is intentional.
  const canonicalJson = useMemo(() => {
    if (nodes.length === 0) return '';
    return JSON.stringify(nodesToJson(nodes), null, 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structureVersion]);

  // ── Persist JSON doc (debounced, content-equal skip) ──
  // String compare against the last write so position-only drag updates
  // (which create a fresh string instance with identical contents) don't
  // trigger writes.
  const lastSavedRef = useRef(null);
  useEffect(() => {
    if (lastSavedRef.current === null) {
      lastSavedRef.current = canonicalJson; // mount baseline, no write
      return;
    }
    if (canonicalJson === lastSavedRef.current) return;
    const timer = setTimeout(() => {
      try {
        // Empty canvas → persist null (treated as "no saved doc" on reload,
        // falls back to sample). Otherwise parse + save.
        const value = canonicalJson === '' ? null : JSON.parse(canonicalJson);
        LOCALSTORAGE[STORE.OAK_HEART].setJsonDoc(value);
        lastSavedRef.current = canonicalJson;
      } catch { /* canonicalJson should always be valid; ignore */ }
    }, 500);
    return () => clearTimeout(timer);
  }, [canonicalJson]);

  // Keep a ref for the drag bridge so it can read latest collapsedIds
  // without re-binding (drag bridge has empty useCallback deps for stable
  // identity passed to <Isles>).
  const collapsedIdsRef = useRef(collapsedIds);
  useEffect(() => { collapsedIdsRef.current = collapsedIds; }, [collapsedIds]);
  const dragWithChildrenRef = useRef(dragWithChildren);
  useEffect(() => { dragWithChildrenRef.current = dragWithChildren; }, [dragWithChildren]);
  const autoLayoutOnExpandRef = useRef(autoLayoutOnExpand);
  useEffect(() => { autoLayoutOnExpandRef.current = autoLayoutOnExpand; }, [autoLayoutOnExpand]);
  const lockedIdsRef = useRef(lockedIds);
  useEffect(() => { lockedIdsRef.current = lockedIds; }, [lockedIds]);

  // ── Bridge Isles' drag updater (visible array) → full nodes ──
  //
  // Spec / behavior:
  // - Isles owns drag detection and emits an updater function that
  //   applies one uniform (dx, dy) to its internal moving set. We
  //   diff the updater output against `currentVisible` to recover
  //   the moving ids and delta.
  // - When the "Drag with children" toolbar toggle is ON, expand the
  //   moving set to include every descendant of each moved id —
  //   including currently-hidden ones under collapsed branches.
  //   They ride along by the same delta, so re-expanding later finds
  //   them at the right offset.
  // - When OFF (default), only the directly-moved nodes shift.
  // - Drag is purely positional and DOES NOT bump structureVersion;
  //   the sidebar's canonical JSON is not re-derived per drag frame.
  // - Locks DO NOT block drag — the lock only constrains automatic
  //   layout, not manual moves.
  const handleElementsChange = useCallback((updater) => {
    setNodes(prev => {
      const hidden = hiddenIds(prev, collapsedIdsRef.current);
      const currentVisible = prev.filter(n => !hidden.has(n.id));
      const updated = typeof updater === 'function' ? updater(currentVisible) : updater;

      const movingIds = new Set();
      let dx = 0, dy = 0;
      for (let i = 0; i < updated.length; i++) {
        const a = updated[i], b = currentVisible[i];
        if (a.x !== b.x || a.y !== b.y) {
          movingIds.add(a.id);
          dx = a.x - b.x;
          dy = a.y - b.y;
        }
      }
      if (movingIds.size === 0) return prev;

      const expanded = new Set(movingIds);
      if (dragWithChildrenRef.current) {
        for (const id of movingIds) {
          for (const d of descendantsOf(prev, id)) expanded.add(d);
        }
      }

      return prev.map(n =>
        expanded.has(n.id) ? { ...n, x: n.x + dx, y: n.y + dy } : n
      );
    });
  }, []);

  // ── Stable action dispatcher passed to every Node ──
  // Rebuilt every render so closures see fresh state; dispatch() below
  // proxies through a stable identity to keep React.memo happy on Node.
  const actionsRef = useRef(null);
  actionsRef.current = {
    // Toggle collapse for one compound node.
    //
    // Spec / behavior:
    // - Flips the id in collapsedIds (collapse ↔ expand).
    // - When EXPANDING and "Auto-layout on expand" is ON (default
    //   true), run layoutSubtree anchored at this id: descendants
    //   are re-arranged based on the expanded node's position.
    //   Already-expanded grandchildren get re-arranged too (tidy-
    //   tree recurses naturally).
    // - Locked nodes (and their descendants) inside the subtree are
    //   NOT moved by this layout (spec: "ignore locked targets").
    // - layoutSubtree also dodges external siblings — pinned relax
    //   pushes the just-laid subtree away from the rest of the tree.
    // - When COLLAPSING: no layout runs (positions stay put so the
    //   subtree returns to the same shape on re-expand if auto-
    //   layout-on-expand is OFF).
    // - Not structural: structureVersion does NOT bump.
    toggle: (id) => {
      const wasCollapsed = collapsedIds.has(id);
      const nextCollapsed = new Set(collapsedIds);
      if (wasCollapsed) nextCollapsed.delete(id);
      else nextCollapsed.add(id);
      setCollapsedIds(nextCollapsed);
      if (wasCollapsed && autoLayoutOnExpand) {
        setNodes(prev => layoutSubtree(prev, id, nextCollapsed, lockedIds));
      }
    },
    lock: (id) => setLockedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    }),
    edit: (id) => setModal({ type: 'edit', nodeId: id }),
    rename: (id) => setModal({ type: 'rename', nodeId: id }),
    add: (id) => setModal({ type: 'add', nodeId: id }),
    delete: (id) => setModal({ type: 'delete', nodeId: id }),
  };
  const dispatch = useCallback((action, id) => {
    actionsRef.current?.[action]?.(id);
  }, []);

  // ── Toolbar actions ──

  // "Auto layout" button — global tidy-tree.
  //
  // Spec / behavior:
  // - Runs layoutTree on current nodes, respecting current collapse
  //   state and locks (frozen subtrees keep position; tidied nodes
  //   route around them via the pinned relax).
  // - Re-centers the camera between the root and the first visible
  //   child layer (visual cue that a global rearrange happened).
  // - Not structural: structureVersion does NOT bump.
  const handleAutoLayout = () => {
    const laid = layoutTree(nodes, collapsedIds, lockedIds);
    setNodes(laid);
    recenterCamera(islesRef, laid, collapsedIds);
  };

  // "Collapse all" button.
  //
  // Spec / behavior:
  // - Adds every compound id to collapsedIds.
  // - Does NOT trigger any layout — positions stay where they are,
  //   so re-expanding (without auto-layout-on-expand) returns the
  //   tree to its previous arrangement.
  const handleCollapseAll = () => {
    setCollapsedIds(allCompoundIds(nodes));
  };

  // "Expand all" button.
  //
  // Spec / behavior:
  // - Clears collapsedIds entirely.
  // - If "Auto-layout on expand" is ON, runs a GLOBAL layoutTree so
  //   the newly-revealed subtrees fan out properly. (Spec: "expand
  //   all" implicitly re-arranges by parent position; here it's
  //   simpler — once everything is visible there's no per-subtree
  //   anchor to worry about, so we just lay out the whole tree.)
  // - Locks are still respected: frozen subtrees keep their place.
  const handleExpandAll = () => {
    setCollapsedIds(new Set());
    if (autoLayoutOnExpand) {
      setNodes(prev => layoutTree(prev, new Set(), lockedIds));
    }
  };

  // "Reset" button — workspace reset; does NOT touch JSON content.
  //
  // Spec / behavior:
  // - Clears all locks (lockedIds → empty).
  // - Re-collapses via bfsInitialCollapse → back to the default
  //   visibility cap (INITIAL_VISIBLE_LIMIT).
  // - Runs a global layoutTree with no locks (clean tidy-tree).
  // - Re-centers the camera.
  // - Not structural: structureVersion does NOT bump (JSON unchanged).
  const handleReset = () => {
    setLockedIds(new Set());
    const collapsed = bfsInitialCollapse(nodes);
    setCollapsedIds(collapsed);
    const laid = layoutTree(nodes, collapsed, new Set());
    setNodes(laid);
    recenterCamera(islesRef, laid, collapsed);
  };

  const handleToggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  // Textarea → canvas. Single-field edits via inline buttons preserve node
  // identity/positions; whole-tree JSON edits rebuild from scratch.
  //
  // Camera policy:
  // - Existing canvas → edit: do NOT re-center. Textarea editing should
  //   feel like editing a document, not teleporting the view on every
  //   keystroke.
  // - Empty canvas → first content: DO re-center. There's nothing to
  //   preserve, and the freshly-laid root sits at world (0, ~0) which
  //   is rarely near the previous camera target — without this, a new
  //   single-node tree appears off-screen.
  //
  // `parsed === undefined` is the "textarea cleared" signal — canvas blanks.
  const handleJsonChange = (parsed) => {
    const wasEmpty = nodes.length === 0;
    if (parsed === undefined) {
      setNodes([]);
      setCollapsedIds(new Set());
      bumpStructure();
      return;
    }
    const init = buildInitialTree(parsed);
    setNodes(init.nodes);
    setCollapsedIds(init.collapsed);
    bumpStructure();
    if (wasEmpty) recenterCamera(islesRef, init.nodes, init.collapsed);
  };

  // ── Modal submit handlers ──
  const closeModal = () => setModal(null);

  const applyEditValue = (newType, newValue) => {
    if (!modal) return;
    setNodes(prev => setNodeValue(prev, modal.nodeId, newType, newValue));
    bumpStructure();
    setModal(null);
  };

  const applyRename = (newKey) => {
    if (!modal) return;
    setNodes(prev => renameKey(prev, modal.nodeId, newKey));
    bumpStructure();
    setModal(null);
  };

  // Add a new child under the modal's target.
  //
  // Spec / behavior:
  // - addChild places the new node at (parent.x + COL_W, parent.y +
  //   siblings.length * ROW_H) — a deterministic but naive spot.
  // - Without follow-up, the new node could overlap an existing
  //   sibling, so we run relaxCollisions on the result to push
  //   neighbors apart (spec: "新建元素时新元素会和其他元素重叠
  //   ... 用碰撞算法互相弹开").
  // - Locks are pinned during relax so frozen siblings stay put;
  //   only non-frozen neighbors move.
  // - Structural change: bumps structureVersion so the sidebar
  //   refreshes.
  const applyAddChild = (key, type) => {
    if (!modal) return;
    setNodes(prev => {
      const next = addChild(prev, modal.nodeId, key, type);
      return relaxCollisions(next, { pinnedIds: frozenSet(next, lockedIds) });
    });
    bumpStructure();
    setModal(null);
  };

  const applyDelete = () => {
    if (!modal) return;
    setNodes(prev => deleteSubtree(prev, modal.nodeId));
    setCollapsedIds(prev => {
      if (!prev.has(modal.nodeId)) return prev;
      const next = new Set(prev);
      next.delete(modal.nodeId);
      return next;
    });
    setLockedIds(prev => {
      if (!prev.has(modal.nodeId)) return prev;
      const next = new Set(prev);
      next.delete(modal.nodeId);
      return next;
    });
    bumpStructure();
    setModal(null);
  };

  // ── Build modal content (fresh node lookup at render time) ──
  const modalContent = useMemo(() => {
    if (!modal) return null;
    const node = nodes.find(n => n.id === modal.nodeId);
    if (!node) return null;
    switch (modal.type) {
      case 'edit':
        return <ModalEditValue node={node} onSubmit={applyEditValue} onCancel={closeModal} />;
      case 'rename':
        return <ModalRenameKey initialKey={node.key} onSubmit={applyRename} onCancel={closeModal} />;
      case 'add':
        return <ModalAddChild parentType={node.type} onSubmit={applyAddChild} onCancel={closeModal} />;
      case 'delete': {
        const desc = descendantsOf(nodes, modal.nodeId);
        return <ModalDeleteConfirm node={node} descendantCount={desc.size} onConfirm={applyDelete} onCancel={closeModal} />;
      }
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, nodes]);

  const renderElement = useCallback((el) => {
    const isCompound = el.type === 'object' || el.type === 'array';
    const parent = el.parentId != null ? nodes.find(n => n.id === el.parentId) : null;
    return (
      <Node
        node={el}
        childCount={childCountById.get(el.id) ?? 0}
        isCollapsed={collapsedIds.has(el.id)}
        isCompound={isCompound}
        canRename={parent != null && parent.type === 'object'}
        isLocked={lockedIds.has(el.id)}
        dispatch={dispatch}
      />
    );
  }, [nodes, childCountById, collapsedIds, lockedIds, dispatch]);

  return (
    <div className={`oak oak--${theme}`}>
      {/* Toolbar */}
      <div className="oak__toolbar">
        <span className="oak__nexus">
          <NexusButton menuDirection={DIRECTION.BOTTOM} />
        </span>
        <strong className="oak__title">{t(TOOLBAR_CONTEXT.TITLE)}</strong>
        <span className="oak__divider">|</span>
        <span>{t(TOOLBAR_CONTEXT.HINT_PAN)}</span>
        <span>·</span>
        <span>{t(TOOLBAR_CONTEXT.HINT_DRAG)}</span>
        <span>·</span>
        <span>{t(TOOLBAR_CONTEXT.HINT_ZOOM)}</span>
        <span className="oak__spacer" />
        <label className="oak__checkbox">
          <input
            type="checkbox"
            checked={dragWithChildren}
            onChange={(e) => setDragWithChildren(e.target.checked)}
          />
          <span>{t(TOOLBAR_CONTEXT.DRAG_WITH_CHILDREN)}</span>
        </label>
        <label className="oak__checkbox">
          <input
            type="checkbox"
            checked={autoLayoutOnExpand}
            onChange={(e) => setAutoLayoutOnExpand(e.target.checked)}
          />
          <span>{t(TOOLBAR_CONTEXT.AUTO_LAYOUT_ON_EXPAND)}</span>
        </label>
        <button className="oak__button" onClick={handleAutoLayout}>{t(TOOLBAR_CONTEXT.BUTTON_AUTO_LAYOUT)}</button>
        <button className="oak__button" onClick={handleCollapseAll}>{t(TOOLBAR_CONTEXT.BUTTON_COLLAPSE_ALL)}</button>
        <button className="oak__button" onClick={handleExpandAll}>{t(TOOLBAR_CONTEXT.BUTTON_EXPAND_ALL)}</button>
        <button
          className="oak__button"
          onClick={handleReset}
          title={t(TOOLBAR_CONTEXT.BUTTON_RESET_TIP)}
        >
          {t(TOOLBAR_CONTEXT.BUTTON_RESET)}
        </button>
        <button
          className="oak__theme-toggle"
          onClick={handleToggleTheme}
          title={theme === 'dark' ? t(TOOLBAR_CONTEXT.TOGGLE_TO_LIGHT) : t(TOOLBAR_CONTEXT.TOGGLE_TO_DARK)}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>

      {/* Body: canvas + sidebar */}
      <div className="oak__body">
        <div className="oak__canvas-wrap">
          <Isles
            ref={islesRef}
            elements={visibleNodes}
            onElementsChange={handleElementsChange}
            edges={edges}
            renderElement={renderElement}
            showGrid
            virtualize
            virtualizeOverscan={VIRTUALIZE_OVERSCAN}
            initialCamera={{ x: 60, y: 220, scale: 1 }}
            className="oak__canvas"
          />
        </div>

        <JsonSidebar
          canonicalJson={canonicalJson}
          onJsonChange={handleJsonChange}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(c => !c)}
          warningMessage={warningMessage}
          totalCount={nodes.length}
          hiddenCount={nodes.length - visibleNodes.length}
        />
      </div>

      <Modal component={modalContent} />
    </div>
  );
}
