import React from "react";
import OccurrenceList from "../components/OccurrenceList";
import "./Lista.css";

const Lista: React.FC = () => {
  // OBS: Removemos useEffect de autenticação pois o DashboardLayout já protege a rota
  // Removemos Header e Sidebar importados manualmente

  return (
    <div className="dashboard-main-content">
      <div className="page-container">
        
        {/* Cards de Resumo */}
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Ocorrências do dia</h3>
            <div className="card-value">6</div>
          </div>

          <div className="summary-card">
            <h3>Ocorrências por status</h3>
            <div className="status-values">
              <div className="status-item">
                <span className="value pending">4</span>
                <span className="label">Pendentes</span>
              </div>
              <div className="status-item">
                <span className="value resolved">2</span>
                <span className="label">Resolvidos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-section">
          <select className="filter-select">
            <option>Data de início</option>
          </select>
          
          <select className="filter-select">
            <option>Tipo de ocorrência</option>
            <option>Risco</option>
            <option>Alagamento</option>
            <option>Trânsito</option>
          </select>
          
          <button className="btn-clear">
            Limpar filtros
          </button>
          
          <button className="btn-apply">
            Aplicar
          </button>
        </div>

        {/* Lista de Ocorrências */}
        <OccurrenceList />
      </div>
    </div>
  );
};

export default Lista;