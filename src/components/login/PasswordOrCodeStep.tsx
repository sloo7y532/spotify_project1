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
        dispatch(loginFailure("Please enter your email/username and password."));
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

      let errorMessage = "An error occurred during login. Please try again.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = "The email or password is incorrect.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "The email format is invalid.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "You have tried to login multiple times. Please wait a moment or reset your password.";
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
        <span>Enter your password for</span><br />{loginIdentifier}
        </h2>
      </div>

      <form onSubmit={handleLogin}>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
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
        {loading && <p className="loading-message">...Loading</p>}

        <button
          type="submit"
          className="primary-button"
          disabled={loading || !password.trim()}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default PasswordOrCodeStep;