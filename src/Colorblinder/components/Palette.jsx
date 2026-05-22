import React, { useEffect, useRef, useState } from "react";
import { GL } from "../graphics";
import { rgbtoHexText, textToRGB } from "../util";
import { PALETTE_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";
import { translator } from "../translation/translator";
import { useGlobal } from "../../context/GlobalContext";
import { Edit } from "../../components/svg/Edit";

export default function Palette({
  paletteRef,
  colorMode,
  azimuth,
  innerRadius,
  altitude,
  updateSelection,
}) {
  const { lang } = useGlobal();
  const inputRef = useRef(null);

  const [markedColor, setMarkedColor] = useState([0, 0, 0]);
  const [showInput, setShowInput] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    window.addEventListener("keypress", onEnterPress);
    return () => {
      window.removeEventListener("keypress", onEnterPress);
    };
  }, []);

  useEffect(() => {
    setMarkedColor(
      GL.getRGBFromSelection({ colorMode, azimuth, innerRadius, altitude }).map(
        (v) => 255 * v,
      ),
    );
  }, [colorMode, azimuth, innerRadius, altitude]);

  const inputHandlerRef = useRef(() => {});
  useEffect(() => {
    inputHandlerRef.current = onInputColor;
  });
  function onEnterPress(e) {
    if (e.key === "Enter" && showInput) {
      inputHandlerRef.current();
    }
  }

  function onInputColor() {
    if (showInput) {
      try {
        let rgb = textToRGB(inputRef.current.value);
        if (!rgb) throw new Error();
        let params = GL.rgbToStates(...rgb, { colorMode });
        updateSelection(params);
      } catch {
        setShowError(true);
        return;
      }
    }
    setShowError(false);
    setShowInput(!showInput);
  }

  let hexColor = rgbtoHexText(...markedColor);

  return (
    <div className="colorblinder-palette">
      <h4>
        {translator(PALETTE_CONTEXT.TITLE, lang, TRANSLATE_COLLECTION.PALETTE)}
      </h4>
      <canvas ref={paletteRef} width="200" height="200" />

      {showInput ? (
        <div>
          <div className="colorblinder-palette-input">
            <input ref={inputRef} defaultValue={hexColor} />
            <div
              className="colorblinder-palette-edit-btn"
              onClick={onInputColor}
            >
              <Edit />
            </div>
          </div>
          <div className="colorblinder-palette-error">
            {showError &&
              translator(
                PALETTE_CONTEXT.ERROR_INVALID_COLOR,
                lang,
                TRANSLATE_COLLECTION.PALETTE,
              )}
          </div>
        </div>
      ) : (
        <div className="colorblinder-palette-info">
          <div
            className="colorblinder-palette-swatch"
            style={{ backgroundColor: hexColor }}
          />
          <div>
            <div>
              RGB:
              <span>{markedColor.map(Math.round).join(",")}</span>
            </div>
            <div>
              HEX:<span>{hexColor}</span>
            </div>
          </div>
          <div className="colorblinder-palette-edit-btn" onClick={onInputColor}>
            <Edit />
          </div>
        </div>
      )}
    </div>
  );
}
