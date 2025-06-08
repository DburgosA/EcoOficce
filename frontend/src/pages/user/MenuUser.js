import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "../Dashboard";
import Historial from "../Historial";
import Alertas from "../Alertas";
import Analisis from "../Analisis";
import Perfil from "../Perfil";

const MenuUser = () => (
  <div>
    <nav className="navbar">
      <div className="navbar-brand">EcoOficce Usuario</div>
      <ul className="navbar-links">
        <li><Link to="/usuario/dashboard" className="navbar-link">Dashboard</Link></li>
        <li><Link to="/usuario/historial" className="navbar-link">Historial</Link></li>
        <li><Link to="/usuario/alertas" className="navbar-link">Alertas</Link></li>
        <li><Link to="/usuario/analisis" className="navbar-link">Análisis</Link></li>
        <li><Link to="/usuario/perfil" className="navbar-link">Perfil</Link></li>
      </ul>
    </nav>
    <div className="container">
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="historial" element={<Historial />} />
        <Route path="alertas" element={<Alertas />} />
        <Route path="analisis" element={<Analisis />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </div>
  </div>
);

export default MenuUser;
