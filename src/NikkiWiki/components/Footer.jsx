import React from "react";
import { useGlobal } from "../../context/GlobalContext";
import { translator } from "../translation/translator";
import { TRANSLATE_COLLECTION } from "../translation/context";

export default function Footer() {
  const { lang } = useGlobal();

  const text = (context) =>
    translator(context, lang, TRANSLATE_COLLECTION.APP_FOOTER);

  return (
    <footer className="nikkikiwi-footer">
      <div className="nikkikiwi-footer-content">
        <h3>{text(0)}</h3>
        <ul>
          <li>
            {text(1)}
            <a href={text(2)} target="_blank">
              {text(2)}
            </a>
          </li>
          <li>{text(3)}</li>
          <li>{text(4)}</li>
          <li>{text(5)}</li>
          <li>
            {text(6)}
            <a href={text(7)} target="_blank">
              {text(7)}
            </a>
            {text(8)}
          </li>
        </ul>
      </div>
    </footer>
  );
}
