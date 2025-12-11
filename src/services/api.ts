import axios from 'axios';

// URL do deploy no Railway (SEM /api no final)
export const baseURL = 'https://backendnovissimo-production.up.railway.app';

const api = axios.create({
  baseURL: `${baseURL}/api`,
});

// Interceptor: Pega o token do localStorage e anexa na requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;