// #region data
export const DATA_FIELD = {
  // main
  NAME: "name",
  STAT: "stat", // used by raw data mapping
  SLOT: "slot",
  RARITY: "rarity",
  SET: "set",
  TAGS: "tags",
  OBTAIN_FROM: "obtainFrom",
  // sub
  STAT_EL: "statElegant",
  STAT_FR: "statFresh",
  STAT_SW: "statSweet",
  STAT_SX: "statSexy",
  STAT_CL: "statCool",

  NAME_CN: "chineseName",
  // generated
  COMPENDIUM: "compendium",
  MAIN_STAT: "mainStat",
  SEC_STAT: "secondaryStat",
  STAT_MAIN: "statMain",
  SIM_SCORE: "simulatedScore",
  COUNT: "count",
  COUNT_ACCESSORY: "accessoryCount",
  ITEMS: "items", // for set score simulation
};

export const STYLE = {
  MULTY: -1,
  NONE: 0,
  ELEGANT: 1,
  FRESH: 2,
  SWEET: 3,
  SEXY: 4,
  COOL: 5,
};

export const STYLES = [
  STYLE.ELEGANT,
  STYLE.FRESH,
  STYLE.SWEET,
  STYLE.SEXY,
  STYLE.COOL,
];

export const SLOT = {
  HAIR: 1,
  DRESS: 2,
  OUTERWEAR: 3,
  TOP: 4,
  BOTTOM: 5,
  SOCKS: 6,
  SHOES: 7,
  HAIR_ACCESSORY: 8,
  HEADWEAR: 9,
  EARRINGS: 10,
  NECKWEAR: 11,
  BRACELET: 12,
  CHOKER: 13,
  GLOVES: 14,
  FACE_DECORATION: 15,
  CHEST_ACCESSORY: 16,
  PENDANT: 17,
  BACKPIECE: 18,
  RING: 19,
  ARM_DECORATION: 20,
  HANDHELD: 21,
};

export const COMPENDIUM = [1, 2, 3, 4, 5, 6, 7, 8];
export const COMPENDIUM_SUB = {
  1: [1, 2, 3],
  2: [1, 2, 3, 4],
  3: [1, 2, 3],
  4: [1, 2, 3, 4, 5],
  5: [1, 2, 3, 4],
  6: [1, 2, 3, 4],
  7: [1, 2, 3, 4, 5],
  8: [1, 2],
};

export const REGION = {
  FLORAWISH: 1,
};

export const SET = {
  NONE: "-",
};

export const TAG = {
  NONE: "-",
};

// #endregion

// #region app
export const TABLE_MODE = {
  RAW: 0,
  SPARE: 1,
  SET: 2,
};

export const STAT_MODE = {
  DETAILED: 0,
  MAIN: 1,
  SIMULATION: 2,
};

export const FILTER_TAB = {
  FILTER: 0,
  COLUMNS: 1,
  SORT: 2,
};

export const FILTABLE_FIELDS_INPUT_TYPE = [
  // select input
  DATA_FIELD.SLOT,
  DATA_FIELD.RARITY,
  DATA_FIELD.SET,
  DATA_FIELD.MAIN_STAT,
  DATA_FIELD.SEC_STAT,
  DATA_FIELD.TAGS,
  DATA_FIELD.COMPENDIUM,
  DATA_FIELD.OBTAIN_FROM,
  // range input
  DATA_FIELD.STAT_EL,
  DATA_FIELD.STAT_FR,
  DATA_FIELD.STAT_SW,
  DATA_FIELD.STAT_SX,
  DATA_FIELD.STAT_CL,
  DATA_FIELD.STAT_MAIN,
  DATA_FIELD.SIM_SCORE,
  DATA_FIELD.COUNT,
  DATA_FIELD.COUNT_ACCESSORY,
];

export const FILTER_INPUT_VALUE_TYPE = {
  VAL: 1,
  UP: 2,
  LOW: 3,
};
// #endregion
