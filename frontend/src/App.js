import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Historial from "./pages/Historial";
import Alertas from "./pages/Alertas";
import IntegracionIoT from "./pages/IntegracionIoT";
import GestionDispositivos from "./pages/GestionDispositivos";
import Exportacion from "./pages/Exportacion";
import Analisis from "./pages/Analisis";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Perfil from "./pages/Perfil";

import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <div className="navbar-brand">EcoOficce</div>
          <ul className="navbar-links">
            <li><Link to="/dashboard" className="navbar-link">Dashboard</Link></li>
            <li><Link to="/historial" className="navbar-link">Historial</Link></li>
            <li><Link to="/alertas" className="navbar-link">Alertas</Link></li>
            <li><Link to="/iot" className="navbar-link">Integración IoT</Link></li>
            <li><Link to="/dispositivos" className="navbar-link">Gestión de Dispositivos</Link></li>
            <li><Link to="/exportacion" className="navbar-link">Exportación</Link></li>
            <li><Link to="/analisis" className="navbar-link">Análisis</Link></li>
          </ul>
          <div className="auth-links">
            <Link to="/perfil" className="navbar-link">Perfil</Link>|
            <Link to="/login" className="navbar-link">Inicio de Sesión</Link>
            <Link to="/signup" className="navbar-link">Registro</Link>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="/iot" element={<IntegracionIoT />} />
            <Route path="/dispositivos" element={<GestionDispositivos />} />
            <Route path="/exportacion" element={<Exportacion />} />
            <Route path="/analisis" element={<Analisis />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
