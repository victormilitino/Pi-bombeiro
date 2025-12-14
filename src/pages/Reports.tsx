import React, { useState, useMemo } from "react";
import "../styles/Reports.css";
import { useOccurrences } from "../components/OccurrencesContext";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#6b7280",
];

const Reports: React.FC = () => {
  const { occurrences } = useOccurrences();

  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [pieFilter, setPieFilter] = useState("all");

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "todos",
    location: "todas",
  });

  /* =======================
     FILTRO BASE DOS DADOS
  ======================== */
  const filteredOccurrences = useMemo(() => {
    return occurrences.filter((occ) => {
      const date = new Date(occ.timestamp);
      const start = filters.startDate
        ? new Date(filters.startDate)
        : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      const matchDate =
        (!start || date >= start) && (!end || date <= end);

      const matchType =
        filters.type === "todos" || occ.tipo.toLowerCase() === filters.type;

      const matchLocation =
        filters.location === "todas" ||
        occ.local.toLowerCase().includes(filters.location);

      return matchDate && matchType && matchLocation;
    });
  }, [occurrences, filters]);

  /* =======================
     GRÁFICO DE BARRAS
  ======================== */
  const barChartData = useMemo(() => {
    const count: Record<string, number> = {};
    filteredOccurrences.forEach((occ) => {
      count[occ.local] = (count[occ.local] || 0) + 1;
    });

    return Object.keys(count).map((key) => ({
      name: key,
      Ocorrências: count[key],
    }));
  }, [filteredOccurrences]);

  /* =======================
     GRÁFICO DE PIZZA
  ======================== */
  const pieChartData = useMemo(() => {
    const count: Record<string, number> = {};
    filteredOccurrences.forEach((occ) => {
      count[occ.tipo] = (count[occ.tipo] || 0) + 1;
    });

    return Object.keys(count).map((key, index) => ({
      name: key,
      value: count[key],
      color: COLORS[index % COLORS.length],
    }));
  }, [filteredOccurrences]);

  const filteredPieData =
    pieFilter === "all"
      ? pieChartData
      : pieChartData.filter((p) =>
          p.name.toLowerCase().includes(pieFilter)
        );

  /* =======================
     KPIs
  ======================== */
  const totalOccurrences = filteredOccurrences.length;

  const mostCommonType = useMemo(() => {
    if (!pieChartData.length) return "-";
    return pieChartData.sort((a, b) => b.value - a.value)[0].name;
  }, [pieChartData]);

  const mostCommonLocation = useMemo(() => {
    if (!barChartData.length) return "-";
    return barChartData.sort(
      (a, b) => b.Ocorrências - a.Ocorrências
    )[0].name;
  }, [barChartData]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard-main-content">
      <div className="page-container reports-page">

        {/* HEADER */}
        <div className="page-header-row">
          <h2 className="page-title">
            <i className="fas fa-chart-line"></i>
            Relatórios de Ocorrências
          </h2>

          <button
            className="btn-export"
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
          >
            Exportar Relatório
          </button>
        </div>

        {/* FILTROS */}
        <div className="report-filters data-card">
          <h3>Filtrar Dados</h3>
          <div className="form-row">
            <input type="date" name="startDate" onChange={handleFilterChange} />
            <input type="date" name="endDate" onChange={handleFilterChange} />

            <select name="type" onChange={handleFilterChange}>
              <option value="todos">Todos</option>
              <option value="incêndio">Incêndio</option>
              <option value="resgate">Resgate</option>
              <option value="acidente">Acidente</option>
            </select>

            <select name="location" onChange={handleFilterChange}>
              <option value="todas">Todas</option>
              <option value="boa viagem">Boa Viagem</option>
              <option value="centro">Centro</option>
            </select>
          </div>
        </div>

        {/* KPIs */}
        <div className="report-kpis">
          <div className="kpi-card">
            <span className="kpi-value">{totalOccurrences}</span>
            <span className="kpi-label">Total de Ocorrências</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-value">{mostCommonType}</span>
            <span className="kpi-label">Tipo Mais Comum</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-value">{mostCommonLocation}</span>
            <span className="kpi-label">Bairro com Mais Chamados</span>
          </div>
        </div>

        {/* GRÁFICOS */}
        <div className="report-charts">
          <div className="data-card chart-container">
            <h3>Ocorrências por Bairro</h3>
            <ResponsiveContainer height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Ocorrências" fill="#4ecdc4" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="data-card chart-container">
            <h3>Distribuição por Tipo</h3>

            <select
              className="pie-filter-select"
              value={pieFilter}
              onChange={(e) => setPieFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="incêndio">Incêndio</option>
              <option value="resgate">Resgate</option>
              <option value="acidente">Acidente</option>
            </select>

            <ResponsiveContainer height={300}>
              <PieChart>
                <Pie
                  data={filteredPieData}
                  dataKey="value"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
}
                >
                  {filteredPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;