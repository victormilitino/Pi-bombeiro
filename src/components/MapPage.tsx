import React, { useState, useEffect } from "react";
import { useOccurrences } from "./OccurrencesContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const MapPage: React.FC = () => {
  const { occurrences, refreshOccurrences } = useOccurrences();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    refreshOccurrences();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NOVO": return "#3b82f6";
      case "EM_ANALISE": return "#f59e0b";
      case "EM_ATENDIMENTO": return "#8b5cf6";
      case "CONCLUIDO": return "#10b981";
      case "CANCELADO": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const filteredOccurrences = selectedFilter === "all"
    ? occurrences
    : occurrences.filter((occ) => occ.status === selectedFilter);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mapa de Ocorrências</h1>
      
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={() => setSelectedFilter("all")} style={{ padding: "8px 16px", background: selectedFilter === "all" ? "#1e3a5f" : "#fff", color: selectedFilter === "all" ? "#fff" : "#000", border: "1px solid #ccc", borderRadius: "5px", cursor: "pointer" }}>
          Todas ({occurrences.length})
        </button>
        <button onClick={() => setSelectedFilter("NOVO")} style={{ padding: "8px 16px", background: selectedFilter === "NOVO" ? "#3b82f6" : "#fff", color: selectedFilter === "NOVO" ? "#fff" : "#000", border: "1px solid #ccc", borderRadius: "5px", cursor: "pointer" }}>
          Novas
        </button>
        <button onClick={() => setSelectedFilter("EM_ANALISE")} style={{ padding: "8px 16px", background: selectedFilter === "EM_ANALISE" ? "#f59e0b" : "#fff", color: selectedFilter === "EM_ANALISE" ? "#fff" : "#000", border: "1px solid #ccc", borderRadius: "5px", cursor: "pointer" }}>
          Em Análise
        </button>
        <button onClick={() => setSelectedFilter("CONCLUIDO")} style={{ padding: "8px 16px", background: selectedFilter === "CONCLUIDO" ? "#10b981" : "#fff", color: selectedFilter === "CONCLUIDO" ? "#fff" : "#000", border: "1px solid #ccc", borderRadius: "5px", cursor: "pointer" }}>
          Concluídas
        </button>
      </div>

      <div style={{ height: "500px", width: "100%", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <MapContainer center={[-8.0476, -34.877]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {filteredOccurrences.map((occ) => (
            <Marker key={occ.id} position={[occ.latitude || -8.0476, occ.longitude || -34.877]} icon={createIcon(getStatusColor(occ.status))}>
              <Popup>
                <strong>{occ.tipo}</strong><br />
                {occ.local}<br />
                <span style={{ color: getStatusColor(occ.status) }}>{occ.status}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Ocorrências ({filteredOccurrences.length})</h3>
        {filteredOccurrences.map((occ) => (
          <div key={occ.id} style={{ padding: "10px", marginBottom: "10px", background: "#f5f5f5", borderRadius: "5px", borderLeft: `4px solid ${getStatusColor(occ.status)}` }}>
            <strong>{occ.tipo}</strong> - {occ.local}<br />
            <small>{occ.status} | {occ.data}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapPage;
