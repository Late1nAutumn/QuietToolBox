import { useState, useCallback } from 'react';
import { clamp } from '../utils/geometry';
import { MIN_SCALE, MAX_SCALE, ZOOM_STEP } from '../constant';

/**
 * Manages camera state: pan (x, y) and zoom (scale).
 *
 * Coordinate model:
 *   screenPos = worldPos * scale + { x, y }
 *   worldPos  = (screenPos - { x, y }) / scale
 */
export function useCamera(initial = { x: 0, y: 0, scale: 1 }) {
  const [camera, setCamera] = useState(initial);

  /** Translate the camera by (dx, dy) in screen pixels. */
  const pan = useCallback((dx, dy) => {
    setCamera(c => ({ ...c, x: c.x + dx, y: c.y + dy }));
  }, []);

  /**
   * Zoom in/out, keeping the point at (screenX, screenY) fixed in world space.
   * @param {number} deltaY  positive = zoom out, negative = zoom in
   */
  const zoomAt = useCallback((deltaY, screenX, screenY) => {
    setCamera(c => {
      const factor = deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP;
      const newScale = clamp(c.scale * factor, MIN_SCALE, MAX_SCALE);

      // World point under mouse must remain at the same screen pixel
      const wx = (screenX - c.x) / c.scale;
      const wy = (screenY - c.y) / c.scale;

      return {
        scale: newScale,
        x: screenX - wx * newScale,
        y: screenY - wy * newScale,
      };
    });
  }, []);

  return { camera, pan, zoomAt, setCamera };
}
