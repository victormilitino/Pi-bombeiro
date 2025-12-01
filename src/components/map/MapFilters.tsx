import React from "react";

interface MapFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number;
    novo: number;
    emAnalise: number;
    concluido: number;
  };
}

const MapFilters: React.FC<MapFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  counts,
}) => {
  return (
    <div className="map-filters">
      <button
        className={`map-filter-btn ${selectedFilter === "all" ? "active" : ""}`}
        onClick={() => onFilterChange("all")}
      >
        <i className="fas fa-map-marker-alt"></i>
        Todas ({counts.all})
      </button>
      <button
        className={`map-filter-btn ${selectedFilter === "Novo" ? "active" : ""}`}
        onClick={() => onFilterChange("Novo")}
        style={{ borderColor: "#3b82f6" }}
      >
        <i className="fas fa-circle" style={{ color: "#3b82f6" }}></i>
        Novas ({counts.novo})
      </button>
      <button
        className={`map-filter-btn ${
          selectedFilter === "Em Análise" ? "active" : ""
        }`}
        onClick={() => onFilterChange("Em Análise")}
        style={{ borderColor: "#f59e0b" }}
      >
        <i className="fas fa-circle" style={{ color: "#f59e0b" }}></i>
        Em Análise ({counts.emAnalise})
      </button>
      <button
        className={`map-filter-btn ${
          selectedFilter === "Concluído" ? "active" : ""
        }`}
        onClick={() => onFilterChange("Concluído")}
        style={{ borderColor: "#10b981" }}
      >
        <i className="fas fa-circle" style={{ color: "#10b981" }}></i>
        Concluídas ({counts.concluido})
      </button>
    </div>
  );
};

export default MapFilters;