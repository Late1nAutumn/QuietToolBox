import {
  CAMERA_FOV,
  CAMERA_POSITION,
  CAMERA_TARGET,
  CAMERA_UP,
  CAMERA_VISION_FAR,
  CAMERA_VISION_NEAR,
  COLOR_MODE,
  COLOR_THEME_PRIMARY,
  CYLINDER_SEGMENTS,
  DEFAULT_ALTITUDE,
  DEFAULT_HEIGHT_SCALE,
  DEFAULT_RADIUS,
  DEFAULT_RADIUS_SCALE,
  DEFAULT_SPHERE_RADIUS,
  INTERFACE_MODE,
  MAX_RADIUS,
  MIN_RADIUS,
  PALETTE_BORDER_WIDTH,
  PALETTE_ARROW_COLOR,
  PALETTE_ARROW_WIDTH,
  PALETTE_MARKER_RADIUS,
  RING_SEGMENTS,
  DEFAULT_SPHERE_BORDER_SCALE,
  SPHERE_BORDER_RGB,
  SPHERE_GRID_COUNTS,
  MAX_AZIMUTH,
} from "./constants";
import { rgbToHsl, rgbToHsv } from "./util";

// #region geometry
function generateCylinderGeometry(
  cylinderR,
  scale,
  height,
  seg,
  midYActual,
  includeTopAndMid,
) {
  const discR = 1;
  const halfH = height / 2;
  const scaledCylR = Math.max(cylinderR * scale, MIN_RADIUS);
  const sidePositions = [];
  const sideIndices = [];
  const topIdx = [],
    bottomIdx = [];
  for (let i = 0; i <= seg; i++) {
    const theta = (i / seg) * Math.PI * 2;
    const x = scaledCylR * Math.cos(theta),
      z = scaledCylR * Math.sin(theta);
    sidePositions.push(x, halfH, z);
    topIdx.push(sidePositions.length / 3 - 1);
    sidePositions.push(x, -halfH, z);
    bottomIdx.push(sidePositions.length / 3 - 1);
  }
  for (let i = 0; i < seg; i++) {
    const tl = topIdx[i],
      tr = topIdx[i + 1];
    const bl = bottomIdx[i],
      br = bottomIdx[i + 1];
    sideIndices.push(tl, tr, bl);
    sideIndices.push(tr, br, bl);
  }
  const sideVertCount = sideIndices.length;

  function addDisc(yCenter, radius, positions, indices) {
    const scaledRad = radius * scale;
    const centerTop = positions.length / 3;
    positions.push(0, yCenter, 0);
    const edgeStart = positions.length / 3;
    for (let i = 0; i <= seg; i++) {
      const theta = (i / seg) * Math.PI * 2;
      const x = scaledRad * Math.cos(theta),
        z = scaledRad * Math.sin(theta);
      positions.push(x, yCenter, z);
    }
    for (let i = 0; i < seg; i++)
      indices.push(centerTop, edgeStart + i, edgeStart + i + 1);
    const centerBottom = positions.length / 3;
    positions.push(0, yCenter, 0);
    const edgeStartB = positions.length / 3;
    for (let i = 0; i <= seg; i++) {
      const theta = (i / seg) * Math.PI * 2;
      const x = scaledRad * Math.cos(theta),
        z = scaledRad * Math.sin(theta);
      positions.push(x, yCenter, z);
    }
    for (let i = 0; i < seg; i++)
      indices.push(centerBottom, edgeStartB + i + 1, edgeStartB + i);
  }
  const discPositions = [];
  const discIndices = [];
  addDisc(-halfH, discR, discPositions, discIndices);
  if (includeTopAndMid) {
    addDisc(halfH, cylinderR, discPositions, discIndices);
    addDisc(
      Math.min(halfH, Math.max(-halfH, midYActual)),
      discR,
      discPositions,
      discIndices,
    );
  }
  const discVertCount = discIndices.length;
  return {
    sidePositions: new Float32Array(sidePositions),
    sideIndices: new Uint16Array(sideIndices),
    sideVertexCount: sideVertCount,
    discPositions: new Float32Array(discPositions),
    discIndices: new Uint16Array(discIndices),
    discVertexCount: discVertCount,
  };
}
function generateMidIntersectionGeometry(radius, scale, seg) {
  const scaledRad = radius * scale;
  const positions = [];
  for (let i = 0; i <= seg; i++) {
    const theta = (i / seg) * Math.PI * 2;
    const x = scaledRad * Math.cos(theta);
    const z = scaledRad * Math.sin(theta);
    positions.push(x, 0, z);
  }
  return positions;
}
function generateLevelRingGeometry(radius, scale, seg) {
  return generateMidIntersectionGeometry(radius, scale, seg);
}
function generateArrowGeometry(len) {
  const w = 0.005;
  const vertices = [
    -w,
    -w,
    0,
    w,
    -w,
    0,
    w,
    w,
    0,
    -w,
    w,
    0,
    -w,
    -w,
    len,
    w,
    -w,
    len,
    w,
    w,
    len,
    -w,
    w,
    len,
  ];
  const indices = [
    0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6, 0, 4, 1, 1, 4, 5, 2, 6, 3, 3, 6, 7, 3,
    7, 2, 2, 7, 6, 0, 1, 4, 1, 5, 4,
  ];
  return { vertices, indices };
}
function generateSphereGeometry(radius) {
  let rings = SPHERE_GRID_COUNTS,
    sectors = SPHERE_GRID_COUNTS;
  const positions = [];
  const indices = [];
  for (let i = 0; i <= rings; i++) {
    const phi = (Math.PI * i) / rings;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    for (let j = 0; j <= sectors; j++) {
      const theta = (2 * Math.PI * j) / sectors;
      const x = radius * sinPhi * Math.cos(theta);
      const y = radius * cosPhi;
      const z = radius * sinPhi * Math.sin(theta);
      positions.push(x, y, z);
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < sectors; j++) {
      const a = i * (sectors + 1) + j;
      const b = a + 1;
      const c = b + sectors;
      const d = c + 1;
      indices.push(a, b, c, b, d, c);
    }
  }
  return { positions, indices };
}
// #endregion

// #region color calculation for palette
function getRGBFromWheel(mode, hue, saturation, brightness) {
  switch (mode) {
    case COLOR_MODE.HSV:
      return hsv2rgb(hue, saturation, brightness);
    case COLOR_MODE.HSL:
      return hsl2rgb(hue, saturation, brightness);
  }
}
function hsv2rgb(h, s, v) {
  let r, g, b;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    default:
      r = v;
      g = p;
      b = q;
      break;
  }
  return [r, g, b];
}
function hsl2rgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r, g, b];
}
function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function rgb2hsv(r, g, b) {
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let v = max,
    d = max - min;
  let s = max === 0 ? 0 : d / max;
  let h = 0;
  if (max !== min) {
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h, s, v];
}
function rgb2hsl(r, g, b) {
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let l = (max + min) / 2;
  let s = 0,
    h = 0;
  if (max !== min) {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h, s, l];
}
// #endregion

// #region matrix
// #region operator
function normalize(v) {
  const len = Math.hypot(v[0], v[1], v[2]);
  if (len < 1e-6) return [0, 0, 0];
  return [v[0] / len, v[1] / len, v[2] / len];
}
function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function subVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function multiplyMatrices(a, b) {
  let res = new Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      res[j * 4 + i] = 0;
      for (let k = 0; k < 4; k++) {
        res[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k];
      }
    }
  }
  return res;
}
// #endregion
// cemera
function createViewMatrix(eye, target, up) {
  const z = normalize(subVectors(eye, target));
  const x = normalize(cross(up, z));
  const y = normalize(cross(z, x));
  return [
    x[0],
    x[1],
    x[2],
    0,
    y[0],
    y[1],
    y[2],
    0,
    z[0],
    z[1],
    z[2],
    0,
    -dot(x, eye),
    -dot(y, eye),
    -dot(z, eye),
    1,
  ];
}
// 3D to 2D screen
function createProjectionMatrix(aspect, fovDeg, near, far) {
  const f = 1.0 / Math.tan((fovDeg * Math.PI) / 360);
  const rangeInv = 1.0 / (near - far);
  return [
    f / aspect,
    0,
    0,
    0,
    0,
    f,
    0,
    0,
    0,
    0,
    (far + near) * rangeInv,
    -1,
    0,
    0,
    2 * far * near * rangeInv,
    0,
  ];
}

function createModelRotationMatrix(azimuthDeg, elevationDeg) {
  const azRad = (azimuthDeg * Math.PI) / 180;
  const elRad = (elevationDeg * Math.PI) / 180;
  const cosAz = Math.cos(azRad),
    sinAz = Math.sin(azRad);
  const cosEl = Math.cos(elRad),
    sinEl = Math.sin(elRad);
  const ry = [cosAz, 0, sinAz, 0, 0, 1, 0, 0, -sinAz, 0, cosAz, 0, 0, 0, 0, 1];
  const rx = [1, 0, 0, 0, 0, cosEl, -sinEl, 0, 0, sinEl, cosEl, 0, 0, 0, 0, 1];
  function mul4(a, b) {
    let res = new Array(16);
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) {
        res[j * 4 + i] = 0;
        for (let k = 0; k < 4; k++)
          res[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k];
      }
    return res;
  }
  return mul4(rx, ry);
}
// for arrow rotation
function createPitchOnlyMatrix(elevationDeg) {
  const elRad = (elevationDeg * Math.PI) / 180;
  const cosEl = Math.cos(elRad),
    sinEl = Math.sin(elRad);
  return [1, 0, 0, 0, 0, cosEl, -sinEl, 0, 0, sinEl, cosEl, 0, 0, 0, 0, 1];
}
// #endregion

export class GL {
  constructor() {
    this.gl = null;
    this.ready = false;

    // #region buffers & temp variables
    this.cylinderSideBuffers = {};
    this.cylinderSideVertexCount = 0;

    this.discBuffers = {};
    this.discVertexCount = 0;

    this.midIntersectionBuffer = null;
    this.midIntersectionVertexCount = 0;

    this.ringItems = [];
    this.ringVertexBuffer = null;
    this.ringVertexCount = 0;

    this.arrowVertexBuffer = null;
    this.arrowIndexBuffer = null;
    this.arrowIndexCount = 0;

    this.spherePositions = []; // { r,g,b, x,y,z }
    this.sphereVertexBuffer = null;
    this.sphereIndexBuffer = null;
    this.sphereIndexCount = 0;
    // #endregion

    // #region shader programs
    this.cylinderProgram = null;
    this.discProgram = null;
    this.sphereProgram = null; // sharing with sphere border
    this.ringProgram = null;
    this.arrowProgram = null;
    // #endregion
  }

  static rgbToPosition(r, g, b, colorMode, heightScale, radiusScale) {
    let halfH = heightScale / 2;
    let h, s, lightness;
    if (colorMode === COLOR_MODE.HSV) {
      const [hue, sat, val] = rgbToHsv(r, g, b);
      h = hue;
      s = sat;
      lightness = val;
    } else {
      const [hue, sat, lig] = rgbToHsl(r, g, b);
      h = hue;
      s = sat;
      lightness = lig;
    }
    let radius = s;
    let normY = 1 - 2 * lightness;
    let y = normY * halfH;
    y = Math.min(halfH, Math.max(-halfH, y));
    const angle = h * 2 * Math.PI;
    const x = radius * Math.cos(angle) * radiusScale;
    const z = radius * Math.sin(angle) * radiusScale;
    return { x, y, z };
  }

  static getRGBFromSelection({ colorMode, azimuth, innerRadius, altitude }) {
    const rotationRad = (azimuth * Math.PI) / 180;
    const brightness = (1 - altitude) / 2;

    let rawAngleIntersect = -Math.PI / 2;
    let angleIntersect = rawAngleIntersect - rotationRad;
    angleIntersect =
      ((angleIntersect % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    let hueIntersect = (angleIntersect / (2 * Math.PI) + 0.5) % 1.0;
    return getRGBFromWheel(colorMode, hueIntersect, innerRadius, brightness);
  }

  static rgbToStates(r, g, b, { colorMode }) {
    let h, s, l;
    switch (colorMode) {
      case COLOR_MODE.HSV:
        [h, s, l] = rgbToHsv(r, g, b);
        break;
      case COLOR_MODE.HSL:
        [h, s, l] = rgbToHsl(r, g, b);
        break;
      default:
        console.log("converter not implemented for color mode " + colorMode);
        break;
    }
    let azimuth = GL.offsetHue(h * 360);
    if (azimuth >= 360) azimuth -= 360;
    if (azimuth < 0) azimuth += 360;

    return {
      innerRadius: s,
      altitude: Math.min(1, Math.max(-1, GL.offsetBrightness(l))), // limit range
      azimuth,
    };
  }

  // #region offset functions
  // set GL value from UI
  static offsetElevation(x) {
    return -14.5 - x;
  }
  // set UI value from GL
  static arcOffsetElevation(y) {
    return -14.5 - y;
  }
  static offsetHue(x) {
    return 90 - x;
  }
  static arcOffsetHue(y) {
    return 90 - y;
  }
  static offsetBrightness(x) {
    return 1 - 2 * x;
  }
  static arcOffsetBrightness(y) {
    return (1 - y) / 2;
  }
  static offsetHeightScale(x) {
    return x * 2;
  }
  static arcOffsetHeightScale(y) {
    return y / 2;
  }
  // #endregion

  init(params) {
    const { canvasRef } = params;
    if (!this.#initGL(canvasRef)) {
      throw new Error({ desc: "GL init failure" });
    }

    this.cylinderProgram = this.#initCylinderShaders();
    this.discProgram = this.#initDiscShaders();
    this.sphereProgram = this.#initSphereShaders();
    this.ringProgram = this.#initRingShaders();
    this.midIntersectionProgram = this.#initMidIntersectionShaders();
    this.arrowProgram = this.#initArrowShaders();
    if (
      !this.cylinderProgram ||
      !this.discProgram ||
      !this.sphereProgram ||
      !this.ringProgram ||
      !this.arrowProgram
    )
      throw new Error({ desc: "Missing shader program" });

    this.#initBuffers();
    this.ready = true;

    this.onWindowResize(params);
    this.recalculate(params);
    this.render(params);
  }
  render(params) {
    if (!this.gl) return;
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    let { canvasRef, interfaceMode, elevation, azimuth } = params;

    const aspect = canvasRef.current.width / canvasRef.current.height;
    const proj = createProjectionMatrix(
      aspect,
      CAMERA_FOV,
      CAMERA_VISION_NEAR,
      CAMERA_VISION_FAR,
    );
    const view = createViewMatrix(CAMERA_POSITION, CAMERA_TARGET, CAMERA_UP);
    const cylinderRotMat = createModelRotationMatrix(azimuth, elevation);

    this.gl.depthMask(true);
    this.gl.disable(this.gl.BLEND);
    this.#renderDiscs(view, proj, cylinderRotMat, params);
    if (interfaceMode === INTERFACE_MODE.DISPLAYER)
      this.#renderSpheres(view, proj, cylinderRotMat);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.depthMask(false);
    this.#renderCylinderSide(view, proj, cylinderRotMat, params);
    if (interfaceMode === INTERFACE_MODE.DISPLAYER)
      this.#renderRings(view, proj, cylinderRotMat, params);

    if (interfaceMode === INTERFACE_MODE.SELECTOR) {
      this.#renderMidIntersection(view, proj, cylinderRotMat, params);
      this.#renderArrow(view, proj, params); // this is problematic. pointer arrow rotations are handled within its geo instead of rotation
    }

    this.gl.depthMask(true); // defensive

    // requestAnimationFrame(render);
  }

  // #region interface handlers
  onWindowResize(params) {
    let { canvasRef } = params;
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    this.gl?.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  recalculate(params) {
    if (params.interfaceMode === INTERFACE_MODE.SELECTOR) {
      this.#drawColorWheel(params);
      this.#updateArrowGeometry(params);
      this.#updateMidIntersectionGeometry(params);
    }
    if (params.interfaceMode === INTERFACE_MODE.DISPLAYER) {
      this.#updateLevelRingGeometry(params);
      this.#updateSphereGeometry(params);
      this.#updateSpherePositions(params);
    }
    this.#updateCylinderGeometry(params);
  }
  // #endregion

  // #region private
  #initGL(canvasRef) {
    this.gl = canvasRef.current.getContext("webgl");
    if (!this.gl) return false;
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.clearColor(0.05, 0.07, 0.12, 1.0);
    return true;
  }
  #initBuffers() {
    this.cylinderSideBuffers.position = this.gl.createBuffer();
    this.cylinderSideBuffers.indices = this.gl.createBuffer();
    this.discBuffers.position = this.gl.createBuffer();
    this.discBuffers.indices = this.gl.createBuffer();

    this.#updateCylinderGeometry({
      interfaceMode: INTERFACE_MODE.SELECTOR,
      innerRadius: DEFAULT_RADIUS,
      radiusScale: DEFAULT_RADIUS_SCALE,
      altitude: DEFAULT_ALTITUDE,
      heightScale: DEFAULT_HEIGHT_SCALE,
    });
    this.#updateMidIntersectionGeometry({ radiusScale: DEFAULT_RADIUS_SCALE });
    this.#updateArrowGeometry({ radiusScale: DEFAULT_RADIUS_SCALE });
    this.#updateLevelRingGeometry({ radiusScale: DEFAULT_RADIUS_SCALE });
    this.#updateSphereGeometry({ sphereRadius: DEFAULT_SPHERE_RADIUS });
  }
  // #region geo
  #updateCylinderGeometry({
    interfaceMode,
    innerRadius,
    radiusScale,
    altitude,
    heightScale,
  }) {
    if (!this.gl || !this.cylinderProgram || !this.discProgram)
      throw new Error({ desc: "GL or shader not initiated" });
    const geo = generateCylinderGeometry(
      innerRadius,
      radiusScale,
      heightScale,
      CYLINDER_SEGMENTS,
      altitude * (heightScale / 2),
      interfaceMode === INTERFACE_MODE.SELECTOR,
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cylinderSideBuffers.position);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      geo.sidePositions,
      this.gl.STATIC_DRAW,
    );
    this.gl.bindBuffer(
      this.gl.ELEMENT_ARRAY_BUFFER,
      this.cylinderSideBuffers.indices,
    );
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      geo.sideIndices,
      this.gl.STATIC_DRAW,
    );
    this.cylinderSideVertexCount = geo.sideVertexCount;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.discBuffers.position);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      geo.discPositions,
      this.gl.STATIC_DRAW,
    );
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.discBuffers.indices);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      geo.discIndices,
      this.gl.STATIC_DRAW,
    );
    this.discVertexCount = geo.discVertexCount;
  }
  #updateMidIntersectionGeometry({ innerRadius, radiusScale }) {
    let positions = generateMidIntersectionGeometry(
      innerRadius,
      radiusScale,
      RING_SEGMENTS,
    );
    if (this.midIntersectionBuffer)
      this.gl.deleteBuffer(this.midIntersectionBuffer);
    this.midIntersectionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.midIntersectionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW,
    );
    this.midIntersectionVertexCount = positions.length / 3;
  }
  #updateLevelRingGeometry({ radiusScale }) {
    let positions = generateLevelRingGeometry(radiusScale, 1, RING_SEGMENTS);
    if (this.ringVertexBuffer) this.gl.deleteBuffer(this.ringVertexBuffer);
    this.ringVertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.ringVertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW,
    );
    this.ringVertexCount = positions.length / 3;
  }
  #updateArrowGeometry({ radiusScale }) {
    let { vertices, indices } = generateArrowGeometry(radiusScale);
    if (this.arrowVertexBuffer) this.gl.deleteBuffer(this.arrowVertexBuffer);
    if (this.arrowIndexBuffer) this.gl.deleteBuffer(this.arrowIndexBuffer);
    this.arrowVertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.arrowVertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW,
    );
    this.arrowIndexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.arrowIndexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW,
    );
    this.arrowIndexCount = indices.length;
  }
  #updateSphereGeometry({ sphereRadius }) {
    let { positions, indices } = generateSphereGeometry(sphereRadius);
    this.sphereVertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sphereVertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW,
    );
    this.sphereIndexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.sphereIndexBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW,
    );
    this.sphereIndexCount = indices.length;
  }
  // #endregion

  #updateSpherePositions({
    colorMode,
    heightScale,
    radiusScale,
    displayedColors,
  }) {
    this.spherePositions = displayedColors
      .filter(({ visible }) => visible)
      .map(({ r, g, b }) => ({
        r,
        g,
        b,
        ...GL.rgbToPosition(r, g, b, colorMode, heightScale, radiusScale),
      }));
  }

  // #region render
  #renderDiscs(
    viewMatrix,
    projMatrix,
    cylinderRotMatrix,
    { colorMode, altitude, radiusScale, heightScale },
  ) {
    if (!this.discBuffers) return;
    let halfHeight = heightScale / 2;
    this.gl.useProgram(this.discProgram);
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.discProgram, "uModelMatrix"),
      false,
      cylinderRotMatrix,
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.discProgram, "uViewMatrix"),
      false,
      viewMatrix,
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.discProgram, "uProjectionMatrix"),
      false,
      projMatrix,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.discProgram, "u_minRadius"),
      MIN_RADIUS,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.discProgram, "u_maxRadius"),
      MAX_RADIUS,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.discProgram, "u_midY"),
      altitude * halfHeight, // altitude must be normalized
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.discProgram, "u_halfHeight"),
      halfHeight,
    );
    this.gl.uniform1i(
      this.gl.getUniformLocation(this.discProgram, "u_colorMode"),
      colorMode,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.discProgram, "u_radiusScale"),
      radiusScale,
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.discBuffers.position);
    const posLoc = this.gl.getAttribLocation(this.discProgram, "aPosition");
    this.gl.enableVertexAttribArray(posLoc);
    this.gl.vertexAttribPointer(posLoc, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.discBuffers.indices);
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.discVertexCount,
      this.gl.UNSIGNED_SHORT,
      0,
    );
  }
  #renderSpheres(viewMatrix, projMatrix, cylinderRotMatrix) {
    if (this.spherePositions.length === 0) return;
    if (!this.sphereVertexBuffer) return;

    // #region draw sphere
    this.gl.useProgram(this.sphereProgram);
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.sphereProgram, "uViewMatrix"),
      false,
      viewMatrix,
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.sphereProgram, "uProjectionMatrix"),
      false,
      projMatrix,
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sphereVertexBuffer);
    const posLocColor = this.gl.getAttribLocation(
      this.sphereProgram,
      "aPosition",
    );
    this.gl.enableVertexAttribArray(posLocColor);
    this.gl.vertexAttribPointer(posLocColor, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.sphereIndexBuffer);

    for (let { r, g, b, x, y, z } of this.spherePositions) {
      const transMat = new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        x,
        y,
        z,
        1,
      ]);
      const finalMat = multiplyMatrices(cylinderRotMatrix, transMat);
      this.gl.uniformMatrix4fv(
        this.gl.getUniformLocation(this.sphereProgram, "uModelMatrix"),
        false,
        finalMat,
      );
      this.gl.uniform3f(
        this.gl.getUniformLocation(this.sphereProgram, "uColor"),
        r,
        g,
        b,
      );
      this.gl.drawElements(
        this.gl.TRIANGLES,
        this.sphereIndexCount,
        this.gl.UNSIGNED_SHORT,
        0,
      );
    }
    // #endregion

    // #region draw black border of the sphere, dark side only
    this.gl.useProgram(this.sphereProgram);
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.sphereProgram, "uViewMatrix"),
      false,
      viewMatrix,
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.sphereProgram, "uProjectionMatrix"),
      false,
      projMatrix,
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.sphereVertexBuffer);
    const posLocBorder = this.gl.getAttribLocation(
      this.sphereProgram,
      "aPosition",
    );
    this.gl.enableVertexAttribArray(posLocBorder);
    this.gl.vertexAttribPointer(posLocBorder, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.sphereIndexBuffer);

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.FRONT);
    const scaleFactor = DEFAULT_SPHERE_BORDER_SCALE;
    for (let { x, y, z } of this.spherePositions) {
      const transMat = new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        x,
        y,
        z,
        1,
      ]);
      const scaleMat = new Float32Array([
        scaleFactor,
        0,
        0,
        0,
        0,
        scaleFactor,
        0,
        0,
        0,
        0,
        scaleFactor,
        0,
        0,
        0,
        0,
        1,
      ]);
      const temp = multiplyMatrices(transMat, scaleMat);
      const finalMat = multiplyMatrices(cylinderRotMatrix, temp);
      this.gl.uniformMatrix4fv(
        this.gl.getUniformLocation(this.sphereProgram, "uModelMatrix"),
        false,
        finalMat,
      );
      this.gl.uniform3f(
        this.gl.getUniformLocation(this.sphereProgram, "uColor"),
        ...SPHERE_BORDER_RGB,
      );
      this.gl.drawElements(
        this.gl.TRIANGLES,
        this.sphereIndexCount,
        this.gl.UNSIGNED_SHORT,
        0,
      );
    }
    this.gl.cullFace(this.gl.BACK);
    // #endregion
  }
  #renderCylinderSide(
    viewMatrix,
    projMatrix,
    cylinderRotMatrix,
    { colorMode, altitude, radiusScale, heightScale, cylinderAlpha },
  ) {
    if (!this.cylinderSideBuffers) return;
    let halfHeight = heightScale / 2;
    this.gl.useProgram(this.cylinderProgram);
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.cylinderProgram, "uModelMatrix"),
      false,
      cylinderRotMatrix,
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.cylinderProgram, "uViewMatrix"),
      false,
      viewMatrix,
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.cylinderProgram, "uProjectionMatrix"),
      false,
      projMatrix,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.cylinderProgram, "u_minRadius"),
      MIN_RADIUS,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.cylinderProgram, "u_maxRadius"),
      MAX_RADIUS,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.cylinderProgram, "u_midY"),
      altitude * halfHeight,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.cylinderProgram, "u_halfHeight"),
      halfHeight,
    );
    this.gl.uniform1i(
      this.gl.getUniformLocation(this.cylinderProgram, "u_colorMode"),
      colorMode,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.cylinderProgram, "u_alpha"),
      cylinderAlpha,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.cylinderProgram, "u_radiusScale"),
      radiusScale,
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cylinderSideBuffers.position);
    const posLoc = this.gl.getAttribLocation(this.cylinderProgram, "aPosition");
    this.gl.enableVertexAttribArray(posLoc);
    this.gl.vertexAttribPointer(posLoc, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(
      this.gl.ELEMENT_ARRAY_BUFFER,
      this.cylinderSideBuffers.indices,
    );
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.cylinderSideVertexCount,
      this.gl.UNSIGNED_SHORT,
      0,
    );
  }
  #renderRings(viewMatrix, projMatrix, cylinderRotMatrix, { cylinderAlpha }) {
    if (this.spherePositions.length === 0) return;
    if (!this.ringVertexBuffer) return;
    this.gl.useProgram(this.ringProgram);
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.ringProgram, "uViewMatrix"),
      false,
      viewMatrix,
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.ringProgram, "uProjectionMatrix"),
      false,
      projMatrix,
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.ringProgram, "uAlpha"),
      cylinderAlpha,
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.ringVertexBuffer);
    const posLoc = this.gl.getAttribLocation(this.ringProgram, "aPosition");
    this.gl.enableVertexAttribArray(posLoc);
    this.gl.vertexAttribPointer(posLoc, 3, this.gl.FLOAT, false, 0, 0);

    for (let { y } of this.spherePositions) {
      const transMat = new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        y,
        0,
        1,
      ]);
      const finalMat = multiplyMatrices(cylinderRotMatrix, transMat);
      this.gl.uniformMatrix4fv(
        this.gl.getUniformLocation(this.ringProgram, "uModelMatrix"),
        false,
        finalMat,
      );
      this.gl.drawArrays(this.gl.LINE_LOOP, 0, this.ringVertexCount);
    }
  }
  #renderMidIntersection(
    viewMatrix,
    projMatrix,
    cylinderRotMatrix,
    { altitude, heightScale },
  ) {
    if (!this.midIntersectionBuffer) return;
    const transMat = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      altitude * (heightScale / 2),
      0,
      1,
    ]);
    const modelMat = multiplyMatrices(cylinderRotMatrix, transMat);

    this.gl.useProgram(this.midIntersectionProgram);
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.midIntersectionProgram, "uModelMatrix"),
      false,
      modelMat,
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.midIntersectionProgram, "uViewMatrix"),
      false,
      viewMatrix,
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(
        this.midIntersectionProgram,
        "uProjectionMatrix",
      ),
      false,
      projMatrix,
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.midIntersectionBuffer);
    const posLoc = this.gl.getAttribLocation(
      this.midIntersectionProgram,
      "aPosition",
    );
    this.gl.enableVertexAttribArray(posLoc);
    this.gl.vertexAttribPointer(posLoc, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.drawArrays(this.gl.LINE_LOOP, 0, this.midIntersectionVertexCount);
  }
  #renderArrow(viewMatrix, projMatrix, { elevation, altitude, heightScale }) {
    if (!this.arrowVertexBuffer) return;
    const transMat = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      altitude * (heightScale / 2),
      0,
      1,
    ]);
    const pitchMat = createPitchOnlyMatrix(elevation);
    const modelMat = multiplyMatrices(pitchMat, transMat);

    this.gl.useProgram(this.arrowProgram);
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.arrowProgram, "uModelMatrix"),
      false,
      modelMat,
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.arrowProgram, "uViewMatrix"),
      false,
      viewMatrix,
    );
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.arrowProgram, "uProjectionMatrix"),
      false,
      projMatrix,
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.arrowVertexBuffer);
    const posLoc = this.gl.getAttribLocation(this.arrowProgram, "aPosition");
    this.gl.enableVertexAttribArray(posLoc);
    this.gl.vertexAttribPointer(posLoc, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.arrowIndexBuffer);
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.arrowIndexCount,
      this.gl.UNSIGNED_SHORT,
      0,
    );
  }
  // #endregion

  // #region shader programs
  #createShader(type, src) {
    const s = this.gl.createShader(type);
    this.gl.shaderSource(s, src);
    this.gl.compileShader(s);
    if (!this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS))
      throw new Error({
        desc: "Shader creation failure",
        msg: this.gl.getShaderInfoLog(s),
      });
    return s;
  }
  #createProgram(vsSource, fsSource) {
    const vs = this.#createShader(this.gl.VERTEX_SHADER, vsSource);
    const fs = this.#createShader(this.gl.FRAGMENT_SHADER, fsSource);
    const prog = this.gl.createProgram();
    this.gl.attachShader(prog, vs);
    this.gl.attachShader(prog, fs);
    this.gl.linkProgram(prog);
    return prog;
  }

  #initCylinderShaders() {
    const vsSource = `
      attribute vec3 aPosition;
      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      varying vec3 vLocalPos;
      void main() {
        vLocalPos = aPosition;
        vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
        gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
      }
    `;
    const fsSource = `
      precision mediump float;
      varying vec3 vLocalPos;
      uniform float u_minRadius;
      uniform float u_maxRadius;
      uniform float u_radiusScale;
      uniform float u_midY;
      uniform float u_halfHeight;
      uniform int u_colorMode;
      uniform float u_alpha;
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      vec3 hsl2rgb(vec3 c) {
        vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0 );
        return c.z + c.y * (rgb-0.5) * (1.0-abs(2.0*c.z-1.0));
      }
      void main() {
        float x = vLocalPos.x, y = vLocalPos.y, z = vLocalPos.z;
        float r = length(vec2(x,z))/u_radiusScale;
        float angle = atan(z,x);
        float hue = angle/(2.0*3.1415926);
        if(hue<0.0) hue+=1.0;
        float normY = y / u_halfHeight;
        float lightness = (1.0 - normY) / 2.0;
        lightness = clamp(lightness,0.0,1.0);
        float saturation = r / u_maxRadius;
        saturation = clamp(saturation,0.0,1.0);
        vec3 color;
        if(u_colorMode==0) color = hsv2rgb(vec3(hue, saturation, lightness));
        else color = hsl2rgb(vec3(hue, saturation, lightness));
        gl_FragColor = vec4(color, u_alpha);
      }
    `;
    return this.#createProgram(vsSource, fsSource);
  }
  #initDiscShaders() {
    const vsSource = `
      attribute vec3 aPosition;
      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      varying vec3 vLocalPos;
      void main() {
        vLocalPos = aPosition;
        vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
        gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
      }
    `;
    const fsSource = `
      precision mediump float;
      varying vec3 vLocalPos;
      uniform float u_minRadius;
      uniform float u_maxRadius;
      uniform float u_radiusScale;
      uniform float u_midY;
      uniform float u_halfHeight;
      uniform int u_colorMode;
      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }
      vec3 hsl2rgb(vec3 c) {
        vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0 );
        return c.z + c.y * (rgb-0.5) * (1.0-abs(2.0*c.z-1.0));
      }
      void main() {
        float x = vLocalPos.x, y = vLocalPos.y, z = vLocalPos.z;
        float r = length(vec2(x,z))/u_radiusScale;
        float angle = atan(z,x);
        float hue = angle/(2.0*3.1415926);
        if(hue<0.0) hue+=1.0;
        bool isTop = (y > u_halfHeight - 0.01);
        float lightness;
        if(isTop) {
          float midNorm = u_midY / u_halfHeight;
          lightness = (1.0 - midNorm) / 2.0;
        } else {
          float normY = y / u_halfHeight;
          lightness = (1.0 - normY) / 2.0;
        }
        lightness = clamp(lightness,0.0,1.0);
        float saturation = r / u_maxRadius;
        saturation = clamp(saturation,0.0,1.0);
        vec3 color;
        if(u_colorMode==0) color = hsv2rgb(vec3(hue, saturation, lightness));
        else color = hsl2rgb(vec3(hue, saturation, lightness));
        gl_FragColor = vec4(color, 1.0);
      }
    `;
    return this.#createProgram(vsSource, fsSource);
  }
  // position indicator of colors in displayer mode, and its border
  #initSphereShaders() {
    const vsSource = `
      attribute vec3 aPosition;
      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
      }
    `;
    const fsSource = `
      precision mediump float;
      uniform vec3 uColor;
      void main() {
        gl_FragColor = vec4(uColor, 1.0);
      }
    `;
    return this.#createProgram(vsSource, fsSource);
  }
  // Y layer indicator for color position indicators
  #initRingShaders() {
    const vsSource = `
      attribute vec3 aPosition;
      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
      }
    `;
    const fsSource = `
      precision mediump float;
      uniform float uAlpha;
      void main() {
        gl_FragColor = vec4(0.7, 0.9, 1.0, uAlpha);
      }
    `;
    return this.#createProgram(vsSource, fsSource);
  }
  #initMidIntersectionShaders() {
    const vsSource = `
      attribute vec3 aPosition;
      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
      }
    `;
    const fsSource = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    `;
    return this.#createProgram(vsSource, fsSource);
  }
  // Hue arrow in selector mode. An actual cuboid to render a line
  #initArrowShaders() {
    const vsSource = `
      attribute vec3 aPosition;
      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
      }
    `;
    const fsSource = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
    `;
    return this.#createProgram(vsSource, fsSource);
  }
  // #endregion

  // for 2D canvas
  #drawColorWheel({ paletteRef, colorMode, azimuth, innerRadius, altitude }) {
    if (!paletteRef.current)
      throw new Error({ desc: "2D canvas for palette is not defined" });
    const paletteCtx = paletteRef.current.getContext("2d", {
      willReadFrequently: true,
    });
    const size = paletteRef.current.width ?? 0;
    const center = size / 2;
    const radius = center;
    const rotationRad = (azimuth * Math.PI) / 180;
    const brightness = (1 - altitude) / 2;

    const imageData = paletteCtx.getImageData(0, 0, size, size);
    const data = imageData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center;
        const dy = y - center;
        const r = Math.hypot(dx, dy);
        if (r > radius) {
          const idx = (y * size + x) * 4;
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
          data[idx + 3] = 0;
          continue;
        }
        const normR = r / radius;
        let rawAngle = Math.atan2(dy, dx);
        let angle = rawAngle - rotationRad;
        angle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        let hue = angle / (2 * Math.PI);
        const saturation = normR;
        const [rr, gg, bb] = getRGBFromWheel(
          colorMode,
          hue,
          saturation,
          brightness,
        );
        const idx = (y * size + x) * 4;
        data[idx] = rr * 255;
        data[idx + 1] = gg * 255;
        data[idx + 2] = bb * 255;
        data[idx + 3] = 255;
      }
    }
    paletteCtx.putImageData(imageData, 0, 0);

    // white ring
    const ringRadius = innerRadius * radius;
    if (ringRadius > 0) {
      paletteCtx.beginPath();
      paletteCtx.arc(center, center, ringRadius, 0, 2 * Math.PI);
      paletteCtx.strokeStyle = PALETTE_ARROW_COLOR;
      paletteCtx.lineWidth = PALETTE_ARROW_WIDTH;
      paletteCtx.stroke();
    }

    // white line (indicator arrow)
    paletteCtx.beginPath();
    paletteCtx.moveTo(center, center);
    paletteCtx.lineTo(center, center + radius);
    paletteCtx.strokeStyle = PALETTE_ARROW_COLOR;
    paletteCtx.lineWidth = PALETTE_ARROW_WIDTH;
    paletteCtx.stroke();

    // get marker color
    // init azmimuth on marker is -PI/2. deduction is needed to get actual hue
    let rawAngleIntersect = -Math.PI / 2;
    let angleIntersect = rawAngleIntersect - rotationRad;
    angleIntersect =
      ((angleIntersect % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    let hueIntersect = (angleIntersect / (2 * Math.PI) + 0.5) % 1.0;
    const [rCol, gCol, bCol] = getRGBFromWheel(
      colorMode,
      hueIntersect,
      innerRadius,
      brightness,
    );

    const rVal = rCol * 255,
      gVal = gCol * 255,
      bVal = bCol * 255;

    // marker (cross point)
    paletteCtx.beginPath();
    paletteCtx.arc(
      center,
      center + ringRadius,
      PALETTE_MARKER_RADIUS,
      0,
      2 * Math.PI,
    );
    paletteCtx.fillStyle = `rgb(${rVal}, ${gVal}, ${bVal})`;
    paletteCtx.fill();
    paletteCtx.strokeStyle = PALETTE_ARROW_COLOR;
    paletteCtx.lineWidth = PALETTE_ARROW_WIDTH;
    paletteCtx.stroke();

    // UI decoration
    paletteCtx.beginPath();
    paletteCtx.arc(center, center, radius, 0, 2 * Math.PI);
    paletteCtx.strokeStyle = COLOR_THEME_PRIMARY;
    paletteCtx.lineWidth = PALETTE_BORDER_WIDTH;
    paletteCtx.stroke();

    return { rVal, gVal, bVal };
  }
  // #endregion
}
