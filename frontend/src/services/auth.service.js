// src/services/auth.service.js
import api from './api';

class AuthService {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async verifyPin(email, pin) {
    const response = await api.post('/auth/verify-pin', { email, pin });
    return response.data;
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();