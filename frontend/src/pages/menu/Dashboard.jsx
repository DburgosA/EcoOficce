import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/page.css";

function Dashboard() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/consumos");
        setDatos(res.data);
      } catch (err) {
        setDatos([]);
      }
      setLoading(false);
    };
    fetchDatos();
    const interval = setInterval(fetchDatos, 10000); // Actualiza cada 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-content">
      <h2>Dashboard</h2>
      <p>Gráficos en tiempo real del consumo actual por área/dispositivo.</p>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Dispositivo</th>
                <th>Fecha/Hora</th>
                <th>Consumo (W)</th>
                <th>Voltaje (V)</th>
                <th>Corriente (A)</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((item, idx) => (
                <tr
                  key={idx}
                  className={
                    item.status === "active"
                      ? "row-active"
                      : "row-inactive"
                  }
                >
                  <td>{item.device_id}</td>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                  <td>{item.power}</td>
                  <td>{item.voltage}</td>
                  <td>{item.current}</td>
                  <td>
                    <span
                      className={
                        item.status === "active"
                          ? "status-dot active"
                          : "status-dot inactive"
                      }
                    ></span>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
      `}</style>
    </div>
  );
}

export default Dashboard;
