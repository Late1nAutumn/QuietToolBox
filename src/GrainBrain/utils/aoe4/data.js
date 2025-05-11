// date: 2025.4.21
import { BUILDING } from "./enum";

export const AOE_VERSION = "13.0.4343.0";

export const RULE = {
  GRANARY_LIMIT: 3,
  FARM_CHUNK: 4,
  FARM_CHUNK_FOOD: 7.5,
  FARM_REGROW_PERIOD: 30, // sec
  MIN_BUILDING_SIZE: 2, // tile
};

export const BASE = {
  // https://www.reddit.com/r/aoe4/comments/1ab55s0/food_gather_rates/
  FARM_GATHER_RATE: 0.75, // food per second per farmer
  // https://aoe4world.com/explorer/civs/chinese/units/villager
  MOVE_SPEED: 1.125, // tiles per second
  CAPACITY: 10, // food
  GRANARY_RATE_PERCENT: 10, // %
};

export const UPGRADE = {
  WHEEL_BARROW_CAPACITY: 5,
  WHEEL_BARROW_SPEED_PERCENT: 15, // %
  YUAN_DYNASTY_SPEED_PERCENT: 15, // %

  // Warning: 0.1+0.1+0.1===0.3 => false
  // better use integers to avoid calculation problems, thanksForInventingJavascript.jpg
  MILL_LV1_RATE_PERCENT: 10, // %
  MILL_LV2_RATE_PERCENT: 10, // %
  MILL_LV3_RATE_PERCENT: 10, // %
  ANCIENT_TECH_PERCENT_PER_DYNASTY_RATE: 4, // %
};

export const BUILDING_SIZE = {
  // diameter
  [BUILDING.FARM]: 2,
  [BUILDING.MILL]: 2,
  [BUILDING.GRANARY]: 4,
};

export const ASSUMPTION = {
  // following data comes from personal measurement
  PADDING: {
    [BUILDING.FARM]: 0.25, // 10%, must > 0.20
    [BUILDING.MILL]: 0.4, // 10%
    [BUILDING.GRANARY]: 0.4,
  },
  GRANARY_AREA_RADIUS: 7.63, // must < 7.64
  GATHER_WINDUP_DURATION: 0.25, // sec, the duration after movement & before gathering
  RESOURCE_DROPOFF_DURATION: 0.5, // sec
};

export const CALCULATED = {
  FARM_CHUNK_WIDTH:
    (BUILDING_SIZE[BUILDING.FARM] - 2 * ASSUMPTION.PADDING[BUILDING.FARM]) /
    RULE.FARM_CHUNK,

  FARM_PADDING_PERCENT:
    (ASSUMPTION.PADDING[BUILDING.FARM] / BUILDING_SIZE[BUILDING.FARM]) * 100,
  FARM_WIDTH_PERCENT:
    100 -
    ((2 * ASSUMPTION.PADDING[BUILDING.FARM]) / BUILDING_SIZE[BUILDING.FARM]) *
      100,
  GRANARY_PADDING_PERCENT:
    (ASSUMPTION.PADDING[BUILDING.GRANARY] / BUILDING_SIZE[BUILDING.GRANARY]) *
    100,
  GRANARY_WIDTH_PERCENT:
    100 -
    ((2 * ASSUMPTION.PADDING[BUILDING.GRANARY]) /
      BUILDING_SIZE[BUILDING.GRANARY]) *
      100,
  MILL_PADDING_PERCENT:
    (ASSUMPTION.PADDING[BUILDING.MILL] / BUILDING_SIZE[BUILDING.MILL]) * 100,
  MILL_WIDTH_PERCENT:
    100 -
    ((2 * ASSUMPTION.PADDING[BUILDING.MILL]) / BUILDING_SIZE[BUILDING.MILL]) *
      100,
  GRANARY_AREA_RADIUS_PERCENT:
    ((ASSUMPTION.GRANARY_AREA_RADIUS * 2) / BUILDING_SIZE[BUILDING.GRANARY]) *
    100,
};
