import React, { useState, useEffect, useRef } from "react";
import { useOccurrences } from "../components/OccurrencesContext";
import MapPageHeader from "../components/map/MapPageHeader";
import GeocodingSearch from "../components/map/GeocodingSearch";
import MapFilters from "../components/map/MapFilters";
import MapContainer from "../components/map/MapContainer";
import OccurrenceSidebarList from "../components/map/OccurrenceSidebarList";
import {
  getMarkerColor,
  createCustomIcon,
  searchAddress,
  calculateFilterCounts,
} from "../utils/mapUtils";
import L from "leaflet";
import "../styles/MapPage.css";

// Imports de ícones do Leaflet
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
  const [markerClusterGroup, setMarkerClusterGroup] = useState<L.MarkerClusterGroup | null>(null);
  const [searchAddressValue, setSearchAddressValue] = useState("");

  const mapRef = useRef<HTMLDivElement>(null);

  // Adiciona coordenadas simuladas se não existirem
  const occurrencesWithCoords = occurrences.map((occ) => ({
    ...occ,
    lat: occ.latitude || -8.0476 + (Math.random() - 0.5) * 0.1,
    lng: occ.longitude || -34.8770 + (Math.random() - 0.5) * 0.1,
  }));

  const filteredOccurrences =
    selectedFilter === "all"
      ? occurrencesWithCoords
      : occurrencesWithCoords.filter((occ) => occ.status === selectedFilter);

  const filterCounts = calculateFilterCounts(occurrencesWithCoords);

  const handleSearchAddress = () => {
    if (!map) return;
    searchAddress(searchAddressValue, map);
  };

  const handleMapReady = (mapInstance: L.Map, clusterGroup: L.MarkerClusterGroup) => {
    setMap(mapInstance);
    setMarkerClusterGroup(clusterGroup);
  };

  const handleListItemClick = (occ: any) => {
    if (map) {
      map.setView([occ.lat, occ.lng], 16);
      if (markerClusterGroup) {
        // Lógica de abrir popup se necessário
      }
    }
  };

  // OBS: Removemos Sidebar, Header e os wrappers duplicados. 
  // Agora retornamos apenas o conteúdo da página.
  return (
    <div className="dashboard-main-content">
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
    </div>
  );
};

export default MapPage;