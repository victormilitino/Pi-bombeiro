import React, { useMemo, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { useOccurrences } from "../components/OccurrencesContext";
import { countBy, filterByDate } from "../utils/occurrenceStats";

const palette = [
  "#40516c",
  "#4a5d7c",
  "#53698c",
  "#5d759c",
  "#6b82a7"
];


const OccurrencesDashboard: React.FC = () => {
  const { occurrences } = useOccurrences();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = useMemo(
    () => filterByDate(occurrences, startDate, endDate),
    [occurrences, startDate, endDate]
  );

  // ===== ROSCA: TIPOS =====
  const typeStats = useMemo(() => countBy(filtered, "tipo"), [filtered]);

  const doughnutData = {
    labels: Object.keys(typeStats),
    datasets: [
      {
        data: Object.values(typeStats),
        backgroundColor: palette
      }
    ]
  };

  // ===== BARRAS: STATUS =====
  const statusStats = useMemo(() => countBy(filtered, "status"), [filtered]);

  const barData = {
    labels: Object.keys(statusStats),
    datasets: [
      {
        label: "Ocorrências",
        data: Object.values(statusStats),
        backgroundColor: "#5d759c"
      }
    ]
  };

  return (
    <div className="page-container">
      <h1>📊 Dashboard de Ocorrências</h1>

      {/* Filtros */}
      <div className="filters-bar">
        <input type="date" onChange={e => setStartDate(e.target.value)} />
        <input type="date" onChange={e => setEndDate(e.target.value)} />
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Distribuição por Tipo</h3>
          <Doughnut data={doughnutData} />
        </div>

        <div className="chart-card">
          <h3>Status das Ocorrências</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default OccurrencesDashboard;
