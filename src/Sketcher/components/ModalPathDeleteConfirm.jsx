import React from "react";
import { translator } from "../translation/translator";
import { useGlobal } from "../../context/GlobalContext";
import { MODAL_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";

export default function ModalPathDeleteConfirm({
  setModalComponent,
  onConfirm,
}) {
  const { lang } = useGlobal();

  return (
    <div className="sketcher-model-content untouchable">
      <h2>
        {translator(
          MODAL_CONTEXT.TITLE_DELETE_PATH,
          lang,
          TRANSLATE_COLLECTION.MODAL
        )}
      </h2>
      <div>
        {translator(
          MODAL_CONTEXT.CONTENT_DELETE_PATH,
          lang,
          TRANSLATE_COLLECTION.MODAL
        )}
      </div>
      <div className="sketcher-model-content-buttons">
        <button onClick={onConfirm}>
          {translator(
            MODAL_CONTEXT.BUTTON_COMFIRM,
            lang,
            TRANSLATE_COLLECTION.MODAL
          )}
          !
        </button>
        <button onClick={() => setModalComponent(null)}>
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
