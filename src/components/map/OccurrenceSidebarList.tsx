import React from "react";

interface Occurrence {
  id: number;
  tipo: string;
  local: string;
  status: string;
  lat: number;
  lng: number;
}

interface OccurrenceSidebarListProps {
  occurrences: Occurrence[];
  onItemClick: (occ: Occurrence) => void;
  getMarkerColor: (status: string) => string;
}

const OccurrenceSidebarList: React.FC<OccurrenceSidebarListProps> = ({
  occurrences,
  onItemClick,
  getMarkerColor,
}) => {
  return (
    <div className="map-sidebar">
      <h3>
        <i className="fas fa-layer-group"></i>
        Ocorrências no Mapa ({occurrences.length})
      </h3>
      <div className="map-list">
        {occurrences.map((occ) => (
          <div
            key={occ.id}
            className="map-list-item"
            onClick={() => onItemClick(occ)}
          >
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
              <span
                className={`mini-badge ${occ.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {occ.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OccurrenceSidebarList;