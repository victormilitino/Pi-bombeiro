import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

interface Occurrence {
  id: number;
  tipo: string;
  local: string;
  data: string;
  status: string;
  descricao?: string;
  lat: number;
  lng: number;
}

interface MapContainerProps {
  occurrences: Occurrence[];
  onMapReady: (map: L.Map, clusterGroup: L.MarkerClusterGroup) => void;
  getMarkerColor: (status: string) => string;
  createCustomIcon: (color: string) => L.DivIcon;
}

const MapContainer: React.FC<MapContainerProps> = ({
  occurrences,
  onMapReady,
  getMarkerColor,
  createCustomIcon,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  const RECIFE_CENTER: [number, number] = [-8.0476, -34.877];

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const newMap = L.map(mapRef.current).setView(RECIFE_CENTER, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(newMap);

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
      countrycodes: "br",
    });

    newMap.addControl(searchControl);

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
    mapInstanceRef.current = newMap;
    clusterGroupRef.current = clusterGroup;
    onMapReady(newMap, clusterGroup);

    return () => {
      newMap.remove();
      mapInstanceRef.current = null;
      clusterGroupRef.current = null;
    };
  }, []);

  // Atualizar marcadores
  useEffect(() => {
    if (!mapInstanceRef.current || !clusterGroupRef.current) return;

    clusterGroupRef.current.clearLayers();

    occurrences.forEach((occ) => {
      const marker = L.marker([occ.lat, occ.lng], {
        icon: createCustomIcon(getMarkerColor(occ.status)),
      });

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

      clusterGroupRef.current!.addLayer(marker);
    });

    if (occurrences.length > 0) {
      const bounds = clusterGroupRef.current.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [occurrences, getMarkerColor, createCustomIcon]);

  return (
    <div className="map-container-wrapper">
      <div ref={mapRef} className="leaflet-map" />
    </div>
  );
};

export default MapContainer;