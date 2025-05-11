import { EN_PACK } from "./EN";
import { CN_PACK } from "./CN";

import { LANG } from "../../../utils/enums";

export function translator(context, lang, collection, fallback) {
  let text = "";
  switch (lang) {
    case LANG.CN:
      text = CN_PACK[collection]?.[context] || "";
      break;
    case LANG.EN:
      text = EN_PACK[collection]?.[context] || "";
      break;
    default:
      if (!fallback)
        console.log(
          "[ERROR]: Translate pack not imported for current language"
        );
      text = EN_PACK[collection]?.[context] || "";
      break;
  }
  if (text === "" && fallback) text = EN_PACK[collection]?.[context] || "";
  if (text === "" && !fallback)
    console.log(
      `[ERROR]: translation missing for [${context}] in collection [${collection} for language ${lang}]`
    );
  return text;
}
