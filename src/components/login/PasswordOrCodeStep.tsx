// src/components/login/PasswordOrCodeStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../store/slices/authSlice.ts';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase/firebase.js';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordOrCodeStep: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, loginIdentifier } = useAppSelector(state => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    dispatch(clearError());

    const authInstance = getAuth(app);

    try {
      console.log("Attempting login with identifier:", loginIdentifier); // <--- أضف هذا
      if (!loginIdentifier || !password) {
        dispatch(loginFailure("الرجاء إدخال البريد الإلكتروني/اسم المستخدم وكلمة المرور."));
        return;
      }
      const userCredential = await signInWithEmailAndPassword(authInstance, loginIdentifier, password);
      const user = userCredential.user;
      dispatch(loginSuccess({ id: user.uid, email: user.email, token: await user.getIdToken() }));
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      // <--- تأكد أن الـ console.error هذا موجود هنا
      console.error("Firebase Login Error caught in component:", err);
      console.error("Firebase Login Error message:", err.message);

      let errorMessage = "حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "صيغة البريد الإلكتروني غير صحيحة.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "لقد حاولت تسجيل الدخول عدة مرات. الرجاء الانتظار قليلاً أو إعادة تعيين كلمة المرور.";
      }
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="login-step-content">
      {/* سهم الرجوع للمرحلة الأولى */}
      <div className="signup-step-header">
        <span onClick={() => navigate('/login')} className="back-arrow">&#8249;</span>
        <h2 className="step-title">
          <>إدخال كلمة المرور لـ<br />{loginIdentifier}</>
        </h2>
      </div>

      <form onSubmit={handleLogin}>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="كلمة المرور"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className="error-message">{error}</p>}
        {loading && <p className="loading-message">جاري التحقق...</p>}

        <button
          type="submit"
          className="primary-button"
          disabled={loading || !password.trim()}
        >
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
};

export default PasswordOrCodeStep;