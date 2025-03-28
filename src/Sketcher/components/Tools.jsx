import React, { useEffect, useRef } from "react";

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
        <b>-</b>&nbsp;<b>Tools</b>
      </div>
      <div>
        {imgUrl ? (
          <>
            <div className="sketcher-tools-imgLink">{imgUrl}</div>
            <button onClick={onClearImage}>Clear Image</button>
          </>
        ) : (
          <>
            Add Image:
            <br />
            <input ref={importImageRef} placeholder="Image URL here:" />
            <br />
            <button>
              <label className="sketcher-tools-file-picker">
                Choose file
                <input type="file" accept="image/*" onChange={onUploadImage} />
              </label>
            </button>
            <button onClick={onAddImage}>Use link</button>
          </>
        )}
      </div>
      <div>
        Image zoom:&nbsp;
        <input
          type="number"
          min="10"
          step="10"
          value={imgZoom}
          onChange={onImageZoom}
        />
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
          [C] Show cursor
          <input
            type="checkbox"
            checked={showCursor}
            onChange={onShowCursorChange}
          />
        </label>
        <br />
        <label>
          Cursor Color:&nbsp;
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
