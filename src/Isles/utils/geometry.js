/**
 * Normalize a rect from two corner points (handles negative width/height).
 */
export function normalizeRect(x1, y1, x2, y2) {
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  };
}

/**
 * Returns true if two axis-aligned rects overlap.
 */
export function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
