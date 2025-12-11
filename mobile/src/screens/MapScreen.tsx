// screens/MapScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import api from "../services/api";

interface Occurrence {
  id: string;
  tipo: string;
  local: string;
  endereco: string;
  descricao: string;
  prioridade: string;
  latitude: number;
  longitude: number;
}

const RECIFE_CENTER = {
  lat: -8.0476,
  lng: -34.877,
};

export default function MapScreen({ navigation }: any) {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [webViewKey, setWebViewKey] = useState(0);

  const loadOccurrences = async () => {
    try {
      const response = await api.get("/occurrences");
      const data = response.data.data || [];

      const processed = data.map((occ: any) => ({
        id: occ.id,
        tipo: occ.tipo || "OUTROS",
        local: occ.local || "Sem local",
        endereco: occ.endereco || "Sem endereço",
        descricao: occ.descricao || "",
        prioridade: occ.prioridade || "MEDIA",
        latitude: parseFloat(occ.latitude) || RECIFE_CENTER.lat,
        longitude: parseFloat(occ.longitude) || RECIFE_CENTER.lng,
      }));

      setOccurrences(processed);
      setWebViewKey((k) => k + 1);
      setLoading(false);
    } catch (error) {
      console.error("Erro:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOccurrences();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadOccurrences();
    });

    const timer = setInterval(loadOccurrences, 15000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [navigation]);

  const getColor = (prioridade: string) => {
    const colors: any = {
      CRITICA: "#7c2d12",
      ALTA: "#ef4444",
      MEDIA: "#f59e0b",
      BAIXA: "#10b981",
    };
    return colors[prioridade] || "#6b7280";
  };

  const filtered = filterStatus
    ? occurrences.filter((o) => o.prioridade === filterStatus)
    : occurrences;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"><\/script>
      <style>
        * { margin: 0; padding: 0; }
        body { font-family: sans-serif; }
        #map { width: 100%; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([${RECIFE_CENTER.lat}, ${
    RECIFE_CENTER.lng
  }], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19
        }).addTo(map);

        const markers = ${JSON.stringify(filtered)};
        
        markers.forEach(m => {
          const color = '${JSON.stringify({
            CRITICA: "#7c2d12",
            ALTA: "#ef4444",
            MEDIA: "#f59e0b",
            BAIXA: "#10b981",
          })}';
          
          const getColor = (p) => {
            const c = JSON.parse(color);
            return c[p] || '#6b7280';
          };

          L.circleMarker([m.latitude, m.longitude], {
            radius: 8,
            fillColor: getColor(m.prioridade),
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          })
          .bindPopup('<b>' + m.tipo + '</b><br>' + m.local + '<br><small>' + m.prioridade + '</small>')
          .addTo(map);
        });
      </script>
    </body>
    </html>
  `;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ecdc4" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        key={webViewKey}
        style={styles.map}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
      />

      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          <TouchableOpacity
            style={[styles.btn, !filterStatus && styles.btnActive]}
            onPress={() => setFilterStatus(null)}
          >
            <Text style={!filterStatus ? styles.btnTextActive : styles.btnText}>
              Todas ({occurrences.length})
            </Text>
          </TouchableOpacity>

          {["CRITICA", "ALTA", "MEDIA", "BAIXA"].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.btn, filterStatus === p && styles.btnActive]}
              onPress={() => setFilterStatus(p)}
            >
              <View style={[styles.dot, { backgroundColor: getColor(p) }]} />
              <Text
                style={
                  filterStatus === p ? styles.btnTextActive : styles.btnText
                }
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.getParent()?.navigate("Occurrences", {
            screen: "AddOccurrence",
          });
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#999", marginTop: 10 },
  map: { flex: 1 },
  filterBar: {
    position: "absolute",
    top: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 32,
  },
  filters: {
    gap: 8,
    paddingHorizontal: 8,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
  },
  btnActive: {
    backgroundColor: "#4ecdc4",
    borderColor: "#4ecdc4",
  },
  btnText: { fontSize: 12, fontWeight: "600", color: "#666" },
  btnTextActive: { fontSize: 12, fontWeight: "600", color: "#fff" },
  dot: { width: 8, height: 8, borderRadius: 4 },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4ecdc4",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});
