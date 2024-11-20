// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/services/auth.service';
import { setAuthToken, removeAuthToken } from '@/utils/Storage';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      setAuthToken(response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Greška pri prijavi');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Greška pri registraciji');
    }
  }
);

export const verifyPin = createAsyncThunk(
  'auth/verifyPin',
  async ({ email, pin }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyPin(email, pin);
      setAuthToken(response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Neispravan PIN');
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  registrationEmail: null,
  pinVerificationRequired: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.pinVerificationRequired = false;
      state.registrationEmail = null;
      removeAuthToken();
      authService.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
    setRegistrationEmail: (state, action) => {
      state.registrationEmail = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationEmail = action.payload.email;
        state.pinVerificationRequired = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // PIN verification cases
      .addCase(verifyPin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.pinVerificationRequired = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(verifyPin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError, setRegistrationEmail } = authSlice.actions;
export default authSlice.reducer;