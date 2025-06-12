import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
            navigate("/admin");
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Bienvenido Usuario",
            text: "Éxito: Bienvenido Usuario",
            confirmButtonText: "Continuar",
          }).then(() => {
            navigate("/usuario");
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
    <div
      style={{
        maxWidth: 400,
        margin: "100px auto",
        textAlign: "center",
      }}
    >
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
    </div>
  );
}

export default Login;