import React from "react";
// 1. Importar o hook de contexto
import { useOccurrences } from "../components/OccurrencesContext";
import OccurrenceList from "../components/OccurrenceList";
import "./Lista.css";

const Lista: React.FC = () => {
  // 2. Pegar as ocorrências reais
  const { occurrences } = useOccurrences();

  return (
    <div className="dashboard-main-content">
      <div className="page-container">
        
        {/* Cards de Resumo */}
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Ocorrências do dia</h3>
            <div className="card-value">{occurrences.length}</div> {/* Atualizado dinamicamente */}
          </div>

          <div className="summary-card">
            <h3>Ocorrências por status</h3>
            <div className="status-values">
              <div className="status-item">
                <span className="value pending">
                  {occurrences.filter(o => o.status !== 'Concluído').length}
                </span>
                <span className="label">Pendentes</span>
              </div>
              <div className="status-item">
                <span className="value resolved">
                  {occurrences.filter(o => o.status === 'Concluído').length}
                </span>
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
            <option>Data de fim</option>
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
        {/* 3. Passar a prop 'occurrences' com os dados reais */}
        <OccurrenceList occurrences={occurrences} />
      </div>
    </div>
  );
};

export default Lista;