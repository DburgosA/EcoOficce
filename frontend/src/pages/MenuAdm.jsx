import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./../css/menu.css";
import Dashboard from "./menu/Dashboard.jsx";
import Historial from "./menu/Historial.jsx";
import Alertas from "./menu/Alertas.jsx";
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

      localStorage.removeItem("token"); // Elimina el token siempre

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "Has cerrado sesión con éxito.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        navigate("/"); // Redirige al login inmediatamente
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error al cerrar sesión",
          text: errorData.message || "Algo salió mal.",
        }).then(() => {
          navigate("/"); // Redirige al login aunque haya error
        });
      }
    } catch (error) {
      localStorage.removeItem("token");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cerrar sesión. Por favor, inténtalo de nuevo.",
      }).then(() => {
        navigate("/"); // Redirige al login aunque haya error
      });
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">EcoOficce</div>
        <ul className="navbar-links">
          <li>
            <Link to="/menu/dashboard" className="navbar-link">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/menu/historial" className="navbar-link">
              Historial
            </Link>
          </li>
          <li>
            <Link to="/menu/alertas" className="navbar-link">
              Alertas
            </Link>
          </li>
          <li>
            <Link to="/menu/dispositivos" className="navbar-link">
              Gestión de Dispositivos
            </Link>
          </li>
          <li>
            <Link to="/menu/exportacion" className="navbar-link">
              Exportación
            </Link>
          </li>
          <li>
            <Link to="/menu/analisis" className="navbar-link">
              Análisis
            </Link>
          </li>
          <li>
            <Link to="/menu/perfil" className="navbar-link">
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
