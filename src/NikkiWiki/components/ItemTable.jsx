import React, { useEffect, useRef, useState } from "react";

import {
  TABLE_MODE,
  STAT_MODE,
  STYLE,
  DATA_FIELD,
  REGION,
  COMPENDIUM,
  COMPENDIUM_SUB,
} from "../model/enums.js";
import {
  clothesOGData,
  mapFieldsToRowValues,
  mapSetData,
} from "../model/dataProcessor/GDriveSheet/mappers.js";
import {
  activeFieldsFilter,
  mainStatType,
  sortData,
  tableFieldsOfMode,
} from "../model/utils.js";

import { useGlobal } from "../../context/GlobalContext.jsx";
import Filter from "./Filter.jsx";
import DataTable from "./DataTable.jsx";
import { TAG_MULTIPLIERS } from "../model/constants.js";
import { translator } from "../translation/translator.js";
import {
  APP_MISC_CONTEXT,
  TRANSLATE_COLLECTION,
} from "../translation/context.js";

export default function ItemTable({ tableMode }) {
  let { lang } = useGlobal();
  const updateDebounceTimeoutRef = useRef(null);

  // processed item data, for set score simulator to track original items
  const [itemCollection, setItemCollection] = useState([]);
  // processed data
  const [itemData, setItemData] = useState([]);
  // data displayed on table
  const [tableData, setTableData] = useState([]);

  const [fieldRanges, setFieldRanges] = useState({
    [DATA_FIELD.TAGS]: [],
    [DATA_FIELD.COMPENDIUM]: [
      ...COMPENDIUM.reduce((acc, page) => {
        COMPENDIUM_SUB[page].forEach((subPage) =>
          acc.push(page * 100 + subPage)
        );
        return acc;
      }, []),
      0,
    ],
  });
  const [fields, setFields] = useState([]);
  const [filter, setFilter] = useState({
    config: {
      statMode: STAT_MODE.DETAILED,
      itemLv: 11,
      filters: [
        // { field, val, max, min, up, low }
      ],
    },
    simulator: {
      mainStat: STYLE.ELEGANT,
      secStat: STYLE.NONE,
      tags: [],
      tagMultiplier: TAG_MULTIPLIERS[0],
      bonus: {
        [REGION.FLORAWISH]: {
          style: 100,
          slotStat: 0.06,
          slotScore: 0.08,
        },
      },
    },
    columns: {},
    sort: [],
  });

  let activeFields = activeFieldsFilter(fields, filter.columns);

  // init data
  useEffect(() => {
    let { collection, ranges } = clothesOGData();
    setItemCollection(collection);
    let tags = ranges[DATA_FIELD.TAGS];
    console.log(
      `[log]: raw data parsed, ${tags.length} tags detected: ${JSON.stringify(
        tags
      )}`
    );
    let data = [];
    switch (tableMode) {
      case TABLE_MODE.RAW:
        data = collection;
        break;
      case TABLE_MODE.SPARE:
        data = collection.filter(({ set }) => set !== "");
        break;
      case TABLE_MODE.SET:
        let sets = mapSetData(collection);
        for (let name in sets) data.push({ name, ...sets[name] });
        break;
      default:
        break;
    }

    setItemData(data);
    setFieldRanges({ ...fieldRanges, ...ranges });

    return () => clearTimeout(updateDebounceTimeoutRef.current);
  }, []);

  // update header fields
  useEffect(() => {
    let fields = tableFieldsOfMode(tableMode, filter.config.statMode, lang);
    let temp = {};
    fields.forEach((field) => {
      temp[field] = true;
    });
    setFields(fields);
    setFilter({ ...filter, columns: temp });
  }, [tableMode, filter.config.statMode, lang]);

  // update calculated data
  useEffect(() => {
    if (updateDebounceTimeoutRef.current)
      clearTimeout(updateDebounceTimeoutRef.current);

    updateDebounceTimeoutRef.current = setTimeout(() => {
      updateCalculatedData();
    }, 300);
  }, [itemData, fields, filter.columns, filter.sort, filter, lang]);

  const updateCalculatedData = () => {
    let rows = itemData.map((obj) =>
      mapFieldsToRowValues(
        obj,
        activeFields,
        lang,
        filter,
        itemCollection,
        tableMode
      )
    );
    // filter data
    let filteredData = [];
    itemData.forEach((obj, i) => {
      for (let { field, val, up, low } of filter.config.filters) {
        switch (field) {
          case DATA_FIELD.SLOT:
          case DATA_FIELD.RARITY:
          case DATA_FIELD.SET:
          case DATA_FIELD.COMPENDIUM:
          case DATA_FIELD.OBTAIN_FROM:
            if (obj[field] !== val) return;
            break;
          case DATA_FIELD.TAGS:
            if (!(val in obj[field])) return;
            break;
          case DATA_FIELD.MAIN_STAT:
            let [main] = mainStatType(obj[DATA_FIELD.STAT]);
            if (main !== val) return;
            break;
          case DATA_FIELD.SEC_STAT:
            let [, secondary] = mainStatType(obj[DATA_FIELD.STAT]);
            if (secondary !== val) return;
            break;
          case DATA_FIELD.STAT_EL:
          case DATA_FIELD.STAT_FR:
          case DATA_FIELD.STAT_SW:
          case DATA_FIELD.STAT_SX:
          case DATA_FIELD.STAT_CL:
          case DATA_FIELD.STAT_MAIN:
          case DATA_FIELD.SIM_SCORE:
          case DATA_FIELD.COUNT:
          case DATA_FIELD.COUNT_ACCESSORY:
            let fieldIndex = activeFields.indexOf(field);
            if (rows[i][fieldIndex] > up || rows[i][fieldIndex] < low) return;
            break;
          default:
            console.log(`[ERROR]: filter handler missing for ${field}`);
            break;
        }
      }
      filteredData.push({ originIndex: i, data: rows[i] });
    });
    // sort data
    let sortFieldMap = filter.sort.map(({ field, order }) => ({
      index: activeFields.indexOf(field),
      order,
    }));
    let sortedData = sortData(filteredData, sortFieldMap);

    setTableData(sortedData);
  };

  return (
    <>
      <h1>
        {translator(
          APP_MISC_CONTEXT.APP_TITLE,
          lang,
          TRANSLATE_COLLECTION.APP_MISC
        )}
      </h1>
      <Filter
        fields={fields}
        activeFields={activeFields}
        filter={filter}
        setFilter={setFilter}
        ranges={fieldRanges}
        tableData={tableData}
      />
      <DataTable originData={itemData} data={tableData} fields={activeFields} />
    </>
  );
}
