import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";

// Cores dos marcadores por status
export const getMarkerColor = (status: string): string => {
  const normalized = (status || "").toLowerCase();
  if (normalized.includes("novo")) return "#3b82f6";
  if (normalized.includes("análise") || normalized.includes("analise")) return "#f59e0b";
  if (normalized.includes("concluído") || normalized.includes("concluido")) return "#10b981";
  return "#6b7280";
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

// --- NOVA FUNÇÃO DE GEOCODIFICAÇÃO (Retorna lat/lng) ---
export const geocodeAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
  if (!address) return null;
  
  const provider = new OpenStreetMapProvider();
  // Adiciona contexto para melhorar a busca
  const query = `${address}, Pernambuco, Brasil`;

  try {
    const results = await provider.search({ query });
    if (results && results.length > 0) {
      return { lat: results[0].y, lng: results[0].x };
    }
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
  }
  return null;
};

// Buscar endereço e mover o mapa (Função visual)
export const searchAddress = async (
  searchQuery: string,
  map: L.Map | null
): Promise<boolean> => {
  if (!map || !searchQuery.trim()) return false;

  const coords = await geocodeAddress(searchQuery);

  if (coords) {
    // Validação simples para manter foco em PE (aprox)
    const isPernambuco =
      coords.lat >= -9.5 && coords.lat <= -7.0 &&
      coords.lng >= -41.5 && coords.lng <= -34.0;

    if (!isPernambuco) {
      alert("⚠️ Endereço encontrado fora de Pernambuco/Recife. Verifique se está correto.");
    }

    map.setView([coords.lat, coords.lng], 16);

    const tempMarker = L.marker([coords.lat, coords.lng])
      .addTo(map)
      .bindPopup(`<strong>📍 Resultado da Busca</strong>`)
      .openPopup();

    setTimeout(() => {
      map.removeLayer(tempMarker);
    }, 5000);

    return true;
  } else {
    alert("Endereço não encontrado. Tente ser mais específico.");
    return false;
  }
};

export const calculateFilterCounts = (occurrences: any[]) => {
  const normalize = (s: string) => (s || "").toLowerCase();
  return {
    all: occurrences.length,
    novo: occurrences.filter((occ) => normalize(occ.status).includes("novo")).length,
    emAnalise: occurrences.filter((occ) => normalize(occ.status).includes("analise")).length,
    concluido: occurrences.filter((occ) => normalize(occ.status).includes("concluido")).length,
  };
};