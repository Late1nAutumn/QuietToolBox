import React from 'react';
import {
  DEFAULT_ELEMENT_WIDTH,
  DEFAULT_ELEMENT_HEIGHT,
  EDGE_STROKE_WIDTH,
  EDGE_CONTROL_OFFSET_MIN,
} from '../constant';

/**
 * Renders connection lines between elements as cubic-bezier paths.
 * Lives below the cards layer, above the grid.
 *
 * Edge shape: { id?, source: elementId, target: elementId }
 *
 * Anchor points: right-edge midpoint of source → left-edge midpoint of
 * target. Stroke is kept at a constant screen width via vector-effect.
 */
export function EdgeLayer({ edges, elements, camera }) {
  if (!edges || edges.length === 0) return null;

  const { x: cx, y: cy, scale } = camera;
  const byId = new Map(elements.map(el => [el.id, el]));

  return (
    <svg className="isles-edge-svg" aria-hidden="true">
      <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
        {edges.map(edge => {
          const s = byId.get(edge.source);
          const t = byId.get(edge.target);
          if (!s || !t) return null;

          const sw = s.width ?? DEFAULT_ELEMENT_WIDTH;
          const sh = s.height ?? DEFAULT_ELEMENT_HEIGHT;
          const th = t.height ?? DEFAULT_ELEMENT_HEIGHT;

          const x1 = s.x + sw;
          const y1 = s.y + sh / 2;
          const x2 = t.x;
          const y2 = t.y + th / 2;

          const offset = Math.max(
            Math.abs(x2 - x1) * 0.5,
            EDGE_CONTROL_OFFSET_MIN
          );
          const c1x = x1 + offset;
          const c2x = x2 - offset;
          const d = `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;

          return (
            <path
              key={edge.id ?? `${edge.source}->${edge.target}`}
              d={d}
              fill="none"
              stroke="var(--isles-edge-color)"
              strokeWidth={EDGE_STROKE_WIDTH}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </g>
    </svg>
  );
}
