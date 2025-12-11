import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { User, AuthContextType, RegisterData, LoginResponse } from "../types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("token");
      const savedUser = await AsyncStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
        // Atualizar dados do usuário
        await getCurrentUser();
      }
    } catch (error) {
      console.error("Erro ao carregar dados salvos:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email: string, senha: string) => {
    setLoading(true);
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        senha,
      });

      const { token: newToken, user: newUser } = response.data.data;

      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);

      // Salvar no storage
      await AsyncStorage.setItem("token", newToken);
      await AsyncStorage.setItem("user", JSON.stringify(newUser));

      console.log("✅ Login realizado com sucesso!");
    } catch (error: any) {
      console.error("❌ Erro no login:", error.response?.data);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", userData);

      console.log("✅ Usuário registrado! Aguarde aprovação do administrador.");

      return response.data;
    } catch (error: any) {
      console.error("❌ Erro no registro:", error.response?.data);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await api.get<{ success: boolean; data: User }>(
        "/auth/me"
      );

      if (response.data.data) {
        setUser(response.data.data);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.data));
      }
    } catch (error: any) {
      console.error("❌ Erro ao buscar usuário:", error.response?.data);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error);
    } finally {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      console.log("✅ Logout realizado!");
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}