import { LANG } from "../../utils/enums";
import { TRANSLATE_COLLECTION } from "../translation/context";
import { translator } from "../translation/translator";
import { LEVELING_STAT_MULTIPLIER, MULTIPLIER, TAG_VALUE } from "./constants";
import {
  DATA_FIELD,
  STYLE,
  SLOT,
  TABLE_MODE,
  STAT_MODE,
  STYLES,
  REGION,
} from "./enums";

// #region app
export function tableFieldsOfMode(tableMode, statMode, lang) {
  let fields = [DATA_FIELD.NAME];
  switch (lang) {
    case LANG.CN:
      fields.push(DATA_FIELD.NAME_CN);
      break;
    case LANG.EN:
      break;
    default:
      console.log("[WARNING]: table headers unhandled for current language");
      break;
  }
  switch (tableMode) {
    case TABLE_MODE.SPARE:
      fields.push(DATA_FIELD.SLOT, DATA_FIELD.RARITY);
      break;
    case TABLE_MODE.SET:
      fields.push(
        DATA_FIELD.RARITY,
        DATA_FIELD.COUNT,
        DATA_FIELD.COUNT_ACCESSORY
      );
      break;
    case TABLE_MODE.RAW:
      fields.push(DATA_FIELD.SLOT, DATA_FIELD.RARITY, DATA_FIELD.SET);
      break;
    default:
      console.log("[WARNING]: table headers unhandled for current table mode");
      break;
  }
  fields.push(DATA_FIELD.MAIN_STAT, DATA_FIELD.SEC_STAT);
  switch (statMode) {
    case STAT_MODE.MAIN:
      fields.push(DATA_FIELD.STAT_MAIN);
      break;
    case STAT_MODE.SIMULATION:
      fields.push(DATA_FIELD.SIM_SCORE);
      break;
    case STAT_MODE.DETAILED:
      fields.push(
        DATA_FIELD.STAT_EL,
        DATA_FIELD.STAT_FR,
        DATA_FIELD.STAT_SW,
        DATA_FIELD.STAT_SX,
        DATA_FIELD.STAT_CL
      );
      break;
    default:
      console.log("[WARNING]: table headers unhandled for current stat mode");
      break;
  }
  fields.push(DATA_FIELD.TAGS, DATA_FIELD.COMPENDIUM, DATA_FIELD.OBTAIN_FROM);
  return fields;
}

export function activeFieldsFilter(fields, columns) {
  let activeFields = [];
  fields.forEach((field) => {
    if (columns[field]) activeFields.push(field);
  });
  return activeFields;
}

export function sortData(data, sort) {
  let temp = data.slice();
  sort
    .slice()
    .reverse()
    .forEach(({ index, order }) => {
      temp.sort((a, b) =>
        a.data[index] === b.data[index]
          ? 0
          : (a.data[index] > b.data[index]) ^ ((order + 1) / 2)
          ? 1
          : -1
      );
    });
  return temp;
}
// #endregion

// #region calculations
export function leveledStat(value, lvl) {
  return Math.ceil(value * LEVELING_STAT_MULTIPLIER[lvl]);
}

export function mainStatType(stat = []) {
  // Assuming all items only have 1 main stat
  let main = 0;
  let secondary = 0;
  stat.forEach((v) => {
    if (v > main) {
      secondary = main;
      main = v;
    } else if (v > secondary) secondary = v;
  });
  let secondaryIndexes = [];
  stat.forEach((v, i) => {
    if (v === secondary) secondaryIndexes.push(i);
  });
  let output = [stat.indexOf(main)];
  if (secondaryIndexes.length > 1) output[1] = STYLE.MULTY;
  else output[1] = secondaryIndexes[0];
  return output;
}

export function isAccessory(type) {
  return type > 7;
}

export function scoreSimulation(items, filter) {
  let { simulator } = filter;
  let lvMultiplier = LEVELING_STAT_MULTIPLIER[filter.config.itemLv];
  let final = items.reduce((final, item) => {
    let weightedStats = STYLES.reduce((weightedStat, style) => {
      let statMultiplier = 0;
      switch (style) {
        case simulator.mainStat:
          statMultiplier = MULTIPLIER.MAIN_STYLE_SCORE;
          break;
        case simulator.secStat:
          statMultiplier = MULTIPLIER.SECOND_STYLE_SCORE;
          break;
        default:
          statMultiplier = MULTIPLIER.BASE_SCORE;
          break;
      }
      return (
        weightedStat +
        statMultiplier *
          (item[DATA_FIELD.STAT][style] * lvMultiplier +
            filter.simulator.bonus[REGION.FLORAWISH].style)
      );
    }, 0);
    let tagCount = 0;
    for (let tag in item[DATA_FIELD.TAGS])
      if (filter.simulator.tags.indexOf(tag) !== -1)
        tagCount += item[DATA_FIELD.TAGS][tag];
    let tagScore =
      tagCount * TAG_VALUE * filter.simulator.tagMultiplier * lvMultiplier;
    return (
      final +
      Math.ceil(
        (weightedStats *
          (1 + filter.simulator.bonus[REGION.FLORAWISH].slotStat) +
          tagScore) *
          (1 + filter.simulator.bonus[REGION.FLORAWISH].slotScore)
      )
    );
  }, 0);
  return final;
}
// #endregion

// #region texts
export function compendiumEnumToText(e, lang) {
  let page = Math.floor(e / 100),
    subPage = e % 100;
  return page
    ? `${page}. ${translator(
        page * 100 + subPage,
        lang,
        TRANSLATE_COLLECTION.ITEM_COMPENDIUM_SUBS
      )}`
    : "-";
}

export function slotTextToType(text) {
  switch (text) {
    case "Hair":
      return SLOT.HAIR;
    case "Dress":
      return SLOT.DRESS;
    case "Outerwear":
      return SLOT.OUTERWEAR;
    case "Top":
      return SLOT.TOP;
    case "Bottom":
      return SLOT.BOTTOM;
    case "Socks":
      return SLOT.SOCKS;
    case "Shoes":
      return SLOT.SHOES;
    case "Hair Accessory":
      return SLOT.HAIR_ACCESSORY;
    case "Headwear":
      return SLOT.HEADWEAR;
    case "Earrings":
      return SLOT.EARRINGS;
    case "Neckwear":
      return SLOT.NECKWEAR;
    case "Bracelet":
      return SLOT.BRACELET;
    case "Choker":
      return SLOT.CHOKER;
    case "Gloves":
      return SLOT.GLOVES;
    case "Face Decoration":
      return SLOT.FACE_DECORATION;
    case "Chest Accessory":
      return SLOT.CHEST_ACCESSORY;
    case "Pendant":
      return SLOT.PENDANT;
    case "Backpiece":
      return SLOT.BACKPIECE;
    case "Ring":
      return SLOT.RING;
    case "Arm Decoration":
      return SLOT.ARM_DECORATION;
    case "Handheld":
      return SLOT.HANDHELD;
    default:
      console.log(`[ERROR]: unknown slot type ${text}`);
      return;
  }
}
// #endregion
