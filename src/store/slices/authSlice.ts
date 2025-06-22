// src/store/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  id: string;
  email: string | null;
  token: string | null;
  // displayName?: string | null; 
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signupEmail: string;
  signupPassword: string;
  signupProfile: {
    name: string;
    day: string;
    month: string;
    year: string;
    gender: string;
  };
  loginIdentifier: string;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  signupEmail: '',
  signupPassword: '',
  signupProfile: {
    name: '',
    day: '',
    month: '',
    year: '',
    gender: '',
  },
  loginIdentifier: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ------------------------------------
    // ----- Signup Actions -----
    // ------------------------------------
    signupStart(state) {
      state.loading = true;
      state.error = null;
    },

    signupSuccess(state, action: PayloadAction<AuthUser>) {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
      state.signupEmail = '';
      state.signupPassword = '';
      state.signupProfile = { name: '', day: '', month: '', year: '', gender: '' };
    },
    signupFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setSignupEmail(state, action: PayloadAction<string>) {
      state.signupEmail = action.payload;
    },
    setSignupPassword(state, action: PayloadAction<string>) {
      state.signupPassword = action.payload;
    },
    setSignupProfile(state, action: PayloadAction<AuthState['signupProfile']>) {
      state.signupProfile = action.payload;
    },
    clearSignupData(state) {
      state.signupEmail = '';
      state.signupPassword = '';
      state.signupProfile = { name: '', day: '', month: '', year: '', gender: '' };
    },

    // ------------------------------------
    // ----- Login Actions (Updated for Flow) -----
    // ------------------------------------
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
      state.loginIdentifier = '';
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
    },
    logout(state) {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.loginIdentifier = '';
      state.signupEmail = '';
      state.signupPassword = '';
      state.signupProfile = { name: '', day: '', month: '', year: '', gender: '' };
    },
    clearError(state) {
      state.error = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setLoginIdentifier(state, action: PayloadAction<string>) {
      state.loginIdentifier = action.payload;
    },
    clearLoginData(state) {
      state.loginIdentifier = '';
    }
  },
});

export const {
  signupStart,
  signupSuccess,
  signupFailure,
  setSignupEmail,
  setSignupPassword,
  setSignupProfile,
  clearSignupData,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setError,
  setLoginIdentifier,
  clearLoginData,
} = authSlice.actions;

export default authSlice.reducer;