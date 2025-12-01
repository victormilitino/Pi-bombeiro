import React, { useState } from "react";
import { useOccurrences } from "../components/OccurrencesContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MapPageHeader from "../components/map/MapPageHeader";
import GeocodingSearch from "../components/map/GeocodingSearch";
import MapFilters from "../components/map/MapFilters";
import MapContainer from "../components/map/MapContainer";
import OccurrenceSidebarList from "../components/map/OccurrenceSidebarList";
import {
  getMarkerColor,
  createCustomIcon,
  searchAddress,
  addCoordinatesToOccurrences,
  calculateFilterCounts,
} from "../utils/mapUtils";
import L from "leaflet";
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
  const [searchAddressValue, setSearchAddressValue] = useState("");

  const RECIFE_CENTER: [number, number] = [-8.0476, -34.877];

  // Adicionar coordenadas às ocorrências
  const occurrencesWithCoords = addCoordinatesToOccurrences(
    occurrences,
    RECIFE_CENTER[0],
    RECIFE_CENTER[1]
  );

  // Filtrar ocorrências
  const filteredOccurrences =
    selectedFilter === "all"
      ? occurrencesWithCoords
      : occurrencesWithCoords.filter((occ) => occ.status === selectedFilter);

  // Calcular contagens
  const filterCounts = calculateFilterCounts(occurrencesWithCoords);

  // Handler para quando o mapa estiver pronto
  const handleMapReady = (newMap: L.Map, clusterGroup: L.MarkerClusterGroup) => {
    setMap(newMap);
    setMarkerClusterGroup(clusterGroup);
  };

  // Handler para busca de endereço
  const handleSearchAddress = async () => {
    await searchAddress(searchAddressValue, map);
  };

  // Handler para clique em item da lista
  const handleListItemClick = (occ: any) => {
    if (!map) return;
    map.setView([occ.lat, occ.lng], 17);

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
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </aside>

      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      />

      <div className="main-content">
        <Header onToggleSidebar={toggleSidebar} />

        <main className="dashboard-main-content">
          <div className="page-container">
            <MapPageHeader totalOccurrences={occurrencesWithCoords.length} />

            <GeocodingSearch
              searchAddress={searchAddressValue}
              onSearchChange={setSearchAddressValue}
              onSearch={handleSearchAddress}
            />

            <MapFilters
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              counts={filterCounts}
            />

            <MapContainer
              occurrences={filteredOccurrences}
              onMapReady={handleMapReady}
              getMarkerColor={getMarkerColor}
              createCustomIcon={createCustomIcon}
            />

            <OccurrenceSidebarList
              occurrences={filteredOccurrences}
              onItemClick={handleListItemClick}
              getMarkerColor={getMarkerColor}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MapPage;