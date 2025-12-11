// screens/AddOccurrenceScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

const OCCURRENCE_TYPES = ["RISCO", "INCENDIO", "ACIDENTE", "RESGATE", "OUTROS"];

const PRIORITY_LEVELS = ["BAIXA", "MEDIA", "ALTA", "CRITICA"];

export default function AddOccurrenceScreen({ navigation }: any) {
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [endereco, setEndereco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("MEDIA");
  const [loading, setLoading] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  // Função para converter endereço em coordenadas
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
    try {
      const enderecoCompleto = `${address}, Recife, PE, Brasil`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}&limit=1`,
        {
          headers: {
            'User-Agent': 'SisOcc-App/1.0'
          }
        }
      );
      const data = await response.json();

      if (data.length > 0) {
        console.log('📍 Coordenadas encontradas:', data[0].lat, data[0].lon);
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
    } catch (error) {
      console.log('⚠️ Erro no geocoding:', error);
    }

    // Fallback: centro de Recife
    console.log('⚠️ Usando coordenadas padrão de Recife');
    return { lat: -8.0476, lng: -34.877 };
  };

  const handleAddOccurrence = async () => {
    // Validações simples
    if (!tipo) {
      Alert.alert("Erro", "Selecione um tipo");
      return;
    }
    if (!local.trim()) {
      Alert.alert("Erro", "Preencha o local");
      return;
    }
    if (!endereco.trim()) {
      Alert.alert("Erro", "Preencha o endereço");
      return;
    }
    if (!descricao.trim()) {
      Alert.alert("Erro", "Preencha a descrição");
      return;
    }

    setLoading(true);
    try {
      // Converte o endereço em coordenadas
      const coords = await geocodeAddress(endereco.trim());

      const payload = {
        tipo: tipo,
        local: local.trim(),
        endereco: endereco.trim(),
        descricao: descricao.trim(),
        prioridade: prioridade,
        latitude: coords.lat,
        longitude: coords.lng,
      };

      console.log("Enviando:", payload);

      const response = await api.post("/occurrences", payload);

      Alert.alert("Sucesso", "Ocorrência registrada!", [
        {
          text: "OK",
          onPress: () => {
            setTipo("");
            setLocal("");
            setEndereco("");
            setDescricao("");
            setPrioridade("MEDIA");
            navigation.goBack();
          },
        },
      ]);
    } catch (error: any) {
      console.error("Erro:", error.response?.data || error.message);
      Alert.alert("Erro", error.response?.data?.message || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova Ocorrência</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Tipo */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Tipo <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <Text
                style={tipo ? styles.dropdownText : styles.dropdownPlaceholder}
              >
                {tipo || "Selecione"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </TouchableOpacity>

            {showTypeDropdown && (
              <View style={styles.dropdownMenu}>
                {OCCURRENCE_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={styles.menuItem}
                    onPress={() => {
                      setTipo(t);
                      setShowTypeDropdown(false);
                    }}
                  >
                    <Text style={styles.menuItemText}>{t}</Text>
                    {tipo === t && (
                      <Ionicons name="checkmark" size={20} color="#4ecdc4" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Prioridade */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Prioridade</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
            >
              <Text style={styles.dropdownText}>{prioridade}</Text>
              <Ionicons name="chevron-down" size={20} color="#9ca3af" />
            </TouchableOpacity>

            {showPriorityDropdown && (
              <View style={styles.dropdownMenu}>
                {PRIORITY_LEVELS.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={styles.menuItem}
                    onPress={() => {
                      setPrioridade(p);
                      setShowPriorityDropdown(false);
                    }}
                  >
                    <Text style={styles.menuItemText}>{p}</Text>
                    {prioridade === p && (
                      <Ionicons name="checkmark" size={20} color="#4ecdc4" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Local */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Local <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Próximo à avenida Boa Viagem"
              value={local}
              onChangeText={setLocal}
              editable={!loading}
            />
          </View>

          {/* Endereço */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Endereço <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Rua do Pombal, 57"
              value={endereco}
              onChangeText={setEndereco}
              editable={!loading}
            />
          </View>

          {/* Descrição */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Descrição <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva a ocorrência"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.spacing} />
      </ScrollView>

      {/* Botões */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.buttonSecondaryText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonPrimary, loading && styles.buttonDisabled]}
          onPress={handleAddOccurrence}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-done" size={20} color="#fff" />
              <Text style={styles.buttonPrimaryText}>Registrar</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },

  form: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },

  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  dropdownText: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: "#d1d5db",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: -2,
    marginBottom: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuItemText: {
    fontSize: 14,
    color: "#6b7280",
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: "#1f2937",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 11,
  },

  spacing: {
    height: 100,
  },

  actions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  buttonSecondary: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  buttonSecondaryText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "700",
  },
  buttonPrimary: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4ecdc4",
    flexDirection: "row",
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPrimaryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});