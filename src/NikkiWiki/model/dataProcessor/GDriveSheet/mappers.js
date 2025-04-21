// version 20250204
import rawData from "../../rawData/GDriveSheet/ClothesOG";
import { mapSetToCompendium } from "../../manualData/manualData";

import { DATA_FIELD, SET, STYLE, STYLES, TABLE_MODE, TAG } from "../../enums";
import {
  itemNameMapper,
  tagNameMapper,
  translator,
} from "../../../translation/translator";
import { TRANSLATE_COLLECTION } from "../../../translation/context";

import {
  slotTextToType,
  isAccessory,
  mainStatType,
  leveledStat,
  scoreSimulation,
} from "../../utils";

export function clothesOGData() {
  let allTags = { [TAG.NONE]: true };
  let allObtainFrom = {};
  let allSets = { [SET.NONE]: true };
  let collection = rawData
    .split("\n")
    .slice(2)
    .map((row) => row.split("\t"))
    .map(
      ([
        name,
        elegant,
        fresh,
        sweet,
        sexy,
        cool,
        slot,
        rarity,
        set,
        tags,
        obtainFrom,
      ]) => {
        let tagSet = {};
        let tagArr = tags ? tags.split(",").map((tag) => tag.trim()) : [];
        tagArr.forEach((tag) => {
          allTags[tag] = true;
          tagSet[tag] = 1;
        });
        let tempObtainFrom = obtainFrom.trim();
        if (tempObtainFrom) allObtainFrom[tempObtainFrom] = true;
        let tempSet = set.slice(0, set.indexOf(" (")).trim();
        if (tempSet) allSets[tempSet] = true;
        let stat = [];
        stat[STYLE.ELEGANT] = Number(elegant);
        stat[STYLE.FRESH] = Number(fresh);
        stat[STYLE.SWEET] = Number(sweet);
        stat[STYLE.SEXY] = Number(sexy);
        stat[STYLE.COOL] = Number(cool);
        return {
          [DATA_FIELD.NAME]: name,
          [DATA_FIELD.STAT]: stat,
          [DATA_FIELD.SLOT]: slotTextToType(slot),
          [DATA_FIELD.RARITY]: Number(rarity),
          [DATA_FIELD.SET]: tempSet || SET.NONE,
          [DATA_FIELD.TAGS]: tagSet,
          [DATA_FIELD.OBTAIN_FROM]: tempObtainFrom,
          [DATA_FIELD.COMPENDIUM]: 0, // TODO
        };
      }
    );

  return {
    collection,
    ranges: {
      [DATA_FIELD.SET]: Object.keys(allSets).sort(),
      [DATA_FIELD.TAGS]: Object.keys(allTags).sort(),
      [DATA_FIELD.OBTAIN_FROM]: Object.keys(allObtainFrom).sort(),
    },
  };
}

export function mapSetData(rawData) {
  let sets = {};
  rawData.forEach(({ name, stat, slot, rarity, set, tags, obtainFrom }, i) => {
    if (set === SET.NONE) return;
    if (!sets[set])
      sets[set] = {
        [DATA_FIELD.RARITY]: rarity,
        [DATA_FIELD.COUNT_ACCESSORY]: 0,
        [DATA_FIELD.STAT]: [],
        [DATA_FIELD.TAGS]: {},
        [DATA_FIELD.OBTAIN_FROM]: obtainFrom,
        [DATA_FIELD.ITEMS]: [],
      };
    sets[set][DATA_FIELD.COUNT_ACCESSORY] += isAccessory(slot) ? 1 : 0;
    for (let tag in tags)
      sets[set][DATA_FIELD.TAGS][tag] =
        (sets[set][DATA_FIELD.TAGS][tag] || 0) + 1;
    sets[set][DATA_FIELD.ITEMS].push(i);
    // assuming player have full bonus specs
    STYLES.forEach((type) => {
      sets[set][DATA_FIELD.STAT][type] =
        (sets[set][DATA_FIELD.STAT][type] || 0) + stat[type];
    });
    // TODO: compo

    if (sets[set][DATA_FIELD.RARITY] !== rarity)
      console.log(
        `[WARNING]: set item rarity data inconsistant for: ${set},${name}`
      );
    if (sets[set][DATA_FIELD.OBTAIN_FROM] !== obtainFrom)
      console.log(
        `[WARNING]: set item source data inconsistant for: ${set},${name}`
      );
    if (
      Object.keys(sets[set][DATA_FIELD.TAGS]).sort().join() !==
      Object.keys(tags).sort().join()
    )
      console.log(
        `[WARNING]: set item tag data inconsistant for: ${set},${name}`
      );
  });
  // let renamedSets = Object.keys(sets).reduce((acc, set) => {
  //   acc[set.slice(0, set.indexOf(" ("))] = sets[set];
  //   return acc;
  // }, {});
  Object.keys(sets).forEach((set) => {
    let [page, subPage] = mapSetToCompendium(set);
    sets[set][DATA_FIELD.COMPENDIUM] = page * 100 + subPage;
  });
  console.log(
    `[log]: outfit data parsed, ${Object.keys(sets).length} sets detected`
  );
  return sets;
}

export function mapFieldsToRowValues(
  rowData,
  fields,
  lang,
  filter,
  itemCollection,
  tableMode
) {
  let [main, secondary] = mainStatType(rowData[DATA_FIELD.STAT]);

  return fields.map((field) => {
    switch (field) {
      case DATA_FIELD.NAME:
      case DATA_FIELD.RARITY:
      case DATA_FIELD.OBTAIN_FROM:
      case DATA_FIELD.COUNT_ACCESSORY:
        return rowData[field];

      case DATA_FIELD.SLOT:
        return translator(
          rowData[field],
          lang,
          TRANSLATE_COLLECTION.ITEM_SLOTS
        );
      case DATA_FIELD.COUNT:
        return rowData[DATA_FIELD.ITEMS].length;
      case DATA_FIELD.TAGS:
        let strs = [];
        for (let tag in rowData[field])
          strs.push(`${tagNameMapper(tag, lang)} × ${rowData[field][tag]}`);
        return strs.join(", ") || "-";

      case DATA_FIELD.STAT_EL:
        return leveledStat(
          rowData[DATA_FIELD.STAT][STYLE.ELEGANT],
          filter.config.itemLv
        );
      case DATA_FIELD.STAT_FR:
        return leveledStat(
          rowData[DATA_FIELD.STAT][STYLE.FRESH],
          filter.config.itemLv
        );
      case DATA_FIELD.STAT_SW:
        return leveledStat(
          rowData[DATA_FIELD.STAT][STYLE.SWEET],
          filter.config.itemLv
        );
      case DATA_FIELD.STAT_SX:
        return leveledStat(
          rowData[DATA_FIELD.STAT][STYLE.SEXY],
          filter.config.itemLv
        );
      case DATA_FIELD.STAT_CL:
        return leveledStat(
          rowData[DATA_FIELD.STAT][STYLE.COOL],
          filter.config.itemLv
        );

      case DATA_FIELD.COMPENDIUM:
        let page = Math.floor(rowData[field] / 100),
          subPage = rowData[field] % 100;
        return page
          ? `${page}. ${translator(
              page * 100 + subPage,
              lang,
              TRANSLATE_COLLECTION.ITEM_COMPENDIUM_SUBS
            )}`
          : "-";
      case DATA_FIELD.MAIN_STAT:
        return translator(main, lang, TRANSLATE_COLLECTION.ITEM_STYLES);
      case DATA_FIELD.SEC_STAT:
        return translator(secondary, lang, TRANSLATE_COLLECTION.ITEM_STYLES);
      case DATA_FIELD.STAT_MAIN:
        return leveledStat(
          rowData[DATA_FIELD.STAT][main],
          filter.config.itemLv
        );
      case DATA_FIELD.SIM_SCORE:
        return scoreSimulation(
          tableMode === TABLE_MODE.SET
            ? rowData[DATA_FIELD.ITEMS].map((id) => itemCollection[id])
            : [rowData],
          filter
        );

      case DATA_FIELD.SET:
        return itemNameMapper(TABLE_MODE.SET, lang)(rowData[DATA_FIELD.SET]);
      case DATA_FIELD.NAME_CN:
        return itemNameMapper(tableMode, lang)(rowData[DATA_FIELD.NAME]);

      default:
        console.log(`[ERROR]: field handler missing for ${field}`);
        return "";
    }
  });
}
