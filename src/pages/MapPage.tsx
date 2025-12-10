import React, { useState, useEffect } from "react";
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
  geocodeAddress, // Importando a nova função
  calculateFilterCounts,
} from "../utils/mapUtils";
import L from "leaflet";
import "../styles/MapPage.css";

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
  
  // Estado para armazenar coordenadas corrigidas automaticamente
  const [autoFixedCoords, setAutoFixedCoords] = useState<Record<string, {lat: number, lng: number}>>({});
  const [fixingCount, setFixingCount] = useState(0);

  // === EFEITO DE AUTO-CORREÇÃO ===
  useEffect(() => {
    let isCancelled = false;

    const fixAddresses = async () => {
      // Filtra ocorrências que têm endereço MAS não têm coordenadas válidas
      const toFix = occurrences.filter(occ => 
        (occ.local && occ.local.length > 5) && 
        (!occ.latitude || Number(occ.latitude) === 0 || isNaN(Number(occ.latitude))) &&
        !autoFixedCoords[occ.id] // Não corrigir se já corrigimos
      );

      setFixingCount(toFix.length);

      // Processa uma por uma com delay para não bloquear o IP
      for (const occ of toFix) {
        if (isCancelled) break;

        // Delay de 1.2 segundos entre requisições (Segurança API)
        await new Promise(r => setTimeout(r, 1200));
        
        try {
          console.log(`Tentando corrigir endereço: ${occ.local}`);
          const coords = await geocodeAddress(occ.local);
          
          if (coords && !isCancelled) {
            setAutoFixedCoords(prev => ({
              ...prev,
              [occ.id]: { lat: coords.lat, lng: coords.lng }
            }));
            setFixingCount(prev => prev - 1);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setFixingCount(0);
    };
    
    if (occurrences.length > 0) {
      fixAddresses();
    }

    return () => { isCancelled = true; };
  }, [occurrences]); // Executa quando a lista muda

  // === PREPARAÇÃO DOS DADOS PARA O MAPA ===
  const occurrencesWithCoords = occurrences
    .map((occ) => {
      // 1. Verifica se já temos uma correção automática para este ID
      const fixed = autoFixedCoords[occ.id];
      if (fixed) {
        return { ...occ, lat: fixed.lat, lng: fixed.lng, status: occ.status };
      }

      // 2. Se não, tenta usar o que veio do banco
      const lat = Number(occ.latitude);
      const lng = Number(occ.longitude);
      
      // 3. Se for válido, usa. Se for inválido (0,0), retorna null para filtrar depois.
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        return { ...occ, lat, lng, status: occ.status };
      }
      
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null); // Remove os nulos

  const filteredOccurrences =
    selectedFilter === "all"
      ? occurrencesWithCoords
      : occurrencesWithCoords.filter((occ) => {
          const s = (occ.status || "").toLowerCase();
          const f = selectedFilter.toLowerCase();
          if (f === "novo") return s.includes("novo");
          if (f.includes("análise")) return s.includes("analise") || s.includes("análise");
          if (f.includes("concluído")) return s.includes("concluido") || s.includes("concluído");
          return false;
      });

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
      map.setView([occ.lat, occ.lng], 18);
      // Opcional: abrir popup
    }
  };

  return (
    <div className="dashboard-main-content">
      <div className="page-container">
        
        <MapPageHeader totalOccurrences={occurrencesWithCoords.length} />
        
        {/* Aviso de Correção em Andamento */}
        {fixingCount > 0 && (
          <div style={{ 
            background: '#fff3cd', 
            color: '#856404', 
            padding: '10px 15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            fontSize: '0.9em',
            border: '1px solid #ffeeba',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-sync fa-spin"></i>
            Localizando {fixingCount} endereços antigos no mapa... (Isso pode levar um tempo)
          </div>
        )}

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