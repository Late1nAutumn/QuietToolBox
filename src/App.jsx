// libs
import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// components
import { GlobalProvider } from "./context/GlobalContext.jsx";
import Home from "./Home/Home.jsx";
import NotFound from "./Home/NotFound.jsx";
import NikkiKiwi from "./NikkiWiki/NikkiKiwi.jsx";
import Sketcher from "./Sketcher/Sketcher.jsx";
import Steamster from "./Steamster/Steamster.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
// constants
// utils

const App = () => {
  // to scroll back after navigating
  const [homeScrollY, homeSetScrollY] = useState(0);

  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path="/nikki/*" element={<NikkiKiwi />} />
          <Route path="/sketcher/*" element={<Sketcher />} />
          <Route path="/steamster/*" element={<Steamster />} />
          <Route
            path="/"
            element={<Home scrollY={homeScrollY} setScrollY={homeSetScrollY} />}
          />
          <Route path="/*" element={<NotFound />} />
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
