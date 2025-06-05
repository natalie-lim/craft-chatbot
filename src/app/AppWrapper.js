import React from "react";
import { Routes, Route } from "react-router-dom";
import Page from "./page.js";
import Welcome from "./welcome/page.js";

function AppWrapper() {
  return (
    <Routes>
      <Route path="/" element={<Page />} />
      <Route path="/welcome" element={<Welcome />} />
      
    </Routes>
  );
}

export default AppWrapper;