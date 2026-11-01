import axios from 'axios';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://reelflow-5s62.onrender.com').replace(/\/$/, '');

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // Send session cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

// Request interceptor — attach stored token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('reelflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('reelflow_token');
      if (
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
