import React, { createContext, useContext, useState } from "react";

import { LANG } from "../utils/enums.js";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // TODO: set lang from user system
  const [lang, setLang] = useState(LANG.default);

  return (
    <GlobalContext.Provider value={{ lang, setLang }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
