import React, { useState, useMemo } from "react";
import { useOccurrences } from "../components/OccurrencesContext";
import AddOccurrenceModal from "./AddOccurrenceModal";
import "../styles/Dashboard.css";

const OccurrencesPage: React.FC = () => {
  const { occurrences, updateOccurrence, deleteOccurrence } = useOccurrences();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedOccurrence, setSelectedOccurrence] = useState<number | null>(
    null
  );

  // Filtros e busca
  const filteredOccurrences = useMemo(() => {
    return occurrences.filter((occ) => {
      const matchesSearch =
        occ.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        occ.local.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || occ.status === filterStatus;
      const matchesType = filterType === "all" || occ.tipo === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [occurrences, searchTerm, filterStatus, filterType]);

  // Tipos únicos para o filtro
  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(occurrences.map((occ) => occ.tipo)));
  }, [occurrences]);

  const handleStatusChange = (id: number, newStatus: string) => {
    updateOccurrence(id, { status: newStatus as any });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta ocorrência?")) {
      deleteOccurrence(id);
    }
  };

  const formatDate = (timestamp: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Novo":
        return "#3b82f6";
      case "Em Análise":
        return "#f59e0b";
      case "Concluído":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="page-container">
      {/* Header da Página */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">
            <i className="fas fa-clipboard-list"></i>
            Gerenciar Ocorrências
          </h1>
          <p className="page-subtitle">
            Total de {filteredOccurrences.length} ocorrência(s) encontrada(s)
          </p>
        </div>
        <button
          className="btn-add-occurrence"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fas fa-plus"></i>
          Nova Ocorrência
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="filters-bar">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar por tipo ou local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="Novo">Novo</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Concluído">Concluído</option>
          </select>

          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Todos os Tipos</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <button
            className="btn-clear-filters"
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setFilterType("all");
            }}
          >
            <i className="fas fa-redo"></i>
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Tabela de Ocorrências */}
      <div className="occurrences-table-container">
        <table className="full-occurrences-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Local</th>
              <th>Status</th>
              <th>Responsável</th>
              <th>Data/Hora</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOccurrences.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p>Nenhuma ocorrência encontrada</p>
                </td>
              </tr>
            ) : (
              filteredOccurrences.map((occ) => (
                <tr
                  key={occ.id}
                  className={
                    selectedOccurrence === occ.id ? "selected-row" : ""
                  }
                  onClick={() => setSelectedOccurrence(occ.id)}
                >
                  <td className="id-cell">#{occ.id}</td>
                  <td>
                    <span className="type-badge">{occ.tipo}</span>
                  </td>
                  <td className="location-cell">
                    <i className="fas fa-map-marker-alt"></i>
                    {occ.local}
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={occ.status}
                      onChange={(e) =>
                        handleStatusChange(occ.id, e.target.value)
                      }
                      style={{ borderColor: getStatusColor(occ.status) }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="Novo">Novo</option>
                      <option value="Em Análise">Em Análise</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                  </td>
                  <td className="responsavel-cell">
                    {occ.responsavel || (
                      <span className="no-responsavel">Não atribuído</span>
                    )}
                  </td>
                  <td className="date-cell">{formatDate(occ.timestamp)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action view"
                        title="Ver detalhes"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Detalhes: ${JSON.stringify(occ, null, 2)}`);
                        }}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn-action edit"
                        title="Editar"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Função de edição em desenvolvimento");
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn-action delete"
                        title="Excluir"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(occ.id);
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AddOccurrenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default OccurrencesPage;
