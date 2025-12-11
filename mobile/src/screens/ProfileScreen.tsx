// screens/ProfileScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }: any) {
  const { user, logout, loading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Sair da Aplicação",
      "Tem certeza que deseja fazer logout?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            setLoggingOut(true);
            await logout();
            setLoggingOut(false);
          },
        },
      ]
    );
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ecdc4" />
      </View>
    );
  }

  const userInitials = user.nome
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "SI";

  const statusColor =
    user.status === "ATIVO"
      ? "#10b981"
      : user.status === "PENDENTE"
        ? "#f59e0b"
        : "#ef4444";

  const statusLabel =
    user.status === "ATIVO"
      ? "Ativo"
      : user.status === "PENDENTE"
        ? "Pendente"
        : "Inativo";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
        </View>

        {/* Avatar Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitials}</Text>
            </View>
            <View
              style={[styles.statusIndicator, { backgroundColor: statusColor }]}
            />
          </View>

          <View style={styles.userBasicInfo}>
            <Text style={styles.userName}>{user.nome}</Text>
            <Text style={styles.userRole}>{user.cargo}</Text>
            <View style={styles.statusBadgeContainer}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColor + "20" },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: statusColor },
                  ]}
                />
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {statusLabel}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>

          <View style={styles.infoCard}>
            {/* Email */}
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail-outline" size={20} color="#4ecdc4" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Telefone */}
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call-outline" size={20} color="#4ecdc4" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{user.telefone || "N/A"}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Cargo */}
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="briefcase-outline" size={20} color="#4ecdc4" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Cargo</Text>
                <Text style={styles.infoValue}>{user.cargo}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Departamento */}
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="business-outline" size={20} color="#4ecdc4" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Departamento</Text>
                <Text style={styles.infoValue}>{user.departamento}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Permissions Section */}
        {user.permissoes && user.permissoes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Permissões</Text>

            <View style={styles.permissionsContainer}>
              {user.permissoes.map((permissao, index) => (
                <View key={index} style={styles.permissionBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#10b981"
                  />
                  <Text style={styles.permissionText}>{permissao}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <View style={styles.accountCard}>
            {/* Data de Criação */}
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Membro desde</Text>
                <Text style={styles.infoValue}>
                  {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Último Acesso */}
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="time-outline" size={20} color="#9ca3af" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Último acesso</Text>
                <Text style={styles.infoValue}>
                  {new Date(user.ultimoAcesso).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert("Info", "Funcionalidade em breve")}
          >
            <Ionicons name="key-outline" size={20} color="#6b7280" />
            <Text style={styles.actionButtonText}>Alterar Senha</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert("Info", "Funcionalidade em breve")}
          >
            <Ionicons name="notifications-outline" size={20} color="#6b7280" />
            <Text style={styles.actionButtonText}>Notificações</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert("Info", "Funcionalidade em breve")}
          >
            <Ionicons name="help-circle-outline" size={20} color="#6b7280" />
            <Text style={styles.actionButtonText}>Suporte</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <ActivityIndicator color="#ef4444" size="small" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text style={styles.logoutButtonText}>Sair da Aplicação</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>PI Bombeiro v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            © 2024 Corpo de Bombeiros - Recife/PE
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
  },

  /* Avatar Card */
  avatarCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4ecdc4",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: "#fff",
  },
  userBasicInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10,
  },
  statusBadgeContainer: {
    alignSelf: "flex-start",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  /* Section */
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6b7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  /* Info Card */
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  accountCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(78, 205, 196, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "600",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
  },

  /* Permissions */
  permissionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  permissionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#d1fae5",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  permissionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#065f46",
  },

  /* Action Button */
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 12,
  },

  /* Logout Section */
  logoutSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fecaca",
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ef4444",
  },

  /* Footer */
  footer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: "#d1d5db",
    fontWeight: "600",
  },
  footerSubtext: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
  },
});