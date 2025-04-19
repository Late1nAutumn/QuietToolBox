import React from "react";
import { mainStatType } from "../model/utils";
import { useGlobal } from "../../context/GlobalContext";
import { translator } from "../translation/translator";
import { DATA_FIELD, STYLE } from "../model/enums";
import {
  CLASS_NAMES,
  DUEL_ACCESORY_LIMIT,
  FANDOM_URL,
} from "../model/constants";
import { APP_MISC_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";

export default function DataTable({ originData, data, fields }) {
  const { lang } = useGlobal();

  const cellClassName = (value, i, j) => {
    let className = "";
    let [main, sec] = mainStatType(originData[i][DATA_FIELD.STAT]);
    if (value === "?") className += CLASS_NAMES.WARNING_CELL + " ";
    switch (fields[j]) {
      case DATA_FIELD.COUNT_ACCESSORY:
        if (value > DUEL_ACCESORY_LIMIT)
          className += CLASS_NAMES.WARNING_CELL + " ";
        break;
      case DATA_FIELD.MAIN_STAT:
      case DATA_FIELD.SEC_STAT:
        switch (fields[j] === DATA_FIELD.MAIN_STAT ? main : sec) {
          case STYLE.ELEGANT:
            className += CLASS_NAMES.ELEGANT_CELL + " ";
            break;
          case STYLE.FRESH:
            className += CLASS_NAMES.FRESH_CELL + " ";
            break;
          case STYLE.SWEET:
            className += CLASS_NAMES.SWEET_CELL + " ";
            break;
          case STYLE.SEXY:
            className += CLASS_NAMES.SEXY_CELL + " ";
            break;
          case STYLE.COOL:
            className += CLASS_NAMES.COOL_CELL + " ";
            break;
        }
        break;
      case DATA_FIELD.STAT_EL:
        if (main === STYLE.ELEGANT)
          className += CLASS_NAMES.MAIN_STAT_CELL + " ";
        break;
      case DATA_FIELD.STAT_FR:
        if (main === STYLE.FRESH) className += CLASS_NAMES.MAIN_STAT_CELL + " ";
        break;
      case DATA_FIELD.STAT_SW:
        if (main === STYLE.SWEET) className += CLASS_NAMES.MAIN_STAT_CELL + " ";
        break;
      case DATA_FIELD.STAT_SX:
        if (main === STYLE.SEXY) className += CLASS_NAMES.MAIN_STAT_CELL + " ";
        break;
      case DATA_FIELD.STAT_CL:
        if (main === STYLE.COOL) className += CLASS_NAMES.MAIN_STAT_CELL + " ";
        break;
    }
    switch (fields[j]) {
      case DATA_FIELD.RARITY:
      case DATA_FIELD.COUNT:
      case DATA_FIELD.COUNT_ACCESSORY:
      case DATA_FIELD.MAIN_STAT:
      case DATA_FIELD.SEC_STAT:
        className += CLASS_NAMES.TEXT_CENTER + " ";
        break;
      case DATA_FIELD.STAT_EL:
      case DATA_FIELD.STAT_FR:
      case DATA_FIELD.STAT_SW:
      case DATA_FIELD.STAT_SX:
      case DATA_FIELD.STAT_CL:
      case DATA_FIELD.STAT_MAIN:
      case DATA_FIELD.SIM_SCORE:
        className += CLASS_NAMES.TEXT_RIGHT + " ";
        break;
    }
    return className;
  };
  return (
    <table className="nikkikiwi-datatable">
      <thead>
        <tr>
          {fields.map((field, i) => (
            <th key={i}>
              {translator(field, lang, TRANSLATE_COLLECTION.TABLE_HEADERS)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {row.data.map((value, j) => (
              <td className={cellClassName(value, row.originIndex, j)} key={j}>
                {(() => {
                  switch (fields[j]) {
                    case DATA_FIELD.NAME:
                      return (
                        <a
                          href={FANDOM_URL + value.replace(" ", "_")}
                          target="_blank"
                        >
                          {value}
                        </a>
                      );
                    default:
                      return value;
                  }
                })()}
              </td>
            ))}
          </tr>
        ))}
        {data.length ? null : (
          <tr>
            <td colSpan={fields.length} className="nikkikiwi-datatable-nodata">
              {translator(
                APP_MISC_CONTEXT.TABLE_NO_DATA,
                lang,
                TRANSLATE_COLLECTION.APP_MISC
              )}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
