// screens/LoginScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Erro", "Email inválido");
      return;
    }

    try {
      await login(email, senha);
    } catch (error: any) {
      Alert.alert(
        "Erro no login",
        error.response?.data?.message ||
          "Credenciais inválidas. Verifique seu email e senha."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
              <Ionicons name="shield-checkmark" size={60} color="#4ecdc4" />
            </View>
          </View>

          {/* Título */}
          <Text style={styles.title}>SISOCC</Text>
          <Text style={styles.subtitle}>Sistema de Ocorrências</Text>
          <Text style={styles.description}>
            Gerencie ocorrências do Corpo de Bombeiros
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#9ca3af"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#d1d5db"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Senha Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#9ca3af"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#d1d5db"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showPassword}
              autoCorrect={false}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#9ca3af"
              />
            </TouchableOpacity>
          </View>

          {/* Botão Login */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Entrar</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Link Recuperar Senha */}
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {/* Registro */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Solicite acesso</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            © 2024 Corpo de Bombeiros - Recife/PE
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },

  /* Logo */
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(78, 205, 196, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  /* Título */
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 20,
  },

  /* Inputs */
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#f9fafb",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },

  /* Botão */
  button: {
    height: 56,
    backgroundColor: "#4ecdc4",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  /* Links */
  forgotPasswordContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: "#4ecdc4",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Registro */
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  registerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  registerLink: {
    fontSize: 14,
    color: "#4ecdc4",
    fontWeight: "700",
  },

  /* Footer */
  footer: {
    alignItems: "center",
    paddingTop: 16,
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
