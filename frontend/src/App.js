import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import MenuAdm from "./pages/adm/MenuAdm";
import MenuUser from "./pages/user/MenuUser";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/*" element={<MenuAdm />} />
        <Route path="/usuario/*" element={<MenuUser />} />
      </Routes>
    </Router>
  );
}

export default App;
