import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../../css/page.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const TABS = [
  { key: "dia", label: "Por día", endpoint: "/api/consumo-diario", labelChart: "Consumo total (kWh) por día" },
  { key: "semana", label: "Por semana", endpoint: "/api/consumo-semanal", labelChart: "Consumo total (kWh) por semana" },
  { key: "mes", label: "Por mes", endpoint: "/api/consumo-mensual", labelChart: "Consumo total (kWh) por mes" },
  { key: "hora", label: "Por hora", endpoint: "/api/consumo-horario", labelChart: "Consumo total (kWh) por hora" },
];

function Historial() {
  const [tab, setTab] = useState("dia");
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const selected = TABS.find((t) => t.key === tab);
        let res;
        if (tab === "hora") {
          if (!selectedDate) {
            setData({ labels: [], datasets: [] });
            setLoading(false);
            return;
          }
          res = await axios.get(`http://localhost:5000${selected.endpoint}?fecha=${selectedDate}`);
        } else {
          res = await axios.get(`http://localhost:5000${selected.endpoint}`);
        }
        const consumos = res.data;
        let labels = [];
        let valores = [];
        if (tab === "dia") {
          labels = consumos.map((item) => item.fecha);
          valores = consumos.map((item) => item.consumo_total);
        } else if (tab === "semana") {
          labels = consumos.map((item) => item.semana);
          valores = consumos.map((item) => item.consumo_total);
        } else if (tab === "mes") {
          labels = consumos.map((item) => item.mes);
          valores = consumos.map((item) => item.consumo_total);
        } else if (tab === "hora") {
          labels = consumos.map((item) => item.hora);
          valores = consumos.map((item) => item.consumo_total);
        }
        setData({
          labels,
          datasets: [
            {
              label: selected.labelChart,
              data: valores,
              fill: false,
              borderColor: "#1976d2",
              backgroundColor: "#1976d2",
              tension: 0.2,
            },
          ],
        });
      } catch (err) {
        setData({ labels: [], datasets: [] });
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, [tab, selectedDate]);

  // Obtener fecha por defecto (último día disponible en consumo diario)
  useEffect(() => {
    if (tab === "hora" && !selectedDate) {
      axios.get("http://localhost:5000/api/consumo-diario").then((res) => {
        if (res.data && res.data.length > 0) {
          setSelectedDate(res.data[res.data.length - 1].fecha);
        }
      });
    }
  }, [tab]);

  return (
    <div className="page-content">
      <h2>Historial de Consumo</h2>
      <p>Consulta el historial de consumo total por día, semana, mes u hora en un gráfico de líneas.</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "8px 20px",
              borderRadius: 6,
              border: tab === t.key ? "2px solid #1976d2" : "1px solid #ccc",
              background: tab === t.key ? "#e3f0fc" : "#fff",
              color: tab === t.key ? "#1976d2" : "#333",
              fontWeight: tab === t.key ? "bold" : "normal",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "hora" && (
        <div style={{ marginBottom: 24 }}>
          <label>
            Selecciona un día: {" "}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
            />
          </label>
        </div>
      )}
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Line
            data={data}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: "top" },
                tooltip: { enabled: true },
              },
              scales: {
                x: { title: { display: true, text: tab === "dia" ? "Día" : tab === "semana" ? "Semana" : tab === "mes" ? "Mes" : "Hora" } },
                y: { title: { display: true, text: "Consumo (kWh)" } },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Historial;
