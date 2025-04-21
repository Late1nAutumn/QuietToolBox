import React from "react";

import { translator } from "../translation/translator";
import { useGlobal } from "../../context/GlobalContext";
import { MODAL_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";

export default function ModalExitConfirm({
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
    <div className="sketcher-model-content untouchable">
      <h2>
        {translator(MODAL_CONTEXT.TITLE_EXIT, lang, TRANSLATE_COLLECTION.MODAL)}
      </h2>
      <div>
        {translator(
          MODAL_CONTEXT.CONTENT_EXIT,
          lang,
          TRANSLATE_COLLECTION.MODAL
        )}
      </div>
      <div className="sketcher-model-content-buttons">
        <button onClick={onConfirmClick}>
          {translator(
            MODAL_CONTEXT.BUTTON_COMFIRM,
            lang,
            TRANSLATE_COLLECTION.MODAL
          )}
          !
        </button>
        <button onClick={onCancelClick}>
          {translator(
            MODAL_CONTEXT.BUTTON_CANCEL,
            lang,
            TRANSLATE_COLLECTION.MODAL
          )}
        </button>
      </div>
    </div>
  );
}
