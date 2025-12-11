// screens/DashboardScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface StatusData {
  novas: number;
  emAtendimento: number;
  concluidas: number;
}

interface OccurrenceItem {
  id: string;
  tipo: string;
  endereco: string;
  status: string;
  createdAt: string;
}

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusData, setStatusData] = useState<StatusData>({
    novas: 0,
    emAtendimento: 0,
    concluidas: 0,
  });
  const [recentOccurrences, setRecentOccurrences] = useState<OccurrenceItem[]>(
    []
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadDashboardData();
    });

    const interval = setInterval(loadDashboardData, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigation]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/occurrences");
      const occurrences = response.data.data || [];

      // Status do backend: NOVO, EM_ANALISE, EM_ATENDIMENTO, CONCLUIDO
      const stats = {
        novas: occurrences.filter(
          (o: any) => o.status === "NOVO" || o.status === "EM_ANALISE"
        ).length,
        emAtendimento: occurrences.filter(
          (o: any) => o.status === "EM_ATENDIMENTO"
        ).length,
        concluidas: occurrences.filter((o: any) => o.status === "CONCLUIDO")
          .length,
      };

      setStatusData(stats);
      setRecentOccurrences(
        occurrences.slice(0, 5).map((o: any) => ({
          id: o.id,
          tipo: o.tipo,
          endereco: o.endereco,
          status: o.status,
          createdAt: o.createdAt,
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NOVO":
      case "EM_ANALISE":
        return "#3b82f6";
      case "EM_ATENDIMENTO":
        return "#f59e0b";
      case "CONCLUIDO":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "NOVO":
        return "Novo";
      case "EM_ANALISE":
        return "Análise";
      case "EM_ATENDIMENTO":
        return "Em Atend.";
      case "CONCLUIDO":
        return "Concluído";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Bem-vindo{user?.nome ? ", " + user.nome.split(" ")[0] : ""}! 👋
          </Text>
          <Text style={styles.headerSubtitle}>Resumo de ocorrências</Text>
        </View>
        <View style={styles.headerAvatar}>
          <Text style={styles.avatarText}>
            {user?.nome
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2) || "SI"}
          </Text>
        </View>
      </View>

      {/* Status Container */}
      <View style={styles.statusContainer}>
        <Text style={styles.sectionTitle}>Status das Ocorrências</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ecdc4" />
          </View>
        ) : (
          <View style={styles.statusGrid}>
            {/* Card: Novas */}
            <View style={[styles.statusCard, styles.statusCardNovas]}>
              <View style={styles.statusCardHeader}>
                <Ionicons
                  name="alert-circle-outline"
                  size={24}
                  color="#3b82f6"
                />
              </View>
              <Text style={styles.statusCardNumber}>{statusData.novas}</Text>
              <Text style={styles.statusCardLabel}>Novas</Text>
              <Text style={styles.statusCardDescription}>
                Aguardando análise
              </Text>
            </View>

            {/* Card: Em Atendimento */}
            <View style={[styles.statusCard, styles.statusCardAtendimento]}>
              <View style={styles.statusCardHeader}>
                <Ionicons name="hourglass-outline" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.statusCardNumber}>
                {statusData.emAtendimento}
              </Text>
              <Text style={styles.statusCardLabel}>Em Atendimento</Text>
              <Text style={styles.statusCardDescription}>
                Sendo processadas
              </Text>
            </View>

            {/* Card: Concluídas */}
            <View style={[styles.statusCard, styles.statusCardConcluida]}>
              <View style={styles.statusCardHeader}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={24}
                  color="#10b981"
                />
              </View>
              <Text style={styles.statusCardNumber}>
                {statusData.concluidas}
              </Text>
              <Text style={styles.statusCardLabel}>Concluídas</Text>
              <Text style={styles.statusCardDescription}>Resolvidas</Text>
            </View>
          </View>
        )}
      </View>

      {/* Botão Nova Ocorrência */}
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={styles.newOccurrenceBtn}
          onPress={() => {
            navigation.getParent()?.navigate("Occurrences", {
              screen: "AddOccurrence",
            });
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.newOccurrenceBtnText}>Nova Ocorrência</Text>
        </TouchableOpacity>
      </View>

      {/* Ocorrências Recentes */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Ocorrências Recentes</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.getParent()?.navigate("Occurrences");
            }}
          >
            <Text style={styles.viewAllLink}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {recentOccurrences.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateText}>
              Nenhuma ocorrência registrada
            </Text>
          </View>
        ) : (
          <View style={styles.occurrencesList}>
            {recentOccurrences.map((occurrence, index) => (
              <View
                key={occurrence.id}
                style={[
                  styles.occurrenceItem,
                  index !== recentOccurrences.length - 1 &&
                    styles.occurrenceItemBorder,
                ]}
              >
                <View
                  style={[
                    styles.occurrenceIcon,
                    {
                      backgroundColor: getStatusColor(occurrence.status) + "15",
                    },
                  ]}
                >
                  <Ionicons
                    name="alert-outline"
                    size={18}
                    color={getStatusColor(occurrence.status)}
                  />
                </View>
                <View style={styles.occurrenceInfo}>
                  <Text style={styles.occurrenceType}>{occurrence.tipo}</Text>
                  <Text style={styles.occurrenceAddress} numberOfLines={1}>
                    {occurrence.endereco}
                  </Text>
                  <Text style={styles.occurrenceDate}>
                    {formatDate(occurrence.createdAt)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: getStatusColor(occurrence.status) + "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: getStatusColor(occurrence.status) },
                    ]}
                  >
                    {getStatusLabel(occurrence.status)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Footer Spacing */}
      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 32,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#9ca3af",
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#4ecdc4",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  /* Status Container */
  statusContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
  },
  loadingContainer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  statusGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statusCard: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusCardNovas: {
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  statusCardAtendimento: {
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
  },
  statusCardConcluida: {
    borderLeftWidth: 3,
    borderLeftColor: "#10b981",
  },
  statusCardHeader: {
    marginBottom: 8,
  },
  statusCardNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 2,
  },
  statusCardLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: 2,
  },
  statusCardDescription: {
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: "500",
  },

  /* Action Button */
  actionButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  newOccurrenceBtn: {
    backgroundColor: "#4ecdc4",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  newOccurrenceBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  /* Recent Section */
  recentSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllLink: {
    color: "#4ecdc4",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyState: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  emptyStateText: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 10,
    fontWeight: "500",
  },
  occurrencesList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  occurrenceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  occurrenceItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  occurrenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  occurrenceInfo: {
    flex: 1,
    minWidth: 0,
  },
  occurrenceType: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 1,
  },
  occurrenceAddress: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 2,
  },
  occurrenceDate: {
    fontSize: 10,
    color: "#9ca3af",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    flexShrink: 0,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },

  /* Spacing */
  spacing: {
    height: 20,
  },
});
