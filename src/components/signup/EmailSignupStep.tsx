// src/components/auth/EmailSignupStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setSignupEmail } from '../../store/slices/authSlice.ts'; 

const EmailSignupStep: React.FC = () => {
  const [email, setEmail] = useState('');
  const { loading, error } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    if (email.trim() && email.includes('@') && email.includes('.')) {
      dispatch(setSignupEmail(email)); 
      navigate('/signup/password');
    } else {
      alert('Please enter a valid email.');
    }
  };

  return (
    <div className="signup-step-content">
      <h1 className="signup-title">Sign up to start listening</h1>

      <label htmlFor="email" className="input-label">Email address      </label>
      <input
        id="email"
        type="email"
        placeholder="Email address"
        className="input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}

      <button
        onClick={handleNext}
        className="primary-button"
        disabled={loading || !email.trim()}
      >
        {loading ? '...Loading' : 'Next'}
      </button>
      <p className="login-link">
      Already have an account ? <a href="/login">Log in here.</a>
      </p>
    </div>
  );
};

export default EmailSignupStep;