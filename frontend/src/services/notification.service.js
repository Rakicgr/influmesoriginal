// src/services/notification.service.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

class NotificationService {
  messaging = null;

  init() {
    // Provjeri jesu li sve env varijable dostupne
    if (!import.meta.env.VITE_FIREBASE_API_KEY ||
        !import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
        !import.meta.env.VITE_FIREBASE_PROJECT_ID ||
        !import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) {
      console.warn('Firebase configuration is missing');
      return;
    }

    try {
      const app = initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
      });
      
      this.messaging = getMessaging(app);
      this.requestPermission();
      this.onMessage();
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }

  async requestPermission() {
    try {
      const token = await getToken(this.messaging);
      return token;
    } catch (err) {
      console.error('Failed to get notification permission:', err);
    }
  }

  onMessage() {
    if (!this.messaging) return;
    
    onMessage(this.messaging, (payload) => {
      console.log('Message received:', payload);
    });
  }
}

export default new NotificationService();