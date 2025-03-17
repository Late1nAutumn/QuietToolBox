import React from "react";
import { Route, Routes } from "react-router-dom";

import ItemTable from "./components/ItemTable.jsx";
import Footer from "./components/Footer.jsx";

import { TABLE_MODE } from "./model/enums.js";

export default function NikkiKiwi() {
  // useEffect(() => {});

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
      <div className="nikkikiwi-whiteSpace"/>
      <Footer />
    </div>
  );
}
