import React, { useRef } from "react";
import { DATA_FIELD, STYLE, STYLES } from "../model/enums";
import { translator } from "../translation/translator";
import { useGlobal } from "../../context/GlobalContext";
import { TAG_MULTIPLIERS } from "../model/constants";
import { FILTER_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";

export default function FilterSimulator({ tags, filter, setFilter }) {
  let { lang } = useGlobal();
  const addTagSelectRef = useRef(null);

  const onSimulatorStatChange = (e, level) => {
    switch (level) {
      case DATA_FIELD.SEC_STAT:
        setFilter({
          ...filter,
          simulator: { ...filter.simulator, secStat: Number(e.target.value) },
        });
        break;
      case DATA_FIELD.MAIN_STAT:
        setFilter({
          ...filter,
          simulator: { ...filter.simulator, mainStat: Number(e.target.value) },
        });
        break;
    }
  };

  const onTagMultiplierChange = (e) => {
    setFilter({
      ...filter,
      simulator: { ...filter.simulator, tagMultiplier: Number(e.target.value) },
    });
  };
  const onAddTag = () => {
    let tags = filter.simulator.tags.slice();
    tags.push(addTagSelectRef.current.value);
    setFilter({ ...filter, simulator: { ...filter.simulator, tags } });
  };
  const onRemoveTag = (tag) => {
    let id = filter.simulator.tags.indexOf(tag);
    let tags = filter.simulator.tags.slice();
    tags.splice(id, 1);
    setFilter({ ...filter, simulator: { ...filter.simulator, tags } });
  };

  return (
    <div className="nikkikiwi-filter-simulator">
      <div>
        <b>
          {translator(
            FILTER_CONTEXT.TITLE_SIMULATOR,
            lang,
            TRANSLATE_COLLECTION.FILTER
          )}
          :
        </b>
      </div>
      <label>
        {translator(
          FILTER_CONTEXT.LABEL_MAIN_STAT,
          lang,
          TRANSLATE_COLLECTION.FILTER
        )}
        :
        <select
          value={filter.simulator.mainStat}
          onChange={(e) => onSimulatorStatChange(e, DATA_FIELD.MAIN_STAT)}
        >
          {STYLES.map((style, i) => (
            <option value={style} key={i}>
              {translator(style, lang, TRANSLATE_COLLECTION.ITEM_STYLES)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {translator(
          FILTER_CONTEXT.LABEL_SEC_STAT,
          lang,
          TRANSLATE_COLLECTION.FILTER
        )}
        :
        <select
          value={filter.simulator.secStat}
          onChange={(e) => onSimulatorStatChange(e, DATA_FIELD.SEC_STAT)}
        >
          {[STYLE.NONE, ...STYLES]
            .filter((style) => style !== filter.simulator.mainStat)
            .map((style, i) => (
              <option value={style} key={i}>
                {translator(style, lang, TRANSLATE_COLLECTION.ITEM_STYLES)}
              </option>
            ))}
        </select>
      </label>
      {filter.simulator.tags.length ? (
        <label>
          {translator(
            FILTER_CONTEXT.LABEL_TAG_POWER,
            lang,
            TRANSLATE_COLLECTION.FILTER
          )}
          :
          {TAG_MULTIPLIERS.map((value, i) => (
            <label className="nikkikiwi-filter-radio-group" key={i}>
              <input
                type="radio"
                value={value}
                checked={value === filter.simulator.tagMultiplier}
                onChange={onTagMultiplierChange}
              />
              <div className="nikkikiwi-filter-config-radio-fake" />
              {value}
            </label>
          ))}
        </label>
      ) : null}
      {filter.simulator.tags.map((tag, i) => (
        <label key={i}>
          <button
            className="nikkikiwi-filter-x-button"
            onClick={() => onRemoveTag(tag)}
          >
            ×
          </button>
          {translator(
            FILTER_CONTEXT.LABEL_TAG,
            lang,
            TRANSLATE_COLLECTION.FILTER
          )}
          : {tag}
        </label>
      ))}
      <label>
        {translator(
          FILTER_CONTEXT.LABEL_ADD_BONUS_TAG,
          lang,
          TRANSLATE_COLLECTION.FILTER
        )}
        <select ref={addTagSelectRef}>
          {tags
            .filter((tag) => filter.simulator.tags.indexOf(tag) < 0)
            .sort()
            .map((tag, i) => (
              <option value={tag} key={i}>
                {tag}
              </option>
            ))}
        </select>
        <button className="nikkikiwi-filter-sign-button" onClick={onAddTag}>
          +
        </button>
      </label>
      <label>
        {translator(
          FILTER_CONTEXT.LABEL_STYLE_BONUS,
          lang,
          TRANSLATE_COLLECTION.FILTER
        )}
        : 100
      </label>
      <label>
        {translator(
          FILTER_CONTEXT.LABEL_SLOT_STAT_BONUS,
          lang,
          TRANSLATE_COLLECTION.FILTER
        )}
        : 6%
      </label>
      <label>
        {translator(
          FILTER_CONTEXT.LABEL_SLOT_SCORE_BONUS,
          lang,
          TRANSLATE_COLLECTION.FILTER
        )}
        : 8%
      </label>
      <label>
        {translator(
          FILTER_CONTEXT.LABEL_FIELD_BONUS,
          lang,
          TRANSLATE_COLLECTION.FILTER
        )}
      </label>
    </div>
  );
}
