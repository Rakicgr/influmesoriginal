// src/hooks/useSocket.js
import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import socketService from '../services/socket.service';

export const useSocket = () => {
  const dispatch = useDispatch();

  const emit = useCallback((event, data) => {
    if (socketService.socket) {
      socketService.socket.emit(event, data);
    }
  }, []);

  const on = useCallback((event, callback) => {
    if (socketService.socket) {
      socketService.socket.on(event, callback);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (socketService.socket) {
        socketService.socket.removeAllListeners();
      }
    };
  }, []);

  return { emit, on };
};