// src/services/socket.services.js
import { io } from 'socket.io-client';
import { getAuthToken } from '../utils/Storage';

class SocketService {
  socket = null;

  connect() {
    // Dodaj više opcija za povezivanje
    this.socket = io(import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8000', {
      auth: {
        token: getAuthToken()
      },
      transports: ['websocket', 'polling'], // Dodaj ovo
      reconnectionAttempts: 5, // Dodaj ovo
      reconnectionDelay: 1000, // Dodaj ovo
      timeout: 10000 // Dodaj ovo
    });

    // Dodaj error handling
    this.socket.on('connect_error', (error) => {
      console.warn('Socket connection error:', error);
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();