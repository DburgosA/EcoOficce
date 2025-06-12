import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import MenuAdm from "./pages/MenuAdm.jsx";
import Signup from "./pages/Signup.jsx";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/*" element={<MenuAdm />} />
      </Routes>
    </Router>
  );
}

export default App;
