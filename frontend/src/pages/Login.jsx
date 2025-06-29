import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/auth.css";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (!usuario || !clave) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, ingresa tu usuario y contraseña.",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre_usuario: usuario, contraseña: clave }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        if (data.rol === "adm" || data.rol === "admin") {
          Swal.fire({
            icon: "success",
            title: "Bienvenido Administrador",
            text: "Éxito: Bienvenido Administrador",
            confirmButtonText: "Continuar",
          }).then(() => {
            navigate("/menu");
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Bienvenido Usuario",
            text: "Éxito: Bienvenido Usuario",
            confirmButtonText: "Continuar",
          }).then(() => {
            navigate("/menu");
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Error al iniciar sesión",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema con la conexión.",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={login}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Ingresar usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            placeholder="Ingresar clave"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        <button
          type="submit"
          style={{ padding: "10px 20px", width: "100%" }}
        >
          Iniciar sesión
        </button>
      </form>
      <button
        style={{ marginTop: 16, padding: "10px 20px", width: "100%" }}
        type="button"
        onClick={() => navigate("/signup")}
      >
        Registrarse
      </button>
      <div style={{ marginTop: 24, color: "#b71c1c", fontWeight: "bold", fontSize: "1rem" }}>
        ¡Advertencia!<br />
        Como el backend no está desplegado, las funciones de inicio de sesión pueden no funcionar si no se inicia correctamente <code>app.py</code>.<br />
        <span style={{ color: "#2e7d32", textDecoration: "underline", cursor: "pointer" }}
          onClick={() => navigate("/menu")}
        >
          Ir al menú (sin iniciar sesión)
        </span>
      </div>
    </div>
  );
}

export default Login;