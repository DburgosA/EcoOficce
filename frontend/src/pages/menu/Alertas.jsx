import React, { useState } from "react";
import "../../css/page.css";

// Tipos únicos de dispositivos
const tipoDispositivosUnicos = [
  "zona_oficina",
  "multifuncional",
  "impresora",
  "router",
  "servidor",
  "purificador_aire",
  "calefactor",
  "dispensador_agua",
];

// Rango estimado de consumo por tipo
const rangosEstimados = {
  zona_oficina: [20, 250],
  multifuncional: [150, 1850],
  impresora: [5, 45],
  router: [7, 7],
  servidor: [100, 270],
  purificador_aire: [20, 110],
  calefactor: [0, 1550],
  dispensador_agua: [80, 420],
};

function Alertas() {
  const [consumosMaximos, setConsumosMaximos] = useState({});
  const [usuarios, setUsuarios] = useState([
    { id: "U001", nombre: "alberto Parra", correo: "alparra@example.com", recibir: true },
    { id: "U002", nombre: "Ana Silva", correo: "ana@example.com", recibir: true },
  ]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");

  const actualizarConsumo = (tipo, valor) => {
    setConsumosMaximos((prev) => ({
      ...prev,
      [tipo]: Number(valor),
    }));
  };

  const toggleRecibir = (index) => {
    const nuevos = [...usuarios];
    nuevos[index].recibir = !nuevos[index].recibir;
    setUsuarios(nuevos);
  };

  const eliminarUsuario = (index) => {
    const nuevos = [...usuarios];
    nuevos.splice(index, 1);
    setUsuarios(nuevos);
  };

  const agregarUsuario = () => {
    if (!nuevoNombre || !nuevoCorreo) return alert("Faltan campos");
    const nuevoId = `U${String(usuarios.length + 1).padStart(3, "0")}`;
    setUsuarios([
      ...usuarios,
      {
        id: nuevoId,
        nombre: nuevoNombre,
        correo: nuevoCorreo,
        recibir: true,
      },
    ]);
    setNuevoNombre("");
    setNuevoCorreo("");
  };

  return (
    <div className="page-content">
      <h2>Alertas</h2>
      <p>Configura alertas por consumo anómalo o fuera de horario.</p>

      {/* Sección: Consumo máximo */}
      <h3>Consumo Máximo por Tipo de Dispositivo (Watts)</h3>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Tipo de Dispositivo</th>
            <th>Consumo Máximo</th>
            <th>Consumo Actual</th>
            <th>Consumo Estimado</th>
          </tr>
        </thead>
        <tbody>
          {tipoDispositivosUnicos.map((tipo, i) => (
            <tr key={i}>
              <td>{tipo.replaceAll("_", " ")}</td>
              <td>
                <input
                  type="number"
                  value={consumosMaximos[tipo] || ""}
                  onChange={(e) => actualizarConsumo(tipo, e.target.value)}
                  style={{ width: "80px", padding: "5px" }}
                />
              </td>
              <td>
                <em style={{ color: "#888" }}>(conectar backend)</em>
              </td>
              <td>
                {rangosEstimados[tipo][0]}W - {rangosEstimados[tipo][1]}W
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sección: Usuarios que reciben alertas */}
      <h3 style={{ marginTop: "2rem" }}>Usuarios que reciben alertas</h3>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Recibir</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u, i) => (
            <tr key={i}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>
                <input
                  type="checkbox"
                  checked={u.recibir}
                  onChange={() => toggleRecibir(i)}
                />
              </td>
              <td>
                <button className="action-button" onClick={() => eliminarUsuario(i)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Agregar nuevo usuario */}
      <h4 style={{ marginTop: "1.5rem" }}>Agregar nuevo usuario</h4>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo"
          value={nuevoCorreo}
          onChange={(e) => setNuevoCorreo(e.target.value)}
        />
        <button className="action-button" onClick={agregarUsuario}>
          Agregar
        </button>
      </div>

      {/* Estilos */}
      <style>{`
        input[type="text"], input[type="email"], input[type="number"] {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .action-button {
          background-color: #d32f2f;
          border: none;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: background-color 0.2s ease;
        }

        .action-button:hover {
          background-color: #b71c1c;
        }

        .dashboard-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          border-radius: 8px;
          overflow: hidden;
        }

        .dashboard-table th, .dashboard-table td {
          padding: 0.75rem 1rem;
          text-align: center;
        }

        .dashboard-table th {
          background: #1976d2;
          color: #fff;
          font-weight: 600;
        }

        .dashboard-table tr:nth-child(even) {
          background: #f4f8fb;
        }

        .dashboard-table tr:hover {
          background: #e3f2fd;
        }
      `}</style>
    </div>
  );
}

export default Alertas;
