// src/components/login/PasswordOrCodeStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { clearError } from '../../store/slices/authSlice.ts';
import { loginUser } from '../../services/authService.ts'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordOrCodeStep: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, loginIdentifier } = useAppSelector(state => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!loginIdentifier || !password) {
      return;
    }

    try {
      await loginUser(loginIdentifier, password, dispatch); 
      navigate('/dashboard', { replace: true }); 
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <div className="login-step-content">
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