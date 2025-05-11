import React from "react";

import { useGlobal } from "../../../context/GlobalContext";

import { translator } from "../../utils/translation/translator";
import {
  APP_MISC_CONTEXT,
  MODAL_CONTEXT,
  TRANSLATION_COLLECTION,
} from "../../utils/translation/context";

export default function ModalWipePattern({
  setModalComponent,
  onConfirm,
  onCancel,
}) {
  const { lang } = useGlobal();

  const onConfirmClick = () => {
    if (onConfirm) onConfirm();
    setModalComponent(null);
  };

  const onCancelClick = () => {
    if (onCancel) onCancel();
    setModalComponent(null);
  };

  return (
    <div className="grainbrain-modal-content untouchable">
      <h2>
        {translator(
          MODAL_CONTEXT.MODAL_TITLE_WIPE,
          lang,
          TRANSLATION_COLLECTION.MODAL
        )}
      </h2>
      <div>
        {translator(
          MODAL_CONTEXT.MODAL_BODY_WIPE,
          lang,
          TRANSLATION_COLLECTION.MODAL
        )}</div>
      <div className="grainbrain-modal-content-buttons">
        <button
          className="grainbrain-modal-confirm-button"
          onClick={onConfirmClick}
        >
          {translator(
            APP_MISC_CONTEXT.BUTTON_CONFIRM,
            lang,
            TRANSLATION_COLLECTION.APP_MISC
          )}
        </button>
        <button onClick={onCancelClick}>
          {translator(
            APP_MISC_CONTEXT.BUTTON_CANCEL,
            lang,
            TRANSLATION_COLLECTION.APP_MISC
          )}
        </button>
      </div>
    </div>
  );
}
