import React, { createContext, useContext, useState } from "react";

import { mapNavigatorLang } from "../utils/functions.js";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [lang, setLang] = useState(mapNavigatorLang());

  const nextLanguage = () => {
    // TODO: to be rewrite later
    setLang(1 - lang);
  };

  return (
    <GlobalContext.Provider value={{ lang, setLang, nextLanguage }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
