import { EN_PACK } from "./EN";
import { CN_PACK } from "./CN";

import { LANG } from "../../utils/enums";

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
