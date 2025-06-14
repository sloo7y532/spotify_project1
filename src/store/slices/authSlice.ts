// src/store/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: { id: string; email: string | null; token: string | null } | null;
  loading: boolean;
  error: string | null;
  // --- حقول لتخزين بيانات التسجيل المؤقتة (لـ Signup) ---
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
    signupSuccess(state, action: PayloadAction<{ id: string; email: string | null; token: string | null }>) {
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
    loginSuccess(state, action: PayloadAction<{ id: string; email: string | null; token: string | null }>) {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
      state.loginIdentifier = ''; // مسح معرف الدخول بعد النجاح
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
    },
    clearError(state) {
      state.error = null;
    },
    // --- أكشن جديد لوضع رسالة خطأ محددة ---
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    // --- أكشن لتخزين معرف تسجيل الدخول (البريد الإلكتروني/اسم المستخدم) ---
    setLoginIdentifier(state, action: PayloadAction<string>) {
      state.loginIdentifier = action.payload;
    },
    clearLoginData(state) { // لمسح بيانات تسجيل الدخول المؤقتة
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
  setError, // <--- تم تصدير أكشن setError هنا
  setLoginIdentifier,
  clearLoginData,
} = authSlice.actions;

export default authSlice.reducer;