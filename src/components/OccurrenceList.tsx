import React, { useState } from 'react';
import './OccurrenceList.css';


// ========== TIPOS ==========
interface Occurrence {
  id: number;
  tipo: string;
  local: string;
  status: 'Novo' | 'Em Análise' | 'Concluído';
  descricao?: string;
  responsavel?: string;
  timestamp: Date;
}

interface OccurrenceListProps {
  occurrences?: Occurrence[];
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onStatusChange?: (id: number, newStatus: string) => void;
}

// ========== DADOS DE EXEMPLO ==========
const DEFAULT_OCCURRENCES: Occurrence[] = [
  {
    id: 1,
    tipo: 'Risco',
    local: 'Rua Principal, 123',
    status: 'Novo',
    timestamp: new Date(),
    responsavel: 'João Silva'
  },
  {
    id: 2,
    tipo: 'Alagamento',
    local: 'Av. Central, 456',
    status: 'Em Análise',
    timestamp: new Date(),
    responsavel: 'Maria Santos'
  },
  {
    id: 3,
    tipo: 'Trânsito',
    local: 'Ponte Norte',
    status: 'Novo',
    timestamp: new Date()
  },
  {
    id: 4,
    tipo: 'Incêndio',
    local: 'Rua das Flores, 789',
    status: 'Concluído',
    timestamp: new Date(),
    responsavel: 'Carlos Oliveira'
  },
  {
    id: 5,
    tipo: 'Queda de Árvore',
    local: 'Praça da República',
    status: 'Em Análise',
    timestamp: new Date()
  },
  {
    id: 6,
    tipo: 'Acidente',
    local: 'Rodovia BR-101',
    status: 'Novo',
    timestamp: new Date(),
    responsavel: 'Ana Costa'
  }
];

// ========== COMPONENTE ==========
const OccurrenceList: React.FC<OccurrenceListProps> = ({
  occurrences = DEFAULT_OCCURRENCES,
  onView,
  onEdit,
  onStatusChange
}) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleView = (id: number) => {
    if (onView) {
      onView(id);
    } else {
      alert(`Visualizar ocorrência #${id}`);
    }
  };

  const handleEdit = (id: number) => {
    if (onEdit) {
      onEdit(id);
    } else {
      alert(`Editar ocorrência #${id}`);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Novo':
        return 'status-novo';
      case 'Em Análise':
        return 'status-em-analise';
      case 'Concluído':
        return 'status-concluido';
      default:
        return '';
    }
  };

  return (
    <div className="occurrence-list-container">
      <div className="occurrence-list-header">
        <h3 className="occurrence-list-title">
          <i className="fas fa-list"></i>
          Visão Geral dos Casos
        </h3>
      </div>

      <table className="occurrence-list-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}></th>
            <th style={{ width: '80px' }}></th>
            <th>Status</th>
            <th style={{ width: '100px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {occurrences.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <i className="fas fa-inbox"></i>
                  </div>
                  <p className="empty-state-text">
                    Nenhuma ocorrência registrada
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            occurrences.map((occurrence) => (
              <tr
                key={occurrence.id}
                onMouseEnter={() => setHoveredRow(occurrence.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td>
                  <input 
                    type="checkbox" 
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td>
                  {/* Espaço vazio como no print */}
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(occurrence.status)}`}>
                    {occurrence.status}
                  </span>
                </td>
                <td>
                  <div className="occurrence-actions">
                    <button
                      className="action-icon"
                      onClick={() => handleView(occurrence.id)}
                      title="Visualizar"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="action-icon"
                      onClick={() => handleEdit(occurrence.id)}
                      title="Editar"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OccurrenceList;