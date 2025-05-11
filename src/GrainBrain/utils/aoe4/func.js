import { BASE, UPGRADE } from "./data";
import { DYNASTY } from "./enum";

export const villagerSpeed = (wheelbarrow, dynasty) =>
  BASE.MOVE_SPEED *
  (wheelbarrow ? (100 + UPGRADE.WHEEL_BARROW_SPEED_PERCENT) / 100 : 1) *
  (dynasty === DYNASTY.YUAN
    ? (100 + UPGRADE.YUAN_DYNASTY_SPEED_PERCENT) / 100
    : 1);

export const villagerCapacity = (wheelbarrow) =>
  BASE.CAPACITY + +wheelbarrow * UPGRADE.WHEEL_BARROW_CAPACITY;

export const gatherRate = (gatherTechCount, acientTechCount, granaryCount) => {
  return (
    (BASE.FARM_GATHER_RATE *
      (100 +
        +(gatherTechCount > 0) * UPGRADE.MILL_LV1_RATE_PERCENT +
        +(gatherTechCount > 1) * UPGRADE.MILL_LV2_RATE_PERCENT +
        +(gatherTechCount > 2) * UPGRADE.MILL_LV3_RATE_PERCENT +
        acientTechCount * UPGRADE.ANCIENT_TECH_PERCENT_PER_DYNASTY_RATE) *
      (100 + granaryCount * BASE.GRANARY_RATE_PERCENT)) /
    10000
  );
};
