import { EN_PACK } from "./EN";
import { CN_PACK, mapSetNameToCN, mapItemNameToCN } from "./CN";

import { LANG } from "../../utils/enums";
import { TABLE_MODE } from "../model/enums";

export function translator(context, lang, collection) {
  let text = "";
  switch (lang) {
    case LANG.CN:
      text = CN_PACK[collection][context];
      break;
    case LANG.EN:
      text = EN_PACK[collection][context];
      break;
    default:
      console.log("[ERROR]: Translate pack not imported for current language");
      text = EN_PACK[collection][context];
      break;
  }
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
        "[ERROR]: Translate mapper not imported for current language"
      );
      return (a) => a;
  }
}
