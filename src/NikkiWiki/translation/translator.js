import { EN_PACK } from "./EN";
import { CN_PACK, mapSetNameToCN, mapItemNameToCN, mapTagNameToCN } from "./CN";

import { LANG } from "../../utils/enums";
import { TABLE_MODE } from "../model/enums";

export function translator(context, lang, collection) {
  let text = "";
  switch (lang) {
    case LANG.CN:
      text = CN_PACK[collection]?.[context] || "";
      break;
    case LANG.EN:
      text = EN_PACK[collection]?.[context] || "";
      break;
    default:
      console.log("[ERROR]: Translate pack not imported for current language");
      text = EN_PACK[collection]?.[context] || "";
      break;
  }
  if (text === "")
    console.log(
      `[ERROR]: translation missing for [${context}] in collection [${collection} for language ${lang}]`
    );
  return text;
}

export function itemNameMapper(itemType, lang) {
  switch (lang) {
    case LANG.CN:
      if (itemType === TABLE_MODE.SET) return mapSetNameToCN;
      return mapItemNameToCN;
    case LANG.EN:
      return (a) => a;
    default:
      console.log(
        "[ERROR]: Item translate mapper not imported for current language"
      );
      return (a) => a;
  }
}

export function tagNameMapper(tagName, lang) {
  switch (lang) {
    case LANG.CN:
      return mapTagNameToCN(tagName);
    case LANG.EN:
      return tagName;
    default:
      console.log(
        "[ERROR]: Tag translate mapper not imported for current language"
      );
      return tagName;
  }
}
