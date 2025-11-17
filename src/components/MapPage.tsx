import React, { useState, useEffect, useRef } from "react";
import { useOccurrences } from "../components/OccurrencesContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import "../styles/Dashboard.css";
import "../styles/MapPage.css";

// Corrigir ícones do Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapPage: React.FC = () => {
  const { occurrences } = useOccurrences();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [map, setMap] = useState<L.Map | null>(null);
  const [markerClusterGroup, setMarkerClusterGroup] =
    useState<L.MarkerClusterGroup | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);

  // Coordenadas de Recife, PE
  const RECIFE_CENTER: [number, number] = [-8.0476, -34.877];

  // Simulação de coordenadas para cada ocorrência
  const occurrencesWithCoords = occurrences.map((occ, index) => ({
    ...occ,
    lat: RECIFE_CENTER[0] + (Math.random() - 0.5) * 0.1,
    lng: RECIFE_CENTER[1] + (Math.random() - 0.5) * 0.1,
  }));

  const filteredOccurrences =
    selectedFilter === "all"
      ? occurrencesWithCoords
      : occurrencesWithCoords.filter((occ) => occ.status === selectedFilter);

  // Cores dos marcadores por status
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

  // Criar ícone customizado
  const createCustomIcon = (color: string) => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        ">
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });
  };

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current || map) return;

    const newMap = L.map(mapRef.current).setView(RECIFE_CENTER, 13);

    // Adicionar camada do OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(newMap);

    // Adicionar busca por endereço (Geocoding)
    const provider = new OpenStreetMapProvider();
    const searchControl = new (GeoSearchControl as any)({
      provider: provider,
      style: "bar",
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: "Buscar endereço em Pernambuco...",
      // Restringir busca para área de Pernambuco
      countrycodes: "br",
    });

    newMap.addControl(searchControl);

    // Inicializar grupo de clusters
    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 80,
      iconCreateFunction: function (cluster) {
        const childCount = cluster.getChildCount();
        let className = "marker-cluster-small";
        
        if (childCount > 10) {
          className = "marker-cluster-large";
        } else if (childCount > 5) {
          className = "marker-cluster-medium";
        }

        return L.divIcon({
          html: `<div><span>${childCount}</span></div>`,
          className: "marker-cluster " + className,
          iconSize: L.point(40, 40),
        });
      },
    });

    newMap.addLayer(clusterGroup);
    setMarkerClusterGroup(clusterGroup);
    setMap(newMap);

    return () => {
      newMap.remove();
    };
  }, []);

  // Atualizar marcadores quando filtro muda
  useEffect(() => {
    if (!map || !markerClusterGroup) return;

    // Limpar clusters
    markerClusterGroup.clearLayers();

    // Adicionar novos marcadores ao cluster
    filteredOccurrences.forEach((occ) => {
      const marker = L.marker([occ.lat, occ.lng], {
        icon: createCustomIcon(getMarkerColor(occ.status)),
      });

      // Popup com informações
      marker.bindPopup(`
        <div style="min-width: 220px; font-family: 'Inter', sans-serif;">
          <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 1.1em; font-weight: 700;">
            ${occ.tipo}
          </h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <p style="margin: 0; color: #6b7280; font-size: 0.9em; display: flex; align-items: center; gap: 6px;">
              <i class="fas fa-map-marker-alt" style="color: #4ecdc4;"></i>
              <strong>Local:</strong> ${occ.local}
            </p>
            <p style="margin: 0; color: #6b7280; font-size: 0.9em; display: flex; align-items: center; gap: 6px;">
              <i class="fas fa-calendar" style="color: #4ecdc4;"></i>
              <strong>Data:</strong> ${occ.data}
            </p>
            <span style="
              display: inline-block;
              padding: 6px 14px;
              background: ${getMarkerColor(occ.status)}20;
              color: ${getMarkerColor(occ.status)};
              border-radius: 16px;
              font-size: 0.8em;
              font-weight: 700;
              margin-top: 4px;
              text-align: center;
            ">
              ${occ.status}
            </span>
            ${
              occ.descricao
                ? `<p style="margin: 10px 0 0 0; padding-top: 10px; border-top: 1px solid #e5e7eb; color: #4b5563; font-size: 0.85em;">
                ${occ.descricao}
              </p>`
                : ""
            }
          </div>
        </div>
      `);

      markerClusterGroup.addLayer(marker);
    });

    // Ajustar zoom para mostrar todos os marcadores
    if (filteredOccurrences.length > 0) {
      const bounds = markerClusterGroup.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [map, markerClusterGroup, filteredOccurrences]);

  // Função para buscar endereço manualmente
  const handleSearchAddress = async () => {
    if (!map || !searchAddress.trim()) return;

    const provider = new OpenStreetMapProvider();
    
    // Adicionar Pernambuco à busca para focar no estado
    const searchQuery = searchAddress.includes("PE") || searchAddress.includes("Pernambuco")
      ? searchAddress
      : `${searchAddress}, Pernambuco, Brasil`;
    
    const results = await provider.search({ query: searchQuery });

    if (results && results.length > 0) {
      // Filtrar resultados para priorizar Pernambuco
      const peResults = results.filter(r => 
        r.label.includes("Pernambuco") || 
        r.label.includes("PE") ||
        r.label.includes("Recife")
      );
      
      const result = peResults.length > 0 ? peResults[0] : results[0];
      
      // Verificar se está dentro de Pernambuco (aproximadamente)
      const isPernambuco = result.y >= -9.5 && result.y <= -7.0 && 
                           result.x >= -41.5 && result.x <= -34.0;
      
      if (!isPernambuco) {
        alert("⚠️ Endereço fora de Pernambuco. Tente especificar o endereço em Recife ou Pernambuco.");
        return;
      }
      
      map.setView([result.y, result.x], 16);

      // Adicionar marcador temporário
      const tempMarker = L.marker([result.y, result.x])
        .addTo(map)
        .bindPopup(`<strong>📍 ${result.label}</strong>`)
        .openPopup();

      setTimeout(() => {
        map.removeLayer(tempMarker);
      }, 5000);
    } else {
      alert("Endereço não encontrado. Tente outro.");
    }
  };

  // Centralizar no marcador quando clicar na lista
  const handleListItemClick = (occ: any) => {
    if (!map) return;
    map.setView([occ.lat, occ.lng], 17);

    // Encontrar e abrir popup
    markerClusterGroup?.eachLayer((layer: any) => {
      const pos = layer.getLatLng();
      if (pos.lat === occ.lat && pos.lng === occ.lng) {
        layer.openPopup();
      }
    });
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </aside>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      />

      {/* Main Content */}
      <div className="main-content">
        <Header onToggleSidebar={toggleSidebar} />  

        <main className="dashboard-main-content">
          <div className="page-container">
            {/* Header */}
            <div className="page-header">
              <div className="page-title-section">
                <h1 className="page-title">
                  <i className="fas fa-map-marked-alt"></i>
                  Mapa de Ocorrências
                </h1>
                <p className="page-subtitle">
                  Visualize todas as ocorrências no mapa interativo com
                  clustering e busca por endereço
                </p>
              </div>
            </div>

            {/* Barra de Busca de Endereço */}
            <div className="geocoding-search">
              <div className="search-input-group">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Digite um endereço (ex: Av. Boa Viagem, Recife - PE)"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSearchAddress()
                  }
                />
                <button onClick={handleSearchAddress}>
                  <i className="fas fa-map-marker-alt"></i>
                  Buscar
                </button>
              </div>
              <p className="search-hint">
                <i className="fas fa-lightbulb"></i>
                Busque por endereços em Pernambuco (ex: Av. Boa Viagem, Recife)
              </p>
            </div>

            {/* Filtros do Mapa */}
            <div className="map-filters">
              <button
                className={`map-filter-btn ${
                  selectedFilter === "all" ? "active" : ""
                }`}
                onClick={() => setSelectedFilter("all")}
              >
                <i className="fas fa-map-marker-alt"></i>
                Todas ({occurrencesWithCoords.length})
              </button>
              <button
                className={`map-filter-btn ${
                  selectedFilter === "Novo" ? "active" : ""
                }`}
                onClick={() => setSelectedFilter("Novo")}
                style={{ borderColor: "#3b82f6" }}
              >
                <i className="fas fa-circle" style={{ color: "#3b82f6" }}></i>
                Novas
              </button>
              <button
                className={`map-filter-btn ${
                  selectedFilter === "Em Análise" ? "active" : ""
                }`}
                onClick={() => setSelectedFilter("Em Análise")}
                style={{ borderColor: "#f59e0b" }}
              >
                <i className="fas fa-circle" style={{ color: "#f59e0b" }}></i>
                Em Análise
              </button>
              <button
                className={`map-filter-btn ${
                  selectedFilter === "Concluído" ? "active" : ""
                }`}
                onClick={() => setSelectedFilter("Concluído")}
                style={{ borderColor: "#10b981" }}
              >
                <i className="fas fa-circle" style={{ color: "#10b981" }}></i>
                Concluídas
              </button>
            </div>

            {/* Container do Mapa */}
            <div className="map-container-wrapper">
              <div ref={mapRef} className="leaflet-map" />

              {/* Legenda */}
             {/* <div className="map-legend">
                <h3>
                  <i className="fas fa-list"></i>
                  Legenda
                </h3>
                <div className="legend-item">
                  <span
                    className="legend-marker"
                    style={{ background: "#3b82f6" }}
                  ></span>
                  Novas Ocorrências
                </div>
                <div className="legend-item">
                  <span
                    className="legend-marker"
                    style={{ background: "#f59e0b" }}
                  ></span>
                  Em Análise
                </div>
                <div className="legend-item">
                  <span
                    className="legend-marker"
                    style={{ background: "#10b981" }}
                  ></span>
                  Concluídas
                </div>
                <div className="legend-divider"></div>
                <div className="legend-item">
                  <span className="cluster-icon-small">3</span>
                  Cluster (3-5)
                </div>
                <div className="legend-item">
                  <span className="cluster-icon-medium">7</span>
                  Cluster (6-10)
                </div>
                <div className="legend-item">
                  <span className="cluster-icon-large">15</span>
                  Cluster (11+)
                </div>
              </div>*/}
            </div>

            {/* Lista Lateral */}
            <div className="map-sidebar">
              <h3>
                <i className="fas fa-layer-group"></i>
                Ocorrências no Mapa ({filteredOccurrences.length})
              </h3>
              <div className="map-list">
                {filteredOccurrences.map((occ) => (
                  <div
                    key={occ.id}
                    className="map-list-item"
                    onClick={() => handleListItemClick(occ)}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default MapPage;