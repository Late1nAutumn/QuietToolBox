import React, { useRef } from "react";
import {
  DATA_FIELD,
  FILTABLE_FIELDS_INPUT_TYPE,
  FILTER_INPUT_VALUE_TYPE,
  SLOT,
  STYLE,
  STYLES,
  TABLE_MODE,
} from "../model/enums";
import {
  itemNameMapper,
  tagNameMapper,
  translator,
} from "../translation/translator";
import { useGlobal } from "../../context/GlobalContext";
import { FILTER_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";
import { compendiumEnumToText } from "../model/utils";

export default function FilterFilter({
  filter,
  setFilter,
  ranges,
  activeFields,
  tableData,
}) {
  let { lang } = useGlobal();
  const addFilterSelectRef = useRef(null);

  const onAddFilter = () => {
    let filters = filter.config.filters.slice();
    let field = addFilterSelectRef.current.value;
    let obj = { field };
    switch (field) {
      // set default form values
      case DATA_FIELD.SLOT:
        obj.val = SLOT.HAIR;
        break;
      case DATA_FIELD.RARITY:
        obj.val = 5;
        break;
      case DATA_FIELD.MAIN_STAT:
      case DATA_FIELD.SEC_STAT:
        obj.val = STYLES[0];
        break;

      case DATA_FIELD.STAT_EL:
      case DATA_FIELD.STAT_FR:
      case DATA_FIELD.STAT_SW:
      case DATA_FIELD.STAT_SX:
      case DATA_FIELD.STAT_CL:
      case DATA_FIELD.STAT_MAIN:
      case DATA_FIELD.SIM_SCORE:
        let index = activeFields.indexOf(field);
        obj.min = Infinity;
        obj.max = 0;
        tableData.forEach((row) => {
          obj.min = Math.min(obj.min, row.data[index]);
          obj.max = Math.max(obj.max, row.data[index]);
        });
        break;
      case DATA_FIELD.COUNT:
        obj.min = 2;
        obj.max = 20;
        break;
      case DATA_FIELD.COUNT_ACCESSORY:
        obj.min = 0;
        obj.max = 13;
        break;

      case DATA_FIELD.SET:
      case DATA_FIELD.TAGS:
      case DATA_FIELD.OBTAIN_FROM:
        obj.val = ranges[field][0];
        break;
      default:
        console.log(`[ERROR]: filter handler missing for ${field}`);
        break;
    }
    if (obj.min !== undefined) obj.low = obj.min;
    if (obj.max !== undefined) obj.up = obj.max;
    filters.push(obj);
    setFilter({ ...filter, config: { ...filter.config, filters } });
  };
  const onUpdateFilter = (e, field, valueType) => {
    let id = filter.config.filters.map(({ field }) => field).indexOf(field);
    let filters = filter.config.filters.slice();
    switch (field) {
      case DATA_FIELD.SET:
      case DATA_FIELD.TAGS:
      case DATA_FIELD.OBTAIN_FROM:
        filters[id].val = e.target.value;
        break;
      case DATA_FIELD.SLOT:
      case DATA_FIELD.RARITY:
      case DATA_FIELD.MAIN_STAT:
      case DATA_FIELD.SEC_STAT:
      case DATA_FIELD.COMPENDIUM:
        filters[id].val = Number(e.target.value);
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
        switch (valueType) {
          case FILTER_INPUT_VALUE_TYPE.UP:
            filters[id].up = Number(e.target.value);
            break;
          case FILTER_INPUT_VALUE_TYPE.LOW:
            filters[id].low = Number(e.target.value);
            break;
        }
        break;
      default:
        console.log(`[ERROR]: filter handler missing for ${field}`);
        break;
    }
    setFilter({ ...filter, config: { ...filter.config, filters } });
  };
  const onRemoveFilter = (field) => {
    let id = filter.config.filters.map(({ field }) => field).indexOf(field);
    let filters = filter.config.filters.slice();
    filters.splice(id, 1);
    setFilter({ ...filter, config: { ...filter.config, filters } });
  };

  return (
    <>
      {filter.config.filters.map(({ field, val, max, min, up, low }, i) => (
        <div className="nikkikiwi-filter-filter" key={i}>
          <button
            className="nikkikiwi-filter-x-button"
            onClick={() => onRemoveFilter(field)}
          >
            ×
          </button>
          {translator(field, lang, TRANSLATE_COLLECTION.TABLE_HEADERS)}:
          {(() => {
            let options;
            switch (field) {
              case DATA_FIELD.SLOT:
                options = Object.values(SLOT).map((type, i) => (
                  <option value={type} key={i}>
                    {translator(type, lang, TRANSLATE_COLLECTION.ITEM_SLOTS)}
                  </option>
                ));
                break;
              case DATA_FIELD.RARITY:
                options = [5, 4, 3, 2, 1].map((star, i) => (
                  <option value={star} key={i}>
                    {star}
                  </option>
                ));
                break;
              case DATA_FIELD.SET:
                options = ranges[field].map((value, i) => (
                  <option value={value} key={i}>
                    {itemNameMapper(TABLE_MODE.SET, lang)(value)}
                  </option>
                ));
                break;
              case DATA_FIELD.TAGS:
                options = ranges[field].map((value, i) => (
                  <option value={value} key={i}>
                    {tagNameMapper(value, lang)}
                  </option>
                ));
                break;
              case DATA_FIELD.OBTAIN_FROM:
                options = ranges[field].map((value, i) => (
                  <option value={value} key={i}>
                    {value}
                  </option>
                ));
                break;
              case DATA_FIELD.MAIN_STAT:
              case DATA_FIELD.SEC_STAT:
                let arr = STYLES.slice();
                if (field === DATA_FIELD.SEC_STAT) arr.push(STYLE.MULTY);
                options = arr.map((style, i) => (
                  <option value={style} key={i}>
                    {translator(style, lang, TRANSLATE_COLLECTION.ITEM_STYLES)}
                  </option>
                ));
                break;
              case DATA_FIELD.COMPENDIUM:
                options = ranges[field].map((page, i) => (
                  <option value={page} key={i}>
                    {compendiumEnumToText(page, lang)}
                  </option>
                ));
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
                return (
                  <>
                    <div className="nikkikiwi-range-container">
                      <input
                        className="nikkikiwi-range-lower"
                        type="range"
                        id="maxRange"
                        min={min}
                        max={max}
                        value={low}
                        onChange={(e) =>
                          onUpdateFilter(e, field, FILTER_INPUT_VALUE_TYPE.LOW)
                        }
                      />
                      <input
                        className="nikkikiwi-range-upper"
                        type="range"
                        id="minRange"
                        min={min}
                        max={max}
                        value={up}
                        onChange={(e) =>
                          onUpdateFilter(e, field, FILTER_INPUT_VALUE_TYPE.UP)
                        }
                      />
                      &nbsp;
                    </div>
                    {`${low} - ${up}`}
                  </>
                );
            }
            return (
              <select value={val} onChange={(e) => onUpdateFilter(e, field)}>
                {options}
              </select>
            );
          })()}
        </div>
      ))}
      <label className="nikkikiwi-filter-filter">
        {translator(
          FILTER_CONTEXT.LABEL_ADD_FILTER,
          lang,
          TRANSLATE_COLLECTION.FILTER
        )}
        :
        <select ref={addFilterSelectRef}>
          {FILTABLE_FIELDS_INPUT_TYPE.filter(
            (dataField) =>
              filter.config.filters
                .map(({ field }) => field)
                .indexOf(dataField) === -1 &&
              activeFields.indexOf(dataField) !== -1
          ).map((field, i) => (
            <option value={field} key={i}>
              {translator(field, lang, TRANSLATE_COLLECTION.TABLE_HEADERS)}
            </option>
          ))}
        </select>
        <button className="nikkikiwi-filter-sign-button" onClick={onAddFilter}>
          +
        </button>
      </label>
    </>
  );
}
