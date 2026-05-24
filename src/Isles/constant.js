// Camera zoom limits
export const MIN_SCALE = 0.05;
export const MAX_SCALE = 20;
export const ZOOM_STEP = 1.1;

// Grid sizing.
//   Two layers (fine + coarse) crossfade across zoom: coarseCell is always
//   >= GRID_MIN_PX (screen), fineCell = coarseCell / MULT. Fine layer fades
//   in linearly so there is no visible "snap" at level boundaries.
export const GRID_BASE_SIZE = 50;
export const GRID_MIN_PX = 20;
export const GRID_ACCENT_MULTIPLIER = 5;

// Default element box used by rubber-band hit testing
export const DEFAULT_ELEMENT_WIDTH = 120;
export const DEFAULT_ELEMENT_HEIGHT = 60;

// World-space px below which a drag is treated as a click, not a marquee
export const MIN_RUBBER_BAND_SIZE = 3;

// Edge rendering — visual stroke width (screen px, kept constant via
// SVG vector-effect) and minimum bezier control-point offset
export const EDGE_STROKE_WIDTH = 2;
export const EDGE_CONTROL_OFFSET_MIN = 40;

// Drag state machine
export const DRAG_TYPE = {
  IDLE: 'IDLE',
  PANNING: 'PANNING',
  SELECTING: 'SELECTING',
  MOVING: 'MOVING',
};
