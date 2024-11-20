// src/store/slices/socketSlice.js
import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    isConnected: false,
    onlineUsers: []
  },
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    updateOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    }
  }
});

export const { setConnected, updateOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer;