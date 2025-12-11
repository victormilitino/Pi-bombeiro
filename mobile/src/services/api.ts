import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ URL PRODUÇÃO - Backend na Railway
const API_URL = "https://backendnovissimo-production.up.railway.app/api";

// Para desenvolvimento local, descomente a linha abaixo e comente a acima
// const API_URL = "http://192.168.0.29:3001/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para handle de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      // Aqui você pode disparar uma ação pra fazer logout
    }
    return Promise.reject(error);
  }
);

export default api;