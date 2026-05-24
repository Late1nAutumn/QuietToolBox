import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useCamera } from './hooks/useCamera';
import { CanvasItem } from './components/CanvasItem';
import { SelectionRect } from './components/SelectionRect';
import { GridBackground } from './components/GridBackground';
import { EdgeLayer } from './components/EdgeLayer';
import { normalizeRect, rectsOverlap } from './utils/geometry';
import {
  DRAG_TYPE,
  DEFAULT_ELEMENT_WIDTH,
  DEFAULT_ELEMENT_HEIGHT,
  MIN_RUBBER_BAND_SIZE,
  MIN_SCALE,
  MAX_SCALE,
} from './constant';

/**
 * Isles — modular infinite canvas. See README for full API reference.
 *
 * Props (additions; see README §1 for the full list):
 *   virtualize           boolean   When true, only renders elements whose
 *                                  AABB overlaps the camera viewport (+overscan).
 *                                  Edges still receive the full element list,
 *                                  so connection lines render correctly even
 *                                  when one endpoint is off-screen.
 *   virtualizeOverscan   number    World-space padding around the viewport used
 *                                  when deciding what to mount (default 200).
 *
 * Imperative API (via forwarded ref; see README §13):
 *   getCamera()                      → { x, y, scale }
 *   setCamera({ x, y, scale })       Set camera directly.
 *   centerOn({ x, y, scale? })       Pan so that world point (x, y) lands at
 *                                    the container center. scale optional.
 *   fitToContent(elements?, padding?) Zoom + pan so the given elements'
 *                                    bounding box fills the container minus
 *                                    `padding` (default 80). elements omitted
 *                                    → uses current props.elements.
 */
export const Isles = forwardRef(function Isles({
  elements,
  onElementsChange,
  renderElement,
  edges,
  showGrid = true,
  initialCamera,
  virtualize = false,
  virtualizeOverscan = 200,
  className = '',
  style = {},
}, ref) {
  const containerRef = useRef(null);
  const { camera, pan, zoomAt, setCamera } = useCamera(initialCamera);

  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [selectionRect, setSelectionRect] = useState(null); // world coords

  // Internal stacking order: array of element ids, later = on top.
  // Reconciled with `elements` (add/remove) via the effect below;
  // re-ordered when a user clicks an element (bring-to-front).
  const [order, setOrder] = useState(() => elements.map(el => el.id));

  useEffect(() => {
    setOrder(prev => {
      const ids = new Set(elements.map(el => el.id));
      const sameSet =
        prev.length === ids.size && prev.every(id => ids.has(id));
      if (sameSet) return prev;
      const kept = prev.filter(id => ids.has(id));
      const keptSet = new Set(kept);
      elements.forEach(el => {
        if (!keptSet.has(el.id)) kept.push(el.id);
      });
      return kept;
    });
  }, [elements]);

  // ── Refs for stable event handlers (avoid stale closures) ─────────────
  const cameraRef = useRef(camera);
  const elementsRef = useRef(elements);
  const onElementsChangeRef = useRef(onElementsChange);
  const selectedIdsRef = useRef(selectedIds);

  useEffect(() => { cameraRef.current = camera; }, [camera]);
  useEffect(() => { elementsRef.current = elements; }, [elements]);
  useEffect(() => { onElementsChangeRef.current = onElementsChange; }, [onElementsChange]);
  useEffect(() => { selectedIdsRef.current = selectedIds; }, [selectedIds]);

  // Drag state lives in a ref — no re-render needed while dragging.
  const dragRef = useRef({ type: DRAG_TYPE.IDLE });

  // ── Container size (tracked only when virtualizing) ────────────────────
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!virtualize) return;
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setContainerSize({ width: r.width, height: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [virtualize]);

  // ── Helper: client → container-local coords ───────────────────────────
  const toLocal = (clientX, clientY) => {
    const r = containerRef.current.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };

  const toWorld = (localX, localY, cam = cameraRef.current) => ({
    x: (localX - cam.x) / cam.scale,
    y: (localY - cam.y) / cam.scale,
  });

  // ── Imperative API ─────────────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    getCamera: () => cameraRef.current,
    setCamera: (c) => setCamera(c),
    centerOn: ({ x, y, scale }) => {
      const r = containerRef.current?.getBoundingClientRect();
      if (!r) return;
      const s = scale ?? cameraRef.current.scale;
      setCamera({
        x: r.width / 2 - x * s,
        y: r.height / 2 - y * s,
        scale: s,
      });
    },
    fitToContent: (els, padding = 80) => {
      const r = containerRef.current?.getBoundingClientRect();
      const list = els ?? elementsRef.current;
      if (!r || !list || list.length === 0) return;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const el of list) {
        const w = el.width ?? DEFAULT_ELEMENT_WIDTH;
        const h = el.height ?? DEFAULT_ELEMENT_HEIGHT;
        if (el.x < minX) minX = el.x;
        if (el.y < minY) minY = el.y;
        if (el.x + w > maxX) maxX = el.x + w;
        if (el.y + h > maxY) maxY = el.y + h;
      }
      const cw = Math.max(1, maxX - minX);
      const ch = Math.max(1, maxY - minY);
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const sx = (r.width - padding * 2) / cw;
      const sy = (r.height - padding * 2) / ch;
      const s = Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.min(sx, sy)));
      setCamera({
        x: r.width / 2 - cx * s,
        y: r.height / 2 - cy * s,
        scale: s,
      });
    },
  }), [setCamera]);

  // ── Wheel → zoom ───────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      const { x, y } = toLocal(e.clientX, e.clientY);
      zoomAt(e.deltaY, x, y);
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [zoomAt]);

  // ── Global mouse move / up (registered once, always current via refs) ──
  useEffect(() => {
    const onMove = (e) => {
      const drag = dragRef.current;

      if (drag.type === DRAG_TYPE.PANNING) {
        pan(e.clientX - drag.lastX, e.clientY - drag.lastY);
        dragRef.current = { ...drag, lastX: e.clientX, lastY: e.clientY };
        return;
      }

      if (drag.type === DRAG_TYPE.SELECTING) {
        const { x, y } = toLocal(e.clientX, e.clientY);
        const w = toWorld(x, y);
        const rect = normalizeRect(
          drag.startWorld.x, drag.startWorld.y,
          w.x, w.y
        );
        dragRef.current = { ...drag, currentWorld: w };
        setSelectionRect(rect);
        return;
      }

      if (drag.type === DRAG_TYPE.MOVING) {
        const c = cameraRef.current;
        const dx = (e.clientX - drag.lastX) / c.scale;
        const dy = (e.clientY - drag.lastY) / c.scale;
        dragRef.current = { ...drag, lastX: e.clientX, lastY: e.clientY };

        if (dx === 0 && dy === 0) return;

        const ids = drag.movingIds;
        onElementsChangeRef.current(prev =>
          prev.map(el =>
            ids.has(el.id)
              ? { ...el, x: el.x + dx, y: el.y + dy }
              : el
          )
        );
      }
    };

    const onUp = (e) => {
      const drag = dragRef.current;
      dragRef.current = { type: DRAG_TYPE.IDLE };

      if (drag.type === DRAG_TYPE.SELECTING) {
        setSelectionRect(null);

        // Build final selection rect using last known mouse position
        const { x, y } = toLocal(e.clientX, e.clientY);
        const w = toWorld(x, y);
        const selRect = normalizeRect(
          drag.startWorld.x, drag.startWorld.y,
          w.x, w.y
        );

        // Only treat as rubber-band if dragged a meaningful distance
        if (selRect.width < MIN_RUBBER_BAND_SIZE && selRect.height < MIN_RUBBER_BAND_SIZE) return;

        const matched = new Set();
        elementsRef.current.forEach(el => {
          const elRect = {
            x: el.x,
            y: el.y,
            width: el.width ?? DEFAULT_ELEMENT_WIDTH,
            height: el.height ?? DEFAULT_ELEMENT_HEIGHT,
          };
          if (rectsOverlap(selRect, elRect)) matched.add(el.id);
        });

        if (drag.additive) {
          setSelectedIds(prev => new Set([...prev, ...matched]));
        } else {
          setSelectedIds(matched);
        }
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [pan]); // pan is stable (useCallback [])

  // ── Canvas background mousedown ────────────────────────────────────────
  const handleMouseDown = useCallback((e) => {
    // button 2 = right → pan
    if (e.button === 2) {
      dragRef.current = { type: DRAG_TYPE.PANNING, lastX: e.clientX, lastY: e.clientY };
      return;
    }

    // button 0 = left on background → selection rect
    if (e.button === 0) {
      if (!e.shiftKey) setSelectedIds(new Set());
      const { x, y } = toLocal(e.clientX, e.clientY);
      const startWorld = toWorld(x, y);
      dragRef.current = {
        type: DRAG_TYPE.SELECTING,
        startWorld,
        additive: e.shiftKey,
      };
    }
  }, []);

  // ── Element mousedown ──────────────────────────────────────────────────
  const handleElementMouseDown = useCallback((e, elementId) => {
    // button 0 = left; ignore anything else
    if (e.button !== 0) return;
    e.stopPropagation(); // Don't trigger canvas's mousedown

    // Compute next selection synchronously so dragRef and setState see the
    // same value. (React 18 batches the updater — reading it via closure
    // would race with the mousedown's dragRef assignment.)
    const prev = selectedIdsRef.current;
    let next;
    if (e.shiftKey) {
      // Toggle this element in selection
      next = new Set(prev);
      if (next.has(elementId)) next.delete(elementId);
      else next.add(elementId);
    } else if (prev.has(elementId)) {
      // Keep current multi-selection (allows dragging a group)
      next = prev;
    } else {
      // Select only this element
      next = new Set([elementId]);
    }

    setSelectedIds(next);

    // Bring all soon-to-move elements to front, preserving their relative order
    setOrder(prevOrder => {
      const back = prevOrder.filter(id => !next.has(id));
      const front = prevOrder.filter(id => next.has(id));
      return [...back, ...front];
    });

    dragRef.current = {
      type: DRAG_TYPE.MOVING,
      lastX: e.clientX,
      lastY: e.clientY,
      movingIds: next,
    };
  }, []);

  // ── Sort + (optional) cull ─────────────────────────────────────────────
  const orderIndex = useMemo(
    () => new Map(order.map((id, i) => [id, i])),
    [order]
  );

  const sortedElements = useMemo(
    () => [...elements].sort(
      (a, b) => (orderIndex.get(a.id) ?? -1) - (orderIndex.get(b.id) ?? -1)
    ),
    [elements, orderIndex]
  );

  // Visible-for-render list. Edges still receive the FULL element list, so
  // a line whose endpoint is off-screen still draws correctly — only the
  // off-screen card's DOM is omitted.
  const renderedElements = useMemo(() => {
    if (!virtualize || containerSize.width === 0) return sortedElements;
    const { x: cx2, y: cy2, scale: s } = camera;
    const viewX = (-cx2) / s - virtualizeOverscan;
    const viewY = (-cy2) / s - virtualizeOverscan;
    const viewW = containerSize.width / s + virtualizeOverscan * 2;
    const viewH = containerSize.height / s + virtualizeOverscan * 2;
    return sortedElements.filter(el => {
      const w = el.width ?? DEFAULT_ELEMENT_WIDTH;
      const h = el.height ?? DEFAULT_ELEMENT_HEIGHT;
      return !(
        el.x + w < viewX ||
        el.x > viewX + viewW ||
        el.y + h < viewY ||
        el.y > viewY + viewH
      );
    });
  }, [sortedElements, virtualize, virtualizeOverscan, camera, containerSize]);

  // ── Render ─────────────────────────────────────────────────────────────
  const { x: cx, y: cy, scale } = camera;
  const worldTransform = `translate(${cx}px, ${cy}px) scale(${scale})`;

  return (
    <div
      ref={containerRef}
      className={`isles-root${className ? ` ${className}` : ''}`}
      style={style}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      {showGrid && <GridBackground camera={camera} />}

      {/* Edge layer — drawn below cards, above grid. Receives full elements
          list so off-screen endpoints still resolve to valid coordinates. */}
      <EdgeLayer edges={edges} elements={elements} camera={camera} />

      {/* World layer — transform places world-origin at camera position */}
      <div className="isles-world" style={{ transform: worldTransform }}>
        {renderedElements.map(el => (
          <CanvasItem
            key={el.id}
            element={el}
            zIndex={orderIndex.get(el.id) ?? 0}
            isSelected={selectedIds.has(el.id)}
            onMouseDown={handleElementMouseDown}
          >
            {renderElement(el, selectedIds.has(el.id))}
          </CanvasItem>
        ))}
      </div>

      {/* Rubber-band selection rectangle */}
      {selectionRect && (
        <SelectionRect rect={selectionRect} camera={camera} />
      )}
    </div>
  );
});
