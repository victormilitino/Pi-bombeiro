import React, { useState } from "react";
import { useOccurrences } from "../components/OccurrencesContext";
import "../styles/Dashboard.css";

const MapPage: React.FC = () => {
  const { occurrences } = useOccurrences();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Simulação de coordenadas para cada ocorrência
  const occurrencesWithCoords = occurrences.map((occ, index) => ({
    ...occ,
    lat: -8.0476 + (Math.random() - 0.5) * 0.1,
    lng: -34.8770 + (Math.random() - 0.5) * 0.1,
  }));

  const filteredOccurrences =
    selectedFilter === "all"
      ? occurrencesWithCoords
      : occurrencesWithCoords.filter((occ) => occ.status === selectedFilter);

  const getMarkerColor = (status: string) => {
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
      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">
            <i className="fas fa-map-marked-alt"></i>
            Mapa de Ocorrências
          </h1>
          <p className="page-subtitle">
            Visualize todas as ocorrências no mapa interativo
          </p>
        </div>
      </div>

      {/* Filtros do Mapa */}
      <div className="map-filters">
        <button
          className={`map-filter-btn ${selectedFilter === "all" ? "active" : ""}`}
          onClick={() => setSelectedFilter("all")}
        >
          <i className="fas fa-map-marker-alt"></i>
          Todas ({occurrencesWithCoords.length})
        </button>
        <button
          className={`map-filter-btn ${selectedFilter === "Novo" ? "active" : ""}`}
          onClick={() => setSelectedFilter("Novo")}
          style={{ borderColor: "#3b82f6" }}
        >
          <i className="fas fa-circle" style={{ color: "#3b82f6" }}></i>
          Novas
        </button>
        <button
          className={`map-filter-btn ${selectedFilter === "Em Análise" ? "active" : ""}`}
          onClick={() => setSelectedFilter("Em Análise")}
          style={{ borderColor: "#f59e0b" }}
        >
          <i className="fas fa-circle" style={{ color: "#f59e0b" }}></i>
          Em Análise
        </button>
        <button
          className={`map-filter-btn ${selectedFilter === "Concluído" ? "active" : ""}`}
          onClick={() => setSelectedFilter("Concluído")}
          style={{ borderColor: "#10b981" }}
        >
          <i className="fas fa-circle" style={{ color: "#10b981" }}></i>
          Concluídas
        </button>
      </div>

      {/* Container do Mapa */}
      <div className="map-container-wrapper">
        <div className="map-placeholder">
          {/* Simulação de Mapa */}
          <div className="map-bg">
            <div className="map-grid"></div>
            
            {/* Marcadores */}
            {filteredOccurrences.map((occ) => (
              <div
                key={occ.id}
                className="map-marker"
                style={{
                  left: `${((occ.lng + 34.9) * 1000) % 80 + 10}%`,
                  top: `${((occ.lat + 8.1) * 1000) % 70 + 10}%`,
                  backgroundColor: getMarkerColor(occ.status),
                }}
                title={`${occ.tipo} - ${occ.local}`}
              >
                <div className="marker-pulse"></div>
                <i className="fas fa-map-pin"></i>
                <div className="marker-tooltip">
                  <strong>{occ.tipo}</strong>
                  <p>{occ.local}</p>
                  <span className="marker-status">{occ.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Instruções */}
          <div className="map-overlay-info">
            <i className="fas fa-info-circle"></i>
            <p>
              Mapa simulado - Integre com Google Maps, OpenStreetMap ou Mapbox para
              funcionalidade completa
            </p>
          </div>
        </div>

        {/* Legenda */}
        <div className="map-legend">
          <h3>
            <i className="fas fa-list"></i>
            Legenda
          </h3>
          <div className="legend-item">
            <span className="legend-marker" style={{ background: "#3b82f6" }}></span>
            Novas Ocorrências
          </div>
          <div className="legend-item">
            <span className="legend-marker" style={{ background: "#f59e0b" }}></span>
            Em Análise
          </div>
          <div className="legend-item">
            <span className="legend-marker" style={{ background: "#10b981" }}></span>
            Concluídas
          </div>
        </div>
      </div>

      {/* Lista Lateral */}
      <div className="map-sidebar">
        <h3>
          <i className="fas fa-layer-group"></i>
          Ocorrências no Mapa ({filteredOccurrences.length})
        </h3>
        <div className="map-list">
          {filteredOccurrences.map((occ) => (
            <div key={occ.id} className="map-list-item">
              <div
                className="list-marker"
                style={{ background: getMarkerColor(occ.status) }}
              ></div>
              <div className="list-content">
                <strong>{occ.tipo}</strong>
                <p>
                  <i className="fas fa-map-marker-alt"></i>
                  {occ.local}
                </p>
                <span className={`mini-badge ${occ.status.toLowerCase().replace(" ", "-")}`}>
                  {occ.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapPage;