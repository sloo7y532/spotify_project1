// src/components/auth/PasswordStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setSignupPassword } from '../../store/slices/authSlice.ts';
import { useTranslation } from 'react-i18next'; // تم إضافة هذا الاستيراد

const PasswordStep: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loading } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(); // تم تعريف دالة الترجمة هنا

  const hasMinLength = password.length >= 10;
  const hasChar = /[a-zA-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);

  const isFormValid = hasMinLength && hasChar && hasNumberOrSpecial;

  const handleNext = () => {
    if (isFormValid) {
      dispatch(setSignupPassword(password));
      navigate('/signup/profile');
    }
  };

  return (
    <div className="signup-step-content">
      <div className="signup-step-header">
        <span onClick={() => navigate('/signup')} className="back-arrow">&#8249;</span>
        <h2 className="step-title">
          {t('Step 1 of 3')}
          <br/>
          {t('Create a password')} {/* تم تعريب العنوان */}
        </h2>
      </div>

      <label htmlFor="password" className="input-label">{t('Password')}</label> {/* تم تعريب الليبل */}
      <div className="password-input-wrapper">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          className="input-field"
          placeholder={t('Enter password')} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="password-toggle-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <ul className="password-requirements">
        <li className={hasChar ? 'valid' : ''}>
          <span className="check-icon">{hasChar ? '✓' : ''}</span>
          {t('One letter (A-Z or a-z)')} {/* تم تعريب الشرط */}
        </li>
        <li className={hasNumberOrSpecial ? 'valid' : ''}>
          <span className="check-icon">{hasNumberOrSpecial ? '✓' : ''}</span>
          {t('One number or special character (example: !? &%)')} {/* تم تعريب الشرط */}
        </li>
        <li className={hasMinLength ? 'valid' : ''}>
          <span className="check-icon">{hasMinLength ? '✓' : ''}</span>
          {t('At least 10 characters')} {/* تم تعريب الشرط */}
        </li>
      </ul>

      <button
        onClick={handleNext}
        className="primary-button"
        disabled={!isFormValid || loading}
      >
        {loading ? t('Loading...') : t('Next')} {/* تم تعريب نص الزر */}
      </button>
    </div>
  );
};

export default PasswordStep;