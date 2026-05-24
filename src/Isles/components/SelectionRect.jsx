import React from 'react';

/**
 * Renders the rubber-band selection rectangle.
 *
 * `rect` is in **world** coordinates; we convert to screen coords here.
 */
export function SelectionRect({ rect, camera }) {
  const { x: cx, y: cy, scale } = camera;

  const sx = rect.x * scale + cx;
  const sy = rect.y * scale + cy;
  const sw = rect.width * scale;
  const sh = rect.height * scale;

  return (
    <div
      className="isles-selection-rect"
      style={{ left: sx, top: sy, width: sw, height: sh }}
    />
  );
}
