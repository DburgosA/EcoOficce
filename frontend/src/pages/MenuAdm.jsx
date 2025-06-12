import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Dashboard from "./menu/Dashboard.jsx";
import Historial from "./menu/Historial.jsx";
import Alertas from "./menu/Alertas.jsx";
import IntegracionIoT from "./menu/IntegracionIoT.jsx";
import GestionDispositivos from "./menu/GestionDispositivos.jsx";
import Exportacion from "./menu/Exportacion.jsx";
import Analisis from "./menu/Analisis.jsx";
import Perfil from "./Perfil.jsx";

const MenuAdm = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "Has cerrado sesión con éxito.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error al cerrar sesión",
          text: errorData.message || "Algo salió mal.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cerrar sesión. Por favor, inténtalo de nuevo.",
      });
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">EcoOficce Admin</div>
        <ul className="navbar-links">
          <li>
            <Link to="/admin/dashboard" className="navbar-link">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/historial" className="navbar-link">
              Historial
            </Link>
          </li>
          <li>
            <Link to="/admin/alertas" className="navbar-link">
              Alertas
            </Link>
          </li>
          <li>
            <Link to="/admin/iot" className="navbar-link">
              Integración IoT
            </Link>
          </li>
          <li>
            <Link to="/admin/dispositivos" className="navbar-link">
              Gestión de Dispositivos
            </Link>
          </li>
          <li>
            <Link to="/admin/exportacion" className="navbar-link">
              Exportación
            </Link>
          </li>
          <li>
            <Link to="/admin/analisis" className="navbar-link">
              Análisis
            </Link>
          </li>
          <li>
            <Link to="/admin/perfil" className="navbar-link">
              Perfil
            </Link>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          style={{ marginLeft: 16, padding: "8px 16px" }}
        >
          Cerrar sesión
        </button>
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
          <Route path="perfil" element={<Perfil />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default MenuAdm;
