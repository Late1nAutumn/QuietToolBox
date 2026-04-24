import React, { useEffect, useRef, useState } from "react";
import { rgbtoHexText, textToRGB } from "../util";
import { translator } from "../translation/translator";
import { ROSTER_CONTEXT, TRANSLATE_COLLECTION } from "../translation/context";
import { useGlobal } from "../../context/GlobalContext";
import { EyeSlash } from "../../components/svg/EyeSlash";
import { Eye } from "../../components/svg/Eye";

export default function Roster({ displayedColors, setDisplayedColors }) {
  const { lang } = useGlobal();
  const inputRef = useRef(null);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    window.addEventListener("keypress", onEnterPress);
    return () => {
      window.removeEventListener("keypress", onEnterPress);
    };
  }, []);

  function onEnterPress(e) {
    if (e.key === "Enter") {
      onColorAdd();
    }
  }

  function onColorAdd() {
    let r, g, b;
    try {
      let rgb = textToRGB(inputRef.current.value);
      if (!rgb) throw new Error();
      [r, g, b] = rgb;
    } catch {
      setShowError(true);
      return;
    }
    setShowError(false);
    for (let color of displayedColors)
      if (color.r === r && color.g === g && color.b === b) return;

    let newList = displayedColors.slice();
    newList.push({ visible: true, r, g, b });
    setDisplayedColors(newList);

    inputRef.current.value = "";
  }
  function onColorDelete(i) {
    let newList = displayedColors.slice();
    newList.splice(i, 1);
    setDisplayedColors(newList);
  }
  function onColorToggleVisible(i) {
    let newList = displayedColors.slice();
    newList[i].visible = !newList[i].visible;
    setDisplayedColors(newList);
  }

  return (
    <div className="colorblinder-roster">
      <div className="colorblinder-roster-header">
        {translator(ROSTER_CONTEXT.TITLE, lang, TRANSLATE_COLLECTION.ROSTER)}
      </div>
      <div className="colorblinder-roster-adder">
        <input
          ref={inputRef}
          type="text"
          placeholder="#FF6600 / rgb(255,102,0)"
        />
        <button onClick={onColorAdd}>
          +&nbsp;
          {translator(
            ROSTER_CONTEXT.BUTTON_ADD,
            lang,
            TRANSLATE_COLLECTION.ROSTER,
          )}
        </button>
      </div>
      <div className="colorblinder-roster-error">
        {showError &&
          translator(
            ROSTER_CONTEXT.ERROR_INVALID_COLOR,
            lang,
            TRANSLATE_COLLECTION.ROSTER,
          )}
      </div>
      <div className="colorblinder-roster-list-wrapper">
        <div className="colorblinder-roster-list">
          {displayedColors.length === 0 ? (
            <div className="colorblinder-roster-list-placeholder">
              {translator(
                ROSTER_CONTEXT.LIST_EMPTY,
                lang,
                TRANSLATE_COLLECTION.ROSTER,
              )}
            </div>
          ) : (
            displayedColors.map(({ visible, r, g, b }, i) => {
              let hex = rgbtoHexText(r * 255, g * 255, b * 255);
              return (
                <div className="colorblinder-roster-item" key={i}>
                  <div
                    className="colorblinder-roster-swatch"
                    style={{ background: hex }}
                  />
                  <div className="colorblinder-roster-value">{hex}</div>
                  <div onClick={() => onColorToggleVisible(i)}>
                    {visible ? <Eye /> : <EyeSlash />}
                  </div>
                  <button
                    className="colorblinder-roster-delete-color"
                    onClick={() => onColorDelete(i)}
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
