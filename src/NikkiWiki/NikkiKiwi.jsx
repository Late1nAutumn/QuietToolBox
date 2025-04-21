import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import ItemTable from "./components/ItemTable.jsx";
import Footer from "./components/Footer.jsx";

import { TABLE_MODE } from "./model/enums.js";
import { APP, APPS } from "../utils/constants.js";
import { setFavicon } from "../utils/functions.js";

export default function NikkiKiwi() {
  useEffect(() => {
    document.title = APPS[APP.NIKKI_KIWI].text;
    setFavicon(APPS[APP.NIKKI_KIWI].favicon);
  }, []);

  return (
    <div className="nikkikiwi">
      <Routes>
        <Route path="/set" element={<ItemTable tableMode={TABLE_MODE.SET} />} />
        <Route
          path="/spare"
          element={<ItemTable tableMode={TABLE_MODE.SPARE} />}
        />
        <Route path="/" element={<ItemTable tableMode={TABLE_MODE.RAW} />} />
      </Routes>
      <div className="nikkikiwi-whiteSpace" />
      <Footer />
    </div>
  );
}
