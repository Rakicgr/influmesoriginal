// src/services/api.js
import axios from 'axios';
import { getAuthToken, removeAuthToken } from '../utils/Storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor za dodavanje auth tokena
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor za rukovanje greškama
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token je istekao ili nije validan
      removeAuthToken();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;