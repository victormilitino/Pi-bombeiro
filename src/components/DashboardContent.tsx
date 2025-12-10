import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Importar useNavigate
import { useOccurrences } from "../components/OccurrencesContext";
import AddOccurrenceModal from "./AddOccurrenceModal";
import "../styles/Dashboard.css";

const DashboardContent: React.FC = () => {
  const navigate = useNavigate(); // 2. Inicializar o hook de navegação
  const { occurrences, getStats } = useOccurrences();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = getStats();

  // Mantendo o limite de 4 ocorrências que configuramos antes
  const recentOccurrences = occurrences.slice(0, 4);

  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return "-";
    const dateObj = new Date(timestamp);
    if (isNaN(dateObj.getTime())) return "Data inválida";

    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    
    if (diff < 0) return "Agora";

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `Há ${minutes} min`;
    if (hours < 24) return `Há ${hours} hora${hours > 1 ? "s" : ""}`;
    if (days === 1) return "Ontem";
    return `Há ${days} dias`;
  };

  return (
    <div className="dashboard-main-content">
      {/* Botão de Ação Principal */}
      <button
        className="new-occurrence-btn"
        onClick={() => setIsModalOpen(true)}
      >
        <i className="fas fa-plus"></i> Registrar Nova Ocorrência
      </button>

      {/* CARDS DE NAVEGAÇÃO/RESUMO */}
      <section className="nav-cards-container">
        {/* Configurei este também para ir para a lista de ocorrências, para ficar completo */}
        <div className="nav-card" onClick={() => navigate('/occurrences')}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>Ocorrências Críticas</span>
        </div>

        {/* 3. Navegação para o Mapa */}
        <div className="nav-card" onClick={() => navigate('/map')}>
          <i className="fas fa-map-marker-alt"></i>
          <span>Mapa de Localizações</span>
        </div>

        {/* 4. Navegação para Relatórios */}
        <div className="nav-card" onClick={() => navigate('/reports')}>
          <i className="fas fa-chart-bar"></i>
          <span>Relatórios Gerenciais</span>
        </div>
      </section>

      {/* MÉTRICAS E DADOS RECENTES */}
      <section className="data-metrics-container">
        {/* Card 1: Resumo de Status */}
        <div className="data-card status-card">
          <h3>Status Geral</h3>
          <div className="status-values">
            <div className="status-item">
              <span className="status-number pending">{stats.pendentes}</span>
              <span className="status-label">Pendentes</span>
            </div>
            <div className="status-item">
              <span className="status-number resolved">{stats.resolvidos}</span>
              <span className="status-label">Resolvidos</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tabela de Ocorrências Recentes */}
        <div className="data-card recent-card">
          <h3>Ocorrências Recentes</h3>
          <div className="table-wrapper">
            <table className="occurrences-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Local</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {recentOccurrences.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      <i
                        className="fas fa-inbox"
                        style={{
                          fontSize: "2em",
                          color: "#9ca3af",
                          marginBottom: "10px",
                        }}
                      ></i>
                      <p style={{ color: "#6b7280" }}>
                        Nenhuma ocorrência registrada
                      </p>
                    </td>
                  </tr>
                ) : (
                  recentOccurrences.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className="occurrence-type">{item.tipo}</span>
                      </td>
                      <td>{item.local}</td>
                      <td>
                        <span
                          className={`status-badge ${item.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="date-cell">
                        {formatRelativeTime(item.timestamp)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal de Nova Ocorrência */}
      <AddOccurrenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default DashboardContent;