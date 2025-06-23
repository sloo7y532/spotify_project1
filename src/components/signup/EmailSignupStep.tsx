// src/components/auth/EmailSignupStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setSignupEmail, setError, clearError } from '../../store/slices/authSlice.ts';
import { useTranslation } from 'react-i18next'; 
import * as i18nRaw from "../../locals/en-translation.json";
const i18n = (i18nRaw as any).default || i18nRaw;

const EmailSignupStep: React.FC = () => {
  const [email, setEmail] = useState('');
  const { loading, error } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(); 

  const handleNext = () => {
    dispatch(clearError());

    if (email.trim() && email.includes('@') && email.includes('.')) {
      dispatch(setSignupEmail(email));
      navigate('/signup/password');
    } else {
      dispatch(setError(t('Please enter a valid email.')));
    }
  };

  return (
    <div className="signup-step-content">
      <h1 className="signup-title">{t('Sign up to start listening')}</h1> 

      <label htmlFor="email" className="input-label">{t('Email address')}</label> 
      <input
        id="email"
        type="email"
        placeholder={t('Email address')} 
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
        {loading ? t('...Loading') : t('Next')} 
      </button>
      <p className="login-link">
        {t('Already have an account ?')} <a href="/login">{t('Log in here.')}</a> 
      </p>
    </div>
  );
};

export default EmailSignupStep;