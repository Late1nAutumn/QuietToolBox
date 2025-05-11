import React, { useEffect, useRef, useState } from "react";

import { useGlobal } from "../../../context/GlobalContext";

import { HELP_PAGE_MODE } from "../../utils/enum";

import { translator } from "../../utils/translation/translator";
import {
  APP_MISC_CONTEXT,
  MODAL_CONTEXT,
  TRANSLATION_COLLECTION,
} from "../../utils/translation/context";

export default function ModalHelp({
  initContent,
  setModalComponent,
  onCancel,
}) {
  const { lang } = useGlobal();

  const articleLiRef = useRef({});

  const [page, setPage] = useState(null);

  useEffect(() => {
    setPage(initContent);
  }, []);

  useEffect(() => {
    patchHelpArticle[page]?.(articleLiRef);
  }, [page]);

  const onCancelClick = () => {
    if (onCancel) onCancel();
    setModalComponent(null);
  };

  const NestedList = ({ content, id }) => {
    if (typeof content === "string")
      return (
        <li ref={(el) => (articleLiRef.current[id] = el)} id={id}>
          {content}
        </li>
      );
    return (
      <ul>
        {content.map((item, i) => (
          <NestedList content={item} id={id + "_" + i} key={i} />
        ))}
      </ul>
    );
  };

  return (
    <div className="grainbrain-modal-content untouchable">
      <h2>
        {translator(
          MODAL_CONTEXT.MODAL_TITLE_HELP,
          lang,
          TRANSLATION_COLLECTION.MODAL
        )}
      </h2>
      <div className="grainbrain-help-content">
        <div className="grainbrain-help-sidebar">
          {Object.values(HELP_PAGE_MODE).map((mode, i) => (
            <div
              className={
                mode === page ? "grainbrain-help-sidebar-selected" : ""
              }
              onClick={() => setPage(mode)}
              key={i}
            >
              {translator(mode, lang, TRANSLATION_COLLECTION.HELP_MODE)}
            </div>
          ))}
        </div>
        <div className="grainbrain-help-border" />
        <div className="grainbrain-help-article">
          {page &&
            translator(page, lang, TRANSLATION_COLLECTION.HELP).map(
              ({ title, list }, i) => (
                <React.Fragment key={i}>
                  <h3>{title}</h3>
                  <NestedList content={list} id={i} />
                </React.Fragment>
              )
            )}
        </div>
      </div>
      <div className="grainbrain-modal-content-buttons">
        <button onClick={onCancelClick}>
          {translator(
            APP_MISC_CONTEXT.BUTTON_BACK,
            lang,
            TRANSLATION_COLLECTION.APP_MISC
          )}
        </button>
      </div>
    </div>
  );
  i;
}

const patchHelpArticle = {
  [HELP_PAGE_MODE.CONTROL]: (ref) => {
    insertFirstChildImg("icon", ref.current["1_0"], "delete");
    insertFirstChildImg("icon", ref.current["2_0"], "tree_replanting");
    ref.current["2_1_0"].style.fontWeight = "bold";
    ref.current["2_1_0"].style.textDecoration = "underline";
    insertFirstChildImg("icon", ref.current["2_2"], "supervise");
    insertFirstChildImg("icon", ref.current["2_3"], "iron_clamps");
    insertFirstChildImg("icon", ref.current["2_4"], "tracking");
    insertFirstChildImg("icon", ref.current["2_5"], "unknown_mercenary");
  },
  [HELP_PAGE_MODE.GAME_SYSTEM]: (ref) => {
    ref.current["3_0"].style.fontWeight = "bold";
    ref.current["3_0"].style.textDecoration = "underline";
    ref.current["3_0"].style.listStyleType = "none";
    ref.current["4_2_1"].style.fontWeight = "bold";
    ref.current["4_3"].style.listStyleType = "none";
    insertFirstChildImg("figure", ref.current["4_3"], "article/preference");
    ref.current["4_7"].style.listStyleType = "none";
    insertFirstChildImg("figure", ref.current["4_7"], "article/path");
    ref.current["4_10"].style.listStyleType = "none";
    insertFirstChildImg("figure", ref.current["4_10"], "article/observation");
    insertFirstChildImg(
      "icon",
      ref.current["5_1_0"],
      "precision-cross-breeding"
    );
    insertFirstChildImg("icon", ref.current["5_1_1"], "ancient-techniques");
    insertFirstChildImg("icon", ref.current["5_3_0"], "wheelbarrow");
    insertFirstChildImg("icon", ref.current["5_5_0"], "wheelbarrow");
    insertFirstChildImg("icon", ref.current["5_5_1"], "yuan");
    ref.current["6_0"].style.listStyleType = "none";
    ref.current["6_1"].style.margin = "10px 0";
    ref.current["6_2"].style.margin = "10px 0";
    ref.current["6_3"].style.margin = "10px 0";
    ref.current["6_4"].style.margin = "10px 0";
    ref.current["6_5"].style.margin = "10px 0";
  },
  [HELP_PAGE_MODE.STATISTICS]: (ref) => {
    ref.current["0_0"].style.listStyleType = "none";
    ref.current["0_0"].style.fontWeight = "bold";
    ref.current["0_0"].style.textDecoration = "underline";
    ref.current["0_1"].style.listStyleType = "none";
    ref.current["0_1"].style.textDecoration = "underline";
    ref.current["0_1"].style.fontWeight = "bold";
    ref.current["1_0"].style.fontWeight = "bold";
    ref.current["1_1"].style.fontWeight = "bold";
    ref.current["1_2"].style.fontWeight = "bold";
  },
};

const insertFirstChildImg = (type, ele, file) => {
  const img = document.createElement("img");
  img.src = `./asset/aoe4/${file}.png`;
  img.className = `grainbrain-help-${type}`;
  ele.insertBefore(img, ele.firstChild);
};
