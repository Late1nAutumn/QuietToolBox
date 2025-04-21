import React from "react";
import { useGlobal } from "../../context/GlobalContext";

import { LOAD_STATUS } from "../../utils/enums";
import { translator } from "../translation/translator";
import { APP_MISC_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";

import AppItem from "./AppItem";
import LoadingThrobber from "./LoadingThrobber";

export default function AppGrid({
  collections,
  setCollections,
  lastElementRefs,
  sortMode,
}) {
  const { lang } = useGlobal();

  const onCollectionExpandToggle = (i) => {
    let temp = collections.slice();
    switch (temp[i].expand) {
      case LOAD_STATUS.UNLOAD:
        temp[i].expand = LOAD_STATUS.LOADING;
        break;
      case LOAD_STATUS.LOADED:
        temp[i].expand = LOAD_STATUS.UNLOAD;
        break;
    }
    setCollections(temp);
  };

  return (
    <div className="steamster-content">
      {collections.length > 0 ? (
        collections.map(({ title, expand, list, displayAmount }, i) => (
          <div key={i}>
            <div className="steamster-title">
              <span onClick={() => onCollectionExpandToggle(i)}>
                <span
                  className={
                    "steamster-title-arrow" +
                    (expand !== LOAD_STATUS.UNLOAD ? "-expand" : "")
                  }
                >
                  ▼
                </span>
                <span>
                  <b>{title}</b>
                </span>
                &nbsp;
                <span className="steamster-title-count">({list.length})</span>
              </span>
            </div>
            {(() => {
              switch (expand) {
                case LOAD_STATUS.LOADED:
                  return (
                    <div className="steamster-grid">
                      {list.slice(0, displayAmount).map((data, j) => (
                        <AppItem
                          data={data}
                          referrer={(ele) => {
                            if (Math.min(displayAmount, list.length) - j === 1)
                              lastElementRefs.current[i] = ele;
                          }}
                          sortMode={sortMode}
                          key={j}
                        />
                      ))}
                      {displayAmount < list.length && <LoadingThrobber />}
                    </div>
                  );
                case LOAD_STATUS.LOADING:
                  return <LoadingThrobber />;
                // case LOAD_STATUS.UNLOAD:
                default:
                  return null;
              }
            })()}
          </div>
        ))
      ) : (
        <div className="steamster-content-empty">
          {translator(
            APP_MISC_CONTEXT.NO_MATCH,
            lang,
            TRANSLATE_COLLECTION.APP_MISC
          )}
        </div>
      )}
    </div>
  );
}
