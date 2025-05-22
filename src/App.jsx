// libs
import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext.jsx";
// constants
// utils
// components
import RootWrapper from "./RootWrapper.jsx";
import Home from "./Home/Home.jsx";
import Error from "./Home/Error.jsx";
import NikkiKiwi from "./NikkiWiki/NikkiKiwi.jsx";
import Sketcher from "./Sketcher/Sketcher.jsx";
import Steamster from "./Steamster/Steamster.jsx";
import GrainBrain from "./GrainBrain/GrainBrain.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import { ERROR_PAGE_TYPE } from "./utils/enums.js";

const App = () => {
  // to scroll back after navigating
  const [homeScrollY, homeSetScrollY] = useState(0);

  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RootWrapper />}>
            <Route
              path="/"
              element={
                <Home scrollY={homeScrollY} setScrollY={homeSetScrollY} />
              }
            />
            <Route path="/nikki/*" element={<NikkiKiwi />} />
            <Route path="/sketcher/*" element={<Sketcher />} />
            <Route path="/steamster/*" element={<Steamster />} />
            <Route path="/granary/*" element={<GrainBrain />} />
            <Route
              path="/mobile"
              element={<Error pageType={ERROR_PAGE_TYPE.MOBILE} />}
            />
            <Route
              path="/*"
              element={<Error pageType={ERROR_PAGE_TYPE.NOT_FOUND} />}
            />
          </Route>
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
