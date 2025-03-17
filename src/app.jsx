// libs
import React, { createContext, StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
// components
import { GlobalProvider, useGlobal } from "./context/GlobalContext.jsx";
import Dashboard from "./Dashboard/dashboard";
import NikkiKiwi from "./NikkiWiki/NikkiKiwi";
// constants
// utils

const App = () => {
  return (
    <GlobalProvider>
      <Router>
        {/* <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav> */}
        <Routes>
          <Route path="/nikki/*" element={<NikkiKiwi />} />
          <Route path="/*" element={<Dashboard />} />
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
