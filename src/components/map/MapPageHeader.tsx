import React from "react";

interface MapPageHeaderProps {
  totalOccurrences: number;
}

const MapPageHeader: React.FC<MapPageHeaderProps> = ({ totalOccurrences }) => {
  return (
    <div className="page-header">
      <div className="page-title-section">
        <h1 className="page-title">
          <i className="fas fa-map-marked-alt"></i>
          Mapa de Ocorrências
        </h1>
        <p className="page-subtitle">
          Visualize todas as ocorrências no mapa interativo com clustering e
          busca por endereço ({totalOccurrences} ocorrências)
        </p>
      </div>
    </div>
  );
};

export default MapPageHeader;