import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usuario === "admin") {
      navigate("/admin");
    } else {
      navigate("/usuario");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
}

export default Login;
