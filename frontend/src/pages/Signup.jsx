import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [correo, setCorreo] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!usuario || !clave || !correo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Todos los campos son requeridos.",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: usuario,
          contraseña: clave,
          correo,
          rol: "admin",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: data.message,
          confirmButtonText: "Iniciar sesión",
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Error al registrar usuario",
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
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h2>Registro</h2>
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>
        <button
          type="submit"
          style={{ padding: "10px 20px", width: "100%" }}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Signup;