import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";

// Cores dos marcadores por status
export const getMarkerColor = (status: string): string => {
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
export const createCustomIcon = (color: string): L.DivIcon => {
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

// Buscar endereço
export const searchAddress = async (
  searchQuery: string,
  map: L.Map | null
): Promise<boolean> => {
  if (!map || !searchQuery.trim()) return false;

  const provider = new OpenStreetMapProvider();

  const fullQuery = searchQuery.includes("PE") || searchQuery.includes("Pernambuco")
    ? searchQuery
    : `${searchQuery}, Pernambuco, Brasil`;

  const results = await provider.search({ query: fullQuery });

  if (results && results.length > 0) {
    const peResults = results.filter(
      (r) =>
        r.label.includes("Pernambuco") ||
        r.label.includes("PE") ||
        r.label.includes("Recife")
    );

    const result = peResults.length > 0 ? peResults[0] : results[0];

    const isPernambuco =
      result.y >= -9.5 &&
      result.y <= -7.0 &&
      result.x >= -41.5 &&
      result.x <= -34.0;

    if (!isPernambuco) {
      alert(
        "⚠️ Endereço fora de Pernambuco. Tente especificar o endereço em Recife ou Pernambuco."
      );
      return false;
    }

    map.setView([result.y, result.x], 16);

    const tempMarker = L.marker([result.y, result.x])
      .addTo(map)
      .bindPopup(`<strong>📍 ${result.label}</strong>`)
      .openPopup();

    setTimeout(() => {
      map.removeLayer(tempMarker);
    }, 5000);

    return true;
  } else {
    alert("Endereço não encontrado. Tente outro.");
    return false;
  }
};

// Adicionar coordenadas às ocorrências
export const addCoordinatesToOccurrences = (
  occurrences: any[],
  centerLat: number,
  centerLng: number
) => {
  return occurrences.map((occ) => ({
    ...occ,
    lat: centerLat + (Math.random() - 0.5) * 0.1,
    lng: centerLng + (Math.random() - 0.5) * 0.1,
  }));
};

// Calcular contagens de filtros
export const calculateFilterCounts = (occurrences: any[]) => {
  return {
    all: occurrences.length,
    novo: occurrences.filter((occ) => occ.status === "Novo").length,
    emAnalise: occurrences.filter((occ) => occ.status === "Em Análise").length,
    concluido: occurrences.filter((occ) => occ.status === "Concluído").length,
  };
};