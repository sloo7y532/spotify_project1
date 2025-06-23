// src/components/login/EmailOrPhoneStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setLoginIdentifier, clearError, setError } from '../../store/slices/authSlice.ts';
import { useTranslation } from 'react-i18next'; // تم إضافة هذا الاستيراد

const EmailOrPhoneStep: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const { t } = useTranslation(); // تم تعريف دالة الترجمة هنا

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (identifier.trim()) {
      dispatch(setLoginIdentifier(identifier.trim()));
      navigate('password-or-code');
    } else {
      // تم تعريب رسالة الخطأ
      dispatch(setError(t("Please enter your email or username.")));
    }
  };

  return (
    <div className="login-step-content">
      <h1 className="login-title">{t('Log in to Spotify')}</h1> {/* تم تعريب العنوان */}

      <form onSubmit={handleContinue}>
        <label htmlFor="identifier" className="input-label">{t('Email or Username')}</label> {/* تم تعريب الليبل */}
        <input
          id="identifier"
          type="text"
          placeholder={t('Email or Username')} 
          className="input-field"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}
        {loading && <p className="loading-message">{t('...Loading')}</p>} {/* تم تعريب نص التحميل */}

        <button
          type="submit"
          className="primary-button"
          disabled={loading || !identifier.trim()}
        >
          {t('Continue')} 
        </button>
      </form>

      <p className="signup-prompt">
        {t("Don't have an account ?")} <a href="/signup">{t('Sign up for Spotify')}</a> {/* تم تعريب نص الرابط */}
      </p>
    </div>
  );
};

export default EmailOrPhoneStep;