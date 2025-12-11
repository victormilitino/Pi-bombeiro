// screens/OccurrencesListScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

interface Occurrence {
  id: string;
  tipo: string;
  endereco: string;
  descricao: string;
  status: "ABERTA" | "EM_ANDAMENTO" | "FECHADA";
  createdAt: string;
  latitude?: number;
  longitude?: number;
  userId: string;
}

type StatusFilter = "TODAS" | "ABERTA" | "EM_ANDAMENTO" | "FECHADA";

export default function OccurrencesListScreen({ navigation }: any) {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [filteredOccurrences, setFilteredOccurrences] = useState<Occurrence[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("TODAS");

  useEffect(() => {
    loadOccurrences();
  }, []);

  useEffect(() => {
    filterOccurrences();
  }, [occurrences, searchText, selectedStatus]);

  const loadOccurrences = async () => {
    setLoading(true);
    try {
      const response = await api.get("/occurrences");
      const data = response.data.data || [];
      setOccurrences(data);
    } catch (error) {
      console.error("Erro ao carregar ocorrências:", error);
      Alert.alert("Erro", "Falha ao carregar ocorrências");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOccurrences();
    setRefreshing(false);
  };

  const filterOccurrences = () => {
    let filtered = occurrences;

    // Filtrar por status
    if (selectedStatus !== "TODAS") {
      filtered = filtered.filter((o) => o.status === selectedStatus);
    }

    // Filtrar por texto de busca
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.tipo.toLowerCase().includes(searchLower) ||
          o.endereco.toLowerCase().includes(searchLower) ||
          o.descricao.toLowerCase().includes(searchLower)
      );
    }

    setFilteredOccurrences(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ABERTA":
        return "#3b82f6";
      case "EM_ANDAMENTO":
        return "#f59e0b";
      case "FECHADA":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ABERTA":
        return "Aberta";
      case "EM_ANDAMENTO":
        return "Em Andamento";
      case "FECHADA":
        return "Fechada";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderOccurrenceItem = ({ item }: { item: Occurrence }) => (
    <TouchableOpacity
      style={styles.occurrenceCard}
      onPress={() =>
        navigation.navigate("OccurrenceDetail", { occurrenceId: item.id })
      }
      activeOpacity={0.7}
    >
      <View style={styles.cardLeft}>
        <View
          style={[
            styles.cardIcon,
            { backgroundColor: getStatusColor(item.status) + "15" },
          ]}
        >
          <Ionicons
            name="alert-outline"
            size={24}
            color={getStatusColor(item.status)}
          />
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.tipo}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.cardAddress}>{item.endereco}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.descricao}
        </Text>
        <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ocorrências</Text>
        <Text style={styles.headerSubtitle}>
          {filteredOccurrences.length} registros
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#9ca3af"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por tipo ou endereço"
          placeholderTextColor="#d1d5db"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={20} color="#d1d5db" />
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filter */}
      <View style={styles.filterContainer}>
        {(["TODAS", "ABERTA", "EM_ANDAMENTO", "FECHADA"] as StatusFilter[]).map(
          (status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                selectedStatus === status && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedStatus === status &&
                    styles.filterButtonTextActive,
                ]}
              >
                {status === "TODAS"
                  ? "Todas"
                  : status === "ABERTA"
                    ? "Abertas"
                    : status === "EM_ANDAMENTO"
                      ? "Em Andamento"
                      : "Fechadas"}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ecdc4" />
          <Text style={styles.loadingText}>Carregando ocorrências...</Text>
        </View>
      ) : filteredOccurrences.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="folder-open-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyStateTitle}>
            Nenhuma ocorrência encontrada
          </Text>
          <Text style={styles.emptyStateSubtitle}>
            {searchText.length > 0
              ? "Tente ajustar sua busca"
              : "Comece adicionando uma nova ocorrência"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOccurrences}
          keyExtractor={(item) => item.id}
          renderItem={renderOccurrenceItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB - Novo Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddOccurrence")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: "500",
  },

  /* Search */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1f2937",
  },

  /* Filter */
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
    overflow: "visible",
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  filterButtonActive: {
    backgroundColor: "#4ecdc4",
    borderColor: "#4ecdc4",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  filterButtonTextActive: {
    color: "#fff",
  },

  /* Loading */
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: "#9ca3af",
    fontWeight: "500",
  },

  /* Empty State */
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 16,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
    textAlign: "center",
  },

  /* List */
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  occurrenceCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    marginRight: 12,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardAddress: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: "#9ca3af",
    lineHeight: 18,
    marginBottom: 6,
  },
  cardDate: {
    fontSize: 11,
    color: "#d1d5db",
  },

  /* FAB */
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4ecdc4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
});