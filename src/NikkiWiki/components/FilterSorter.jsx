import React, { useRef } from "react";
import { translator } from "../translation/translator";
import { useGlobal } from "../../context/GlobalContext";
import { FILTER_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";

export default function FilterSorter({ fields, filter, setFilter }) {
  let { lang } = useGlobal();
  const addSortSelectRef = useRef(null);

  const onAddSortRule = (order) => {
    let sort = filter.sort.slice();
    sort.push({ field: addSortSelectRef.current.value, order });
    setFilter({ ...filter, sort });
  };
  const onRemoveSortRule = (fieldValue) => {
    let id = filter.sort.map(({ field }) => field).indexOf(fieldValue);
    let sort = filter.sort.slice();
    sort.splice(id, 1);
    setFilter({ ...filter, sort });
  };
  const onSwitchSortRule = (fieldValue) => {
    let id = filter.sort.map(({ field }) => field).indexOf(fieldValue);
    let { field, order } = filter.sort[id];
    let sort = filter.sort.slice();
    sort[id] = { field, order: 0 - order };
    setFilter({ ...filter, sort });
  };

  return (
    <>
      {filter.sort.map(({ field, order }, i) => (
        <span className="nikkikiwi-filter-sort" key={i}>
          <b>{i + 1}.</b>
          <div>
            <button
              className="nikkikiwi-filter-x-button"
              onClick={() => onRemoveSortRule(field)}
            >
              ×
            </button>
            {translator(field, lang, TRANSLATE_COLLECTION.TABLE_HEADERS)}&nbsp;
            <button
              className="nikkikiwi-filter-sign-button"
              onClick={() => onSwitchSortRule(field)}
            >
              {order < 0 ? "⬆" : "⬇"}
            </button>
          </div>
        </span>
      ))}
      <label className="nikkikiwi-filter-add-sort">
        {translator(
          FILTER_CONTEXT.LABEL_ADD_SORT_RULE,
          lang,
          TRANSLATE_COLLECTION.FILTER
        )}
        :&nbsp;
        <select ref={addSortSelectRef}>
          {fields
            .filter(
              (field) =>
                filter.sort.map(({ field }) => field).indexOf(field) < 0
            )
            .map((field, i) => (
              <option value={field} key={i}>
                {translator(field, lang, TRANSLATE_COLLECTION.TABLE_HEADERS)}
              </option>
            ))}
        </select>
        <button
          className="nikkikiwi-filter-sign-button"
          onClick={() => onAddSortRule(1)}
        >
          ⬇
        </button>
        <button
          className="nikkikiwi-filter-sign-button"
          onClick={() => onAddSortRule(-1)}
        >
          ⬆
        </button>
      </label>
    </>
  );
}
