// #region Enum
export const INTERFACE_MODE = {
  SELECTOR: 0,
  DISPLAYER: 1,
};
export const COLOR_MODE = {
  HSV: 0,
  HSL: 1,
};
// #endregion

// #region Constant
// UI
// numbers for elevation is negetived for range bar direction
export const MIN_ELEVATION = -30;
export const MAX_ELEVATION = 90;
export const DEFAULT_ELEVATION = 30;

export const MIN_AZIMUTH = -30;
export const MAX_AZIMUTH = 390;
export const DEFAULT_AZIMUTH = 0;

export const MIN_SATURATION = 0;
export const MIN_RADIUS = 0.01;
export const MAX_RADIUS = 1; // ratio, should always be 1
export const DEFAULT_RADIUS = 0.3;

export const MIN_ALTITUDE = 0;
export const MAX_ALTITUDE = 1;
export const DEFAULT_ALTITUDE = 0.5;

export const MIN_RADIUS_SCALE = 0.5;
export const MAX_RADIUS_SCALE = 3;
export const DEFAULT_RADIUS_SCALE = 1;

export const MIN_HEIGHT_SCALE = 0.5;
export const MAX_HEIGHT_SCALE = 3;
export const DEFAULT_HEIGHT_SCALE = 1;

export const MIN_ALPHA = 0;
export const MAX_ALPHA = 1;
export const DEFAULT_ALPHA = 0.7;

export const MIN_SPHERE_RADIUS = 0.01;
export const MAX_SPHERE_RADIUS = 0.3;
export const DEFAULT_SPHERE_RADIUS = 0.055;
export const DEFAULT_SPHERE_BORDER_SCALE = 1.1; // % inner sphere radius

export const DEFAULT_COLOR_LIST = [
  { visible: true, r: 0.9333, g: 0.8549, b: 0.6157 }, // #EEDA9D
  { visible: true, r: 0.7882, g: 0.5098, b: 0.4196 }, // #C9826B
  { visible: true, r: 0.7804, g: 0.7098, b: 0.6824 }, // #C7B5AE
  { visible: true, r: 0.9451, g: 0.8902, b: 0.8275 }, // #F1E3D3
  { visible: true, r: 0.1725, g: 0.1725, b: 0.1725 }, // #2C2C2C
  { visible: true, r: 0.6706, g: 0.5451, b: 0.3961 }, // #AB8B65
  { visible: true, r: 0.702, g: 0.2314, b: 0.1725 }, // #B33B2C
  { visible: true, r: 0.8902, g: 0.8902, b: 0.8863 }, // #E3E3E2
];

// mouse sensitive
export const ELEVATION_SENSITIVITY = -0.5;
export const HUE_SENSITIVITY = -1;
export const SATURATION_SENSITIVITY = 0.003;
export const BRIGHTNESS_SENSITIVITY = -0.005;

// rendering
export const CAMERA_POSITION = [0, 1.6, 6.2];
export const CAMERA_TARGET = [0, 0, 0];
export const CAMERA_UP = [0, 1, 0];
export const CAMERA_FOV = 48;
export const CAMERA_VISION_NEAR = 0.3; // avoid 1/dist in calculation, and keep resolution consistant
export const CAMERA_VISION_FAR = 18;

export const CYLINDER_SEGMENTS = 72;
export const RING_SEGMENTS = 72;
export const SPHERE_GRID_COUNTS = 12;
export const SPHERE_BORDER_RGB = [0, 0, 0]; // black

export const PALETTE_ARROW_WIDTH = 2;
export const PALETTE_ARROW_COLOR = "white";
export const PALETTE_MARKER_RADIUS = 6;
export const PALETTE_BORDER_WIDTH = 2;
// #endregion

export const COLOR_THEME_PRIMARY = "#ff884d";
