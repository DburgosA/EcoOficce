import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "../Dashboard";
import Historial from "../Historial";
import Alertas from "../Alertas";
import IntegracionIoT from "./IntegracionIoT";
import GestionDispositivos from "./GestionDispositivos";
import Exportacion from "./Exportacion";
import Analisis from "../Analisis";
import Perfil from "../Perfil";
import AdminUsuarios from "./AdminUsuarios"; 

const MenuAdm = () => (
  <div>
    <nav className="navbar">
      <div className="navbar-brand">EcoOficce Admin</div>
      <ul className="navbar-links">
        <li><Link to="/admin/dashboard" className="navbar-link">Dashboard</Link></li>
        <li><Link to="/admin/historial" className="navbar-link">Historial</Link></li>
        <li><Link to="/admin/alertas" className="navbar-link">Alertas</Link></li>
        <li><Link to="/admin/iot" className="navbar-link">Integración IoT</Link></li>
        <li><Link to="/admin/dispositivos" className="navbar-link">Gestión de Dispositivos</Link></li>
        <li><Link to="/admin/exportacion" className="navbar-link">Exportación</Link></li>
        <li><Link to="/admin/analisis" className="navbar-link">Análisis</Link></li>
        <li><Link to="/admin/admin-usuarios" className="navbar-link">Administrar Usuarios</Link></li>
        <li><Link to="/admin/perfil" className="navbar-link">Perfil</Link></li>
      </ul>
    </nav>
    <div className="container">
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="historial" element={<Historial />} />
        <Route path="alertas" element={<Alertas />} />
        <Route path="iot" element={<IntegracionIoT />} />
        <Route path="dispositivos" element={<GestionDispositivos />} />
        <Route path="exportacion" element={<Exportacion />} />
        <Route path="analisis" element={<Analisis />} />
        <Route path="admin-usuarios" element={<AdminUsuarios />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </div>
  </div>
);

export default MenuAdm;
