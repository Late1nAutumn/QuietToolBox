import React from 'react';

/**
 * Positions a single element on the infinite canvas in world space.
 *
 * Props:
 *   element       – { id, x, y, width?, height? }
 *   zIndex        – number  computed by Isles from its order state
 *   isSelected    – boolean
 *   onMouseDown   – (e, id) => void  called on mousedown
 *   children      – rendered content
 */
export function CanvasItem({ element, zIndex, isSelected, onMouseDown, children }) {
  const { id, x, y, width, height } = element;

  return (
    <div
      className={`isles-item${isSelected ? ' isles-item--selected' : ''}`}
      style={{
        left: x,
        top: y,
        zIndex,
        width: width != null ? width : undefined,
        height: height != null ? height : undefined,
      }}
      onMouseDown={(e) => onMouseDown(e, id)}
    >
      {children}
    </div>
  );
}
