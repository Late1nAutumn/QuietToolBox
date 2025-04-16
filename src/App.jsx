// libs
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// components
import { GlobalProvider } from "./context/GlobalContext.jsx";
import Home from "./Home/Home.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import NikkiKiwi from "./NikkiWiki/NikkiKiwi.jsx";
import Sketcher from "./Sketcher/Sketcher.jsx";
import Steamster from "./Steamster/Steamster.jsx";
// constants
// utils

const App = () => {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path="/nikki/*" element={<NikkiKiwi />} />
          <Route path="/sketcher/*" element={<Sketcher />} />
          <Route path="/steamster/*" element={<Steamster />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
