import React, { useEffect, useRef } from "react";
import { translator } from "../translation/translator";
import { useGlobal } from "../../context/GlobalContext";
import { TOOLBOX_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";

export default function Tools({
  keyEventCallback,
  imgUrl,
  setImgUrl,
  setImgSize,
  imgZoom,
  setImgZoom,
  cursorColor,
  setCursorColor,
  showCursor,
  setShowCursor,
}) {
  const { lang } = useGlobal();
  const importImageRef = useRef(null);

  const onAddImage = () => {
    setImgUrl(importImageRef.current.value || null);
  };
  const onUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImgUrl(objectURL);
    }
  };
  const onClearImage = () => {
    setImgSize({ width: 0, height: 0 });
    setImgUrl(null);
  };

  const onImageZoom = (e) => {
    // used by both range input & number input
    setImgZoom(e.target.value);
  };

  const onCursorColorChange = (e) => {
    setCursorColor(e.target.value);
  };
  const onShowCursorChange = () => {
    setShowCursor(!showCursor);
  };

  useEffect(() => {
    keyEventCallback.current["c"] = onShowCursorChange;
    return () => {
      delete keyEventCallback.current["c"];
    };
  }, [showCursor]);

  return (
    <div className="sketcher-tools">
      <div>
        <b>-</b>&nbsp;
        <b>
          {translator(
            TOOLBOX_CONTEXT.TITLE,
            lang,
            TRANSLATE_COLLECTION.TOOLBOX
          )}
        </b>
      </div>
      <div>
        {imgUrl ? (
          <>
            <div className="sketcher-tools-imgLink">{imgUrl}</div>
            <button onClick={onClearImage}>
              {translator(
                TOOLBOX_CONTEXT.BUTTON_CLEAR_IMAGE,
                lang,
                TRANSLATE_COLLECTION.TOOLBOX
              )}
            </button>
          </>
        ) : (
          <>
            {translator(
              TOOLBOX_CONTEXT.LABEL_ADD_IMAGE,
              lang,
              TRANSLATE_COLLECTION.TOOLBOX
            )}
            <br />
            <input ref={importImageRef} placeholder="Image URL here:" />
            <br />
            <button>
              <label className="sketcher-tools-file-picker">
                {translator(
                  TOOLBOX_CONTEXT.LABEL_CHOOSE_FILE,
                  lang,
                  TRANSLATE_COLLECTION.TOOLBOX
                )}
                <input type="file" accept="image/*" onChange={onUploadImage} />
              </label>
            </button>
            <button onClick={onAddImage}>
              {translator(
                TOOLBOX_CONTEXT.BUTTON_USE_LINK,
                lang,
                TRANSLATE_COLLECTION.TOOLBOX
              )}
            </button>
          </>
        )}
      </div>
      <div>
        {translator(
          TOOLBOX_CONTEXT.LABEL_ZOOM_IMAGE,
          lang,
          TRANSLATE_COLLECTION.TOOLBOX
        )}
        :&nbsp;
        <input
          type="number"
          min="10"
          step="10"
          value={imgZoom}
          onChange={onImageZoom}
        />
        %
        <br />
        <input
          type="range"
          max="300"
          min="10"
          value={imgZoom}
          onChange={onImageZoom}
        />
      </div>
      <div>
        <label>
          [C]&nbsp;
          {translator(
            TOOLBOX_CONTEXT.LABEL_SHOW_CURSOR,
            lang,
            TRANSLATE_COLLECTION.TOOLBOX
          )}
          <input
            type="checkbox"
            checked={showCursor}
            onChange={onShowCursorChange}
          />
        </label>
        <br />
        <label>
          {translator(
            TOOLBOX_CONTEXT.LABEL_CURSOR_COLOR,
            lang,
            TRANSLATE_COLLECTION.TOOLBOX
          )}
          :&nbsp;
          <input
            type="color"
            value={cursorColor}
            onChange={onCursorColorChange}
          />
        </label>
      </div>
    </div>
  );
}
