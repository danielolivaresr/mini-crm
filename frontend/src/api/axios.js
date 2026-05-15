import axios from 'axios';

// Instancia preconfigurada para llamar a nuestra API
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor: añade el token JWT a TODAS las peticiones automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: si recibimos 401 (token caducado), limpiar y redirigir al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;