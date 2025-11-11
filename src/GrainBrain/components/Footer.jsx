import React from "react";

import { useGlobal } from "../../context/GlobalContext";

import { BUILDING } from "../utils/aoe4/enum";
import { HELP_PAGE_MODE, NOTIFICATION_TYPE } from "../utils/enum";
import { autoFill, autoFillAvailable } from "../utils/func";

import { translator } from "../utils/translation/translator";
import {
  FOOTER_BUTTON_CONTEXT,
  NOTIFICATION_CONTEXT,
  TOOLTIP_ICONS_CONTEXT,
  TRANSLATION_COLLECTION,
} from "../utils/translation/context";

export default function Footer({
  gridRef,
  autoFillable,
  displayGrid,
  toggleGrid,
  displayGuidelines,
  toggleGuideline,
  autoCamera,
  updateObjectList,
  updateAvailabilities,
  newNotification,
  openHelpModal,
}) {
  const { lang } = useGlobal();

  const onAutoFill = () => {
    if (autoFillAvailable(gridRef.current.atlas)) {
      let list = autoFill(gridRef.current.atlas);
      if (list.length) {
        gridRef.current.batchNewObjectByCoord(BUILDING.FARM, {}, list);
        updateObjectList();
        updateAvailabilities();
        newNotification(
          `${list.length}${translator(
            NOTIFICATION_CONTEXT.AUTO_FILL_SUCCESS,
            lang,
            TRANSLATION_COLLECTION.NOTIFICATION
          )}`,
          NOTIFICATION_TYPE.INFO
        );
      } else
        newNotification(
          translator(
            NOTIFICATION_CONTEXT.AUTO_FILL_FULL,
            lang,
            TRANSLATION_COLLECTION.NOTIFICATION
          ),
          NOTIFICATION_TYPE.WARN
        );
    } else
      newNotification(
        translator(
          NOTIFICATION_CONTEXT.AUTO_FILL_INVALID,
          lang,
          TRANSLATION_COLLECTION.NOTIFICATION
        ),
        NOTIFICATION_TYPE.ERROR
      );
  };

  const onHelpclick = () => openHelpModal(HELP_PAGE_MODE.CONTROL);

  return (
    <div className="grainbrain-footer">
      <div
        onClick={onAutoFill}
        title={translator(
          TOOLTIP_ICONS_CONTEXT.AUTO_FILL,
          lang,
          TRANSLATION_COLLECTION.TOOLTIP_ICONS
        )}
      >
        <img
          className={autoFillable ? "" : "grainbrain-inactive"}
          src="./asset/aoe4/tree_replanting.png"
          alt="button_icon"
        />
        <div>
          {translator(
            FOOTER_BUTTON_CONTEXT.AUTO_FILL,
            lang,
            TRANSLATION_COLLECTION.FOOTER_BUTTON
          )}
        </div>
      </div>
      <div
        onClick={toggleGuideline}
        title={translator(
          TOOLTIP_ICONS_CONTEXT.TOGGLE_GUIDELINE,
          lang,
          TRANSLATION_COLLECTION.TOOLTIP_ICONS
        )}
      >
        <img
          className={displayGuidelines ? "" : "grainbrain-inactive"}
          src="./asset/aoe4/supervise.png"
          alt="button_icon"
        />
        <div>
          {translator(
            FOOTER_BUTTON_CONTEXT.TOGGLE_GUIDELINE,
            lang,
            TRANSLATION_COLLECTION.FOOTER_BUTTON
          )}
        </div>
      </div>
      <div
        onClick={toggleGrid}
        title={translator(
          TOOLTIP_ICONS_CONTEXT.TOGGLE_GRID,
          lang,
          TRANSLATION_COLLECTION.TOOLTIP_ICONS
        )}
      >
        <img
          className={displayGrid ? "" : "grainbrain-inactive"}
          src="./asset/aoe4/iron_clamps.png"
          alt="button_icon"
        />
        <div>
          {translator(
            FOOTER_BUTTON_CONTEXT.TOGGLE_GRID,
            lang,
            TRANSLATION_COLLECTION.FOOTER_BUTTON
          )}
        </div>
      </div>
      <div
        onClick={autoCamera}
        title={translator(
          TOOLTIP_ICONS_CONTEXT.CENTER_VIEW,
          lang,
          TRANSLATION_COLLECTION.TOOLTIP_ICONS
        )}
      >
        <img src="./asset/aoe4/tracking.png" alt="button_icon" />
        <div>
          {translator(
            FOOTER_BUTTON_CONTEXT.CENTER_VIEW,
            lang,
            TRANSLATION_COLLECTION.FOOTER_BUTTON
          )}
        </div>
      </div>
      <div
        onClick={onHelpclick}
        title={translator(
          TOOLTIP_ICONS_CONTEXT.OPEN_HELP,
          lang,
          TRANSLATION_COLLECTION.TOOLTIP_ICONS
        )}
      >
        <img src="./asset/aoe4/unknown_mercenary.png" alt="button_icon" />
        <div>
          {translator(
            FOOTER_BUTTON_CONTEXT.OPEN_HELP,
            lang,
            TRANSLATION_COLLECTION.FOOTER_BUTTON
          )}
        </div>
      </div>
    </div>
  );
}
