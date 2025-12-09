import React, { useState } from "react";
import "../styles/Reports.css";

// Importações completas do Recharts para os dois gráficos
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

// Dados para o gráfico de barras
const chartData = [
  { name: "Boa Viagem", Ocorrências: 40 },
  { name: "Casa Amarela", Ocorrências: 30 },
  { name: "Centro", Ocorrências: 20 },
  { name: "Várzea", Ocorrências: 27 },
  { name: "Pina", Ocorrências: 18 },
  { name: "Ibura", Ocorrências: 23 },
];

// Dados para o gráfico de pizza
const pieChartData = [
  { name: "Incêndio", value: 450, color: "#ef4444" },
  { name: "Resgate", value: 380, color: "#3b82f6" },
  { name: "Acidente", value: 320, color: "#f59e0b" },
  { name: "Vazamento", value: 180, color: "#8b5cf6" },
  { name: "Outros", value: 150, color: "#6b7280" },
];

const Reports: React.FC = () => {
  // Estado para os menus e filtros internos da página
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [pieFilter, setPieFilter] = useState<string>("all");
  
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "todos",
    location: "todas",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateReport = () => {
    console.log("Gerando relatório com os filtros:", filters);
    // Lógica futura de chamada API
  };

  // Funções de exportação (Simuladas)
  const handleExport = (type: string) => {
    console.log(`Exportando para ${type}...`);
    setExportMenuOpen(false);
    alert(`Exportando relatório em ${type}...`);
  };

  // Lógica do Filtro do Gráfico de Pizza (O que você gostava)
  const getFilteredPieData = () => {
    if (pieFilter === "all") return pieChartData;
    return pieChartData.filter(item => 
      item.name.toLowerCase().includes(pieFilter.toLowerCase())
    );
  };

  return (
    // OBS: Removemos Sidebar e Header daqui, pois o DashboardLayout já os renderiza.
    <div className="dashboard-main-content">
      <div className="page-container reports-page">
        
        {/* --- Header da Página --- */}
        <div className="page-header-row">
          <h2 className="page-title">
            <i className="fas fa-chart-line" style={{ marginRight: '12px', color: '#4ecdc4' }}></i>
            Relatórios de Ocorrências
          </h2>
          
          {/* Dropdown de Exportação */}
          <div className="export-dropdown-container">
            <button 
              className="btn-export"
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
            >
              <i className="fas fa-download"></i>
              Exportar Relatório
              <i className={`fas fa-chevron-down ${exportMenuOpen ? 'rotated' : ''}`}></i>
            </button>

            {exportMenuOpen && (
              <div className="export-dropdown-menu">
                <button className="export-option pdf" onClick={() => handleExport('PDF')}>
                  <i className="fas fa-file-pdf"></i>
                  <span>Exportar em PDF</span>
                </button>
                <button className="export-option excel" onClick={() => handleExport('Excel')}>
                  <i className="fas fa-file-excel"></i>
                  <span>Exportar em Excel</span>
                </button>
                <button className="export-option csv" onClick={() => handleExport('CSV')}>
                  <i className="fas fa-file-csv"></i>
                  <span>Exportar em CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- 1. Seção de Filtros --- */}
        <div className="report-filters data-card">
          <h3 className="data-card-title">Filtrar Dados</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Data de Início</label>
              <input
                type="date"
                name="startDate"
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-group">
              <label>Data de Fim</label>
              <input type="date" name="endDate" onChange={handleFilterChange} />
            </div>
            <div className="form-group">
              <label>Tipo de Ocorrência</label>
              <select name="type" onChange={handleFilterChange}>
                <option value="todos">Todos</option>
                <option value="incendio">Incêndio</option>
                <option value="resgate">Resgate</option>
                <option value="acidente">Acidente</option>
              </select>
            </div>
            <div className="form-group">
              <label>Localização (Bairro)</label>
              <select name="location" onChange={handleFilterChange}>
                <option value="todas">Todas</option>
                <option value="boa viagem">Boa Viagem</option>
                <option value="centro">Centro</option>
              </select>
            </div>
          </div>
          <button className="btn-primary" onClick={handleGenerateReport}>
            <i className="fas fa-filter"></i> Gerar Relatório
          </button>
        </div>

        {/* --- 2. Seção de KPIs (Resumo) --- */}
        <div className="report-kpis">
          <div className="kpi-card data-card">
            <span className="kpi-value">1,480</span>
            <span className="kpi-label">Total de Ocorrências</span>
          </div>
          <div className="kpi-card data-card">
            <span className="kpi-value">22 min</span>
            <span className="kpi-label">Tempo Médio de Resposta</span>
          </div>
          <div className="kpi-card data-card">
            <span className="kpi-value">Incêndio</span>
            <span className="kpi-label">Tipo Mais Comum</span>
          </div>
          <div className="kpi-card data-card">
            <span className="kpi-value">Boa Viagem</span>
            <span className="kpi-label">Bairro com Mais Chamados</span>
          </div>
        </div>

        {/* --- 3. Seção de Gráficos --- */}
        <div className="report-charts">
          
          {/* Gráfico de Barras (Trazido de volta!) */}
          <div className="data-card chart-container">
            <h3>Ocorrências por Bairro</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Ocorrências" fill="#4ecdc4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Pizza Interativo (Funcionalidade Restaurada!) */}
          <div className="data-card chart-container">
            <div className="chart-header-with-filter">
              <h3>Distribuição por Tipo</h3>
              <select 
                className="pie-filter-select"
                value={pieFilter}
                onChange={(e) => setPieFilter(e.target.value)}
              >
                <option value="all">Todos os Tipos</option>
                <option value="incêndio">Incêndio</option>
                <option value="resgate">Resgate</option>
                <option value="acidente">Acidente</option>
                <option value="vazamento">Vazamento</option>
              </select>
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={getFilteredPieData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getFilteredPieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
    </div>
  );
};

export default Reports;