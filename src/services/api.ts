import axios from 'axios';

// A porta do seu backend
export const baseURL = 'http://localhost:3001';

const api = axios.create({
  baseURL: `${baseURL}/api`,
});

// Interceptor: Pega o token do localStorage e anexa na requisição
api.interceptors.request.use((config) => {
  // ATENÇÃO: Quando fizer login, salve o token assim: localStorage.setItem('token', valorDoToken)
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;