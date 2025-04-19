import React, { createContext, useContext, useState } from "react";

import { LANG } from "../utils/enums.js";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // TODO: set lang from user system
  const [lang, setLang] = useState(LANG.default);

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
