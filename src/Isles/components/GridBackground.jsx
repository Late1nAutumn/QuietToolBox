import React, { useMemo } from 'react';
import {
  GRID_BASE_SIZE,
  GRID_MIN_PX,
  GRID_ACCENT_MULTIPLIER,
} from '../constant';

/**
 * Infinite SVG grid that follows the camera (pans + zooms with it).
 *
 * Density-stable across zoom levels via two-layer crossfade:
 *   - coarseCell is the nearest power-of-MULT step that keeps the cell
 *     ≥ GRID_MIN_PX on screen. It is ALWAYS opaque — the visible
 *     baseline grid.
 *   - fineCell = coarseCell / MULT. Its opacity fades from 0 (when its
 *     screen size is at GRID_MIN_PX, i.e. would be too dense) to 1
 *     (when coarseCell is one tick away from picking the next level
 *     up, at which point fineCell becomes the next coarse and the
 *     blend is seamless).
 *
 * Result: zoom in/out has no visible "snap" — one level's contribution
 * smoothly takes over from the next.
 */
export function GridBackground({ camera }) {
  const { x, y, scale } = camera;

  const layers = useMemo(() => {
    // Smallest non-negative integer level such that BASE*scale*MULT^level >= MIN.
    const baseScreen = GRID_BASE_SIZE * scale;
    const rawLevel = Math.log(GRID_MIN_PX / baseScreen) / Math.log(GRID_ACCENT_MULTIPLIER);
    const level = Math.max(0, Math.ceil(rawLevel));

    const coarse = baseScreen * Math.pow(GRID_ACCENT_MULTIPLIER, level);
    const fine = coarse / GRID_ACCENT_MULTIPLIER;

    // Fade fine in linearly as coarse grows from MIN → MIN*MULT.
    // At coarse=MIN: fine would be MIN/MULT, too dense → opacity 0.
    // At coarse=MIN*MULT: next level is about to take over → fine opacity 1.
    const t = (coarse - GRID_MIN_PX) / (GRID_MIN_PX * (GRID_ACCENT_MULTIPLIER - 1));
    const fineOpacity = Math.max(0, Math.min(1, t));

    const wrap = (v, mod) => ((v % mod) + mod) % mod;
    return {
      coarse,
      fine,
      fineOpacity,
      coarseOffsetX: wrap(x, coarse),
      coarseOffsetY: wrap(y, coarse),
      fineOffsetX: wrap(x, fine),
      fineOffsetY: wrap(y, fine),
    };
  }, [x, y, scale]);

  return (
    <svg className="isles-grid-svg" aria-hidden="true">
      <defs>
        <pattern
          id="isles-grid-fine"
          x={layers.fineOffsetX}
          y={layers.fineOffsetY}
          width={layers.fine}
          height={layers.fine}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${layers.fine} 0 L 0 0 0 ${layers.fine}`}
            fill="none"
            stroke="var(--isles-grid-color)"
            strokeWidth="0.5"
          />
        </pattern>
        <pattern
          id="isles-grid-coarse"
          x={layers.coarseOffsetX}
          y={layers.coarseOffsetY}
          width={layers.coarse}
          height={layers.coarse}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${layers.coarse} 0 L 0 0 0 ${layers.coarse}`}
            fill="none"
            stroke="var(--isles-grid-accent-color)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#isles-grid-fine)" opacity={layers.fineOpacity} />
      <rect width="100%" height="100%" fill="url(#isles-grid-coarse)" />
    </svg>
  );
}
