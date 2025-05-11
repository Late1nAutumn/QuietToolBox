import { BUILDING_SIZE } from "./aoe4/data";
import { BUILDING } from "./aoe4/enum";

export const ZOOM_PERCENT = 15;
export const ZOOM_LIMIT = 10;
export const AUTO_ZOOM_LIMIT = 40;

export const NOTIFICATION_DURATION = 4000;

export const UNZOOMABLE_AREAS = ["grainbrain-toolbar", "modal-container"];
export const UNEMPTY_AREAS = ["grainbrain-toolbar", "grainbrain-footer"];

export const AUTO_CAMERA_PADDING = 0.05; // 5%
export const TOOLBAR_WIDTH = 320; // for auto camera, not effecting css

export const GRID_ROSTER = {
  [BUILDING.GRANARY]: {
    types: [],
    atrributes: {},
    size: {
      x: BUILDING_SIZE[BUILDING.GRANARY],
      y: BUILDING_SIZE[BUILDING.GRANARY],
    },
  },
  [BUILDING.FARM]: {
    types: [],
    atrributes: {},
    size: { x: BUILDING_SIZE[BUILDING.FARM], y: BUILDING_SIZE[BUILDING.FARM] },
  },
  [BUILDING.MILL]: {
    types: [],
    atrributes: {},
    size: { x: BUILDING_SIZE[BUILDING.MILL], y: BUILDING_SIZE[BUILDING.MILL] },
  },
  [BUILDING.OTHER]: {
    types: [],
    atrributes: {},
  },
};

export const DEFAULT_PATTERN = {
  ["a"]: {
    uuid: "a",
    kind: BUILDING.GRANARY,
    coord: { x: 16, y: 7 },
  },
  ["b"]: {
    uuid: "b",
    kind: BUILDING.FARM,
    coord: { x: 10, y: 7 },
  },
  ["c"]: {
    uuid: "c",
    kind: BUILDING.FARM,
    coord: { x: 10, y: 5 },
  },
  ["d"]: {
    uuid: "d",
    kind: BUILDING.FARM,
    coord: { x: 10, y: 3 },
  },
  ["e"]: {
    uuid: "e",
    kind: BUILDING.FARM,
    coord: { x: 12, y: 3 },
  },
  ["f"]: {
    uuid: "f",
    kind: BUILDING.FARM,
    coord: { x: 9, y: 9 },
  },
  ["g"]: {
    uuid: "g",
    kind: BUILDING.FARM,
    coord: { x: 11, y: 9 },
  },
  ["h"]: {
    uuid: "h",
    kind: BUILDING.FARM,
    coord: { x: 9, y: 11 },
  },
  ["i"]: {
    uuid: "i",
    kind: BUILDING.FARM,
    coord: { x: 11, y: 11 },
  },
  ["j"]: {
    uuid: "j",
    kind: BUILDING.FARM,
    coord: { x: 11, y: 13 },
  },
  ["k"]: {
    uuid: "k",
    kind: BUILDING.FARM,
    coord: { x: 13, y: 13 },
  },
  ["l"]: {
    uuid: "l",
    kind: BUILDING.FARM,
    coord: { x: 11, y: 15 },
  },
  ["m"]: {
    uuid: "m",
    kind: BUILDING.FARM,
    coord: { x: 13, y: 15 },
  },
  ["n"]: {
    uuid: "n",
    kind: BUILDING.FARM,
    coord: { x: 15, y: 15 },
  },
  ["o"]: {
    uuid: "o",
    kind: BUILDING.FARM,
    coord: { x: 17, y: 15 },
  },
  ["p"]: {
    uuid: "p",
    kind: BUILDING.FARM,
    coord: { x: 23, y: 14 },
  },
  ["q"]: {
    uuid: "q",
    kind: BUILDING.FARM,
    coord: { x: 23, y: 12 },
  },
  ["r"]: {
    uuid: "r",
    kind: BUILDING.FARM,
    coord: { x: 25, y: 12 },
  },
  ["s"]: {
    uuid: "s",
    kind: BUILDING.FARM,
    coord: { x: 23, y: 10 },
  },
  ["t"]: {
    uuid: "t",
    kind: BUILDING.FARM,
    coord: { x: 25, y: 10 },
  },
  ["u"]: {
    uuid: "u",
    kind: BUILDING.FARM,
    coord: { x: 25, y: 8 },
  },
};
