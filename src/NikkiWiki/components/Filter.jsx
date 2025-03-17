import React, { useState } from "react";

import { useGlobal } from "../../context/GlobalContext";
import { DATA_FIELD, FILTER_TAB, STAT_MODE } from "../model/enums";
import { translator } from "../translation/translator";

import FilterSorter from "./FilterSorter";
import FilterSimulator from "./FilterSimulator";
import FilterFilter from "./FilterFilter";
import { CLASS_NAMES } from "../model/constants";
import { FILTER_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";

export default function Filter({
  fields,
  activeFields,
  filter,
  setFilter,
  ranges,
  tableData,
}) {
  let { lang } = useGlobal();
  const [tab, setTab] = useState(FILTER_TAB.FILTER);

  const onTabClick = (val) => {
    setTab(val);
  };
  const onStatModeChange = (e) => {
    setFilter({
      ...filter,
      config: { ...filter.config, statMode: Number(e.target.value) },
    });
  };
  const onItemLvChange = (e) => {
    setFilter({
      ...filter,
      config: { ...filter.config, itemLv: Number(e.target.value) },
    });
  };
  const onColumnCheckChange = (field) => {
    setFilter({
      ...filter,
      columns: { ...filter.columns, [field]: !filter.columns[field] },
    });
  };

  return (
    <div className="nikkikiwi-filter">
      <div className="nikkikiwi-filter-tabs">
        {Object.values(FILTER_TAB).map((t, i) => (
          <div
            className={`${
              tab === t ? CLASS_NAMES.SELECTED_TAB : ""
            } untouchable`}
            onClick={() => onTabClick(t)}
            key={i}
          >
            {translator(t, lang, TRANSLATE_COLLECTION.FILTER_TABS)}
          </div>
        ))}
      </div>
      <div className="nikkikiwi-filter-content">
        {(() => {
          switch (tab) {
            case FILTER_TAB.FILTER:
              return (
                <>
                  <div>
                    <b className="untouchable">
                      {translator(
                        FILTER_CONTEXT.TITLE_CONFIGURATION,
                        lang,
                        TRANSLATE_COLLECTION.FILTER
                      )}
                      :
                    </b>
                  </div>
                  <div className="nikkikiwi-filter-config">
                    <span className="untouchable">
                      {translator(
                        FILTER_CONTEXT.LABEL_STAT_MODE,
                        lang,
                        TRANSLATE_COLLECTION.FILTER
                      )}
                      :
                    </span>
                    {Object.values(STAT_MODE).map((statMode, i) => (
                      <label className="nikkikiwi-filter-radio-group" key={i}>
                        <input
                          type="radio"
                          value={statMode}
                          checked={statMode === filter.config.statMode}
                          onChange={onStatModeChange}
                        />
                        <div className="nikkikiwi-filter-config-radio-fake" />
                        {translator(
                          statMode,
                          lang,
                          TRANSLATE_COLLECTION.TABLE_STAT_MODES
                        )}
                      </label>
                    ))}
                  </div>
                  <div className="nikkikiwi-filter-config">
                    <span className="untouchable">
                      {translator(
                        FILTER_CONTEXT.LABEL_ITEM_LV,
                        lang,
                        TRANSLATE_COLLECTION.FILTER
                      )}
                      :
                    </span>
                    <select
                      value={filter.config.itemLv}
                      onChange={onItemLvChange}
                    >
                      {new Array(12).fill(0).map((_, i) => (
                        <option value={i} key={i}>
                          {(() => {
                            let context;
                            switch (i) {
                              case 0:
                                context = FILTER_CONTEXT.OPTION_ITEMLV_0;
                                break;
                              case 11:
                                context = FILTER_CONTEXT.OPTION_ITEMLV_11;
                                break;
                              default:
                                context = FILTER_CONTEXT.OPTION_ITEM_LV;
                                break;
                            }
                            return (
                              translator(
                                context,
                                lang,
                                TRANSLATE_COLLECTION.FILTER
                              ) +
                              (context === FILTER_CONTEXT.OPTION_ITEM_LV
                                ? i
                                : "")
                            );
                          })()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <br />
                  <FilterFilter
                    filter={filter}
                    setFilter={setFilter}
                    ranges={ranges}
                    activeFields={activeFields}
                    tableData={tableData}
                  />
                  {filter.config.statMode === STAT_MODE.SIMULATION && (
                    <FilterSimulator
                      tags={ranges[DATA_FIELD.TAGS]}
                      filter={filter}
                      setFilter={setFilter}
                    />
                  )}
                </>
              );
            case FILTER_TAB.COLUMNS:
              return (
                <>
                  <div>
                    <b className="untouchable">
                      {translator(
                        FILTER_CONTEXT.TITLE_COLUMNS,
                        lang,
                        TRANSLATE_COLLECTION.FILTER
                      )}
                      :
                    </b>
                  </div>
                  {fields.map((field, i) => (
                    <label
                      className="nikkikiwi-filter-column nikkikiwi-filter-radio-group"
                      key={i}
                    >
                      <input
                        type="checkbox"
                        checked={filter.columns[field]}
                        onChange={() => onColumnCheckChange(field)}
                      />
                      <div className="nikkikiwi-filter-config-radio-fake" />
                      {translator(
                        field,
                        lang,
                        TRANSLATE_COLLECTION.TABLE_HEADERS
                      )}
                    </label>
                  ))}
                </>
              );
            case FILTER_TAB.SORT:
              return (
                <>
                  <div>
                    <b className="untouchable">
                      {translator(
                        FILTER_CONTEXT.TITLE_SORT,
                        lang,
                        TRANSLATE_COLLECTION.FILTER
                      )}
                      :
                    </b>
                  </div>
                  <FilterSorter
                    fields={activeFields}
                    filter={filter}
                    setFilter={setFilter}
                  />
                </>
              );
          }
        })()}
      </div>
    </div>
  );
}
