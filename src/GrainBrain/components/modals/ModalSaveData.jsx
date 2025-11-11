import React, { useEffect, useRef, useState } from "react";

import { useGlobal } from "../../../context/GlobalContext";

import { BUILDING } from "../../utils/aoe4/enum";
import { SAVE_MODAL_MODE } from "../../utils/enum";
import { LOCALSTORAGE, STORE } from "../../../utils/localStorage";

import { translator } from "../../utils/translation/translator";
import {
  APP_MISC_CONTEXT,
  MODAL_CONTEXT,
  TRANSLATION_COLLECTION,
} from "../../utils/translation/context";

export default function ModalSaveData({
  mode,
  setModalComponent,
  onConfirm,
  onCancel,
}) {
  const { lang } = useGlobal();

  const saveNameInputRef = useRef(null);

  const [saveInStorage, setSaveInstorage] = useState([]);
  const [selectedItem, setSelectedItem] = useState(-1);
  const [deletingItem, setDeletingItem] = useState(-1);

  useEffect(() => {
    let savePack = LOCALSTORAGE[STORE.GRAIN_BRAIN].getSaveList() || {};
    setSaveInstorage(
      Object.keys(savePack).map((name) => {
        let atlas = savePack[name],
          farmCount = Object.values(atlas).reduce(
            (acc, { kind }) => acc + +(kind === BUILDING.FARM),
            0
          );
        return { name, farmCount };
      })
    );
  }, []);

  const onItemClick = (i) => {
    if (mode !== SAVE_MODAL_MODE.LOAD) return;
    setSelectedItem(i);
    setDeletingItem(-1);
  };
  const onDeleteClick = (e, i) => {
    e.stopPropagation();
    setDeletingItem(i);
    setSelectedItem(-1);
  };
  const onConfirmDelete = () => {
    let temp = saveInStorage.slice();
    temp.splice(deletingItem, 1);
    LOCALSTORAGE[STORE.GRAIN_BRAIN].deleteSave(
      saveInStorage[deletingItem].name
    );
    setSaveInstorage(temp);
    setDeletingItem(-1);
    setSelectedItem(-1);
  };
  const onCancelDelete = (e) => {
    e.stopPropagation();
    setDeletingItem(-1);
  };

  const onConfirmClick = () => {
    if (onConfirm)
      switch (mode) {
        case SAVE_MODAL_MODE.SAVE:
          onConfirm(saveNameInputRef.current.value?.trim());
          break;
        case SAVE_MODAL_MODE.LOAD:
          onConfirm(saveInStorage[selectedItem].name);
          break;
      }
    setModalComponent(null);
  };

  const onCancelClick = () => {
    if (onCancel) onCancel();
    setModalComponent(null);
  };

  return (
    <div className="grainbrain-modal-content untouchable">
      {mode === SAVE_MODAL_MODE.SAVE && (
        <>
          <h2>
            {translator(
              MODAL_CONTEXT.MODAL_TITLE_SAVE,
              lang,
              TRANSLATION_COLLECTION.MODAL
            )}
          </h2>
          <div>
            {translator(
              MODAL_CONTEXT.MODAL_BODY_SAVE_WARNING,
              lang,
              TRANSLATION_COLLECTION.MODAL
            )}
          </div>
        </>
      )}
      {mode === SAVE_MODAL_MODE.LOAD && (
        <>
          <h2>
            {translator(
              MODAL_CONTEXT.MODAL_TITLE_LOAD,
              lang,
              TRANSLATION_COLLECTION.MODAL
            )}
          </h2>
          <div>
            {translator(
              MODAL_CONTEXT.MODAL_BODY_LOAD_WARNING,
              lang,
              TRANSLATION_COLLECTION.MODAL
            )}
          </div>
        </>
      )}
      <div>
        {translator(
          MODAL_CONTEXT.MODAL_BODY_SAVE_LOCAL_WARNING,
          lang,
          TRANSLATION_COLLECTION.MODAL
        )}
      </div>
      {mode === SAVE_MODAL_MODE.SAVE && (
        <input
          ref={saveNameInputRef}
          type="text"
          placeholder={translator(
            MODAL_CONTEXT.MODAL_BODY_SAVE_NAME_PLACEHOLDER,
            lang,
            TRANSLATION_COLLECTION.MODAL
          )}
        />
      )}
      <div className="grainbrain-modal-savelist">
        {saveInStorage.length ? (
          saveInStorage.map(({ name, farmCount }, i) => (
            <div
              className={
                "grainbrain-modal-savelist-save" +
                (selectedItem === i
                  ? " grainbrain-modal-savelist-save-selected"
                  : "")
              }
              onClick={() => onItemClick(i)}
              key={i}
            >
              <span className="grainbrain-modal-savelist-save-name">
                {name}
              </span>
              <span>{farmCount}</span>
              <img src="./asset/aoe4/farm.png" alt="farm_icon" />
              <span className="grainbrain-modal-savelist-save-delete">
                {deletingItem === i ? (
                  <>
                    <img
                      src="./asset/aoe4/delete.png"
                      onClick={onConfirmDelete}
                      alt="delete_icon"
                    />
                    <img
                      src="./asset/aoe4/cancel.png"
                      onClick={onCancelDelete}
                      alt="cancel_icon"
                    />
                  </>
                ) : (
                  <img
                    src="./asset/aoe4/delete.png"
                    onClick={(e) => onDeleteClick(e, i)}
                    alt="delete_icon"
                  />
                )}
              </span>
            </div>
          ))
        ) : (
          <div className="grainbrain-modal-savelist-empty">
            {translator(
              MODAL_CONTEXT.MODAL_BODY_SAVE_LIST_PLACEHOLDER,
              lang,
              TRANSLATION_COLLECTION.MODAL
            )}
          </div>
        )}
      </div>
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
