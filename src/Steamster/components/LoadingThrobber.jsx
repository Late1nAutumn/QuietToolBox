import React from "react";

import { translator } from "../translation/translator";
import { useGlobal } from "../../context/GlobalContext";
import { APP_MISC_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";

export default function LoadingThrobber() {
  const { lang } = useGlobal();
  return (
    <div className="steamster-loading">
      <div className="steamster-loading-throbber">
        <div />
        <div />
        <div />
      </div>
      <span>
        {translator(
          APP_MISC_CONTEXT.LOADING,
          lang,
          TRANSLATE_COLLECTION.APP_MISC
        )}
        ...
      </span>
    </div>
  );
}
