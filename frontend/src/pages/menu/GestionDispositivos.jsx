import React, { useState } from "react";

const tipos = [
  { cantidad: 10, tipo: "zona_oficina" },
  { cantidad: 4, tipo: "multifuncional" },
  { cantidad: 8, tipo: "impresora" },
  { cantidad: 3, tipo: "router" },
  { cantidad: 1, tipo: "servidor" },
  { cantidad: 2, tipo: "purificador_aire" },
  { cantidad: 2, tipo: "calefactor" },
  { cantidad: 2, tipo: "dispensador_agua" },
];

let contador = 1;
const DISPOSITIVOS = tipos.flatMap(({ cantidad, tipo }) =>
  Array.from({ length: cantidad }, () => ({
    device_id: `SEN03XE32-${String(contador++).padStart(2, "0")}`,
    tipo,
  }))
);

function GestionDispositivos() {
  const [dispositivos, setDispositivos] = useState(
    DISPOSITIVOS.map((d) => ({ ...d, activo: true }))
  );

  const cambiarTipo = (index, nuevoTipo) => {
    const nuevos = [...dispositivos];
    nuevos[index].tipo = nuevoTipo;
    setDispositivos(nuevos);
  };

  const apagarDispositivo = (index) => {
    const nuevos = [...dispositivos];
    nuevos[index].activo = !nuevos[index].activo;
    setDispositivos(nuevos);
  };

  const eliminarRegistros = (index) => {
    alert(`Registros de ${dispositivos[index].device_id} eliminados (simulado).`);
  };

  return (
    <div className="page-content">
      <h2>Gestión de Dispositivos</h2>
      <p>Alta, baja y configuración de dispositivos/sensores.</p>

      <style>{`
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
        .status-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 6px;
        }
        .status-dot.active {
          background: #43a047;
        }
        .status-dot.inactive {
          background: #e53935;
        }
        .row-active {
          font-weight: 500;
        }
        .row-inactive {
          color: #aaa;
        }
        .action-button {
          background-color: #1976d2;
          border: none;
          color: white;
          padding: 5px 10px;
          margin: 0 4px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: background-color 0.2s ease;
        }
        .action-button:hover {
          background-color: #1565c0;
        }
      `}</style>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Estado</th>
            <th>ID</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {dispositivos.map((d, index) => (
            <tr
              key={index}
              className={d.activo ? "row-active" : "row-inactive"}
            >
              <td>
                <span
                  className={`status-dot ${d.activo ? "active" : "inactive"}`}
                ></span>
                {d.activo ? "Activo" : "Apagado"}
              </td>
              <td>{d.device_id}</td>
              <td>{d.tipo}</td>
              <td>
                <button
                  className="action-button"
                  onClick={() => {
                    const nuevo = prompt("Nuevo tipo:", d.tipo);
                    if (nuevo) cambiarTipo(index, nuevo);
                  }}
                >
                  Cambiar Tipo
                </button>
                <button
                  className="action-button"
                  onClick={() => apagarDispositivo(index)}
                >
                  {d.activo ? "Apagar" : "Encender"}
                </button>
                <button
                  className="action-button"
                  onClick={() => eliminarRegistros(index)}
                >
                  Eliminar Registros
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionDispositivos;
