// src/components/auth/PasswordStep.tsx

// Import React and core hooks for state management.
import React, { useState } from 'react';
// Imports for navigation (react-router-dom) and icon components (react-icons).
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// Imports for Redux state management (custom hooks and auth slice actions).
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setSignupPassword } from '../../store/slices/authSlice.ts';
// Import for internationalization (i18n).
import { useTranslation } from 'react-i18next';

// PasswordStep component for creating a password during signup.
const PasswordStep: React.FC = () => {
  // State to manage the password input value.
  const [password, setPassword] = useState('');
  // State to toggle password visibility.
  const [showPassword, setShowPassword] = useState(false);
  // Redux state selector for loading status.
  const { loading } = useAppSelector(state => state.auth);
  // Redux dispatch hook to send actions.
  const dispatch = useAppDispatch();
  // Navigation hook for programmatic routing.
  const navigate = useNavigate();
  // Translation hook for i18n.
  const { t } = useTranslation();

  // Password validation rules: minimum length, contains a letter, contains number/special character.
  const hasMinLength = password.length >= 10;
  const hasChar = /[a-zA-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);

  // Overall form validity based on all password requirements.
  const isFormValid = hasMinLength && hasChar && hasNumberOrSpecial;

  // Handler for the "Next" button click.
  const handleNext = () => {
    // If password meets all validation criteria, save it to Redux state and navigate to profile step.
    if (isFormValid) {
      dispatch(setSignupPassword(password));
      navigate('/signup/profile');
    }
  };

  // Renders the password input form, visibility toggle, and password requirements.
  return (
    <div className="signup-step-content">
      {/* Header section with back arrow and step title. */}
      <div className="signup-step-header">
        <span onClick={() => navigate('/signup')} className="back-arrow">&#8249;</span>
        <h2 className="step-title">
          {t('Step 1 of 3')}
          <br/>
          {t('Create a password')}
        </h2>
      </div>

      {/* Password input field with label and visibility toggle. */}
      <label htmlFor="password" className="input-label">{t('Password')}</label>
      <div className="password-input-wrapper">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'} // Toggles between text and password type.
          className="input-field"
          placeholder={t('Enter password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Updates password state on change.
        />
        <span
          className="password-toggle-icon"
          onClick={() => setShowPassword(!showPassword)} // Toggles password visibility.
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Icon changes based on visibility. */}
        </span>
      </div>

      {/* List of password requirements with dynamic 'valid' class based on validation. */}
      <ul className="password-requirements">
        <li className={hasChar ? 'valid' : ''}>
          <span className="check-icon">{hasChar ? '✓' : ''}</span>
          {t('One letter (A-Z or a-z)')}
        </li>
        <li className={hasNumberOrSpecial ? 'valid' : ''}>
          <span className="check-icon">{hasNumberOrSpecial ? '✓' : ''}</span>
          {t('One number or special character (example: !? &%)')}
        </li>
        <li className={hasMinLength ? 'valid' : ''}>
          <span className="check-icon">{hasMinLength ? '✓' : ''}</span>
          {t('At least 10 characters')}
        </li>
      </ul>

      {/* "Next" button, disabled if form is invalid or loading. */}
      <button
        onClick={handleNext}
        className="primary-button"
        disabled={!isFormValid || loading}
      >
        {loading ? t('Loading...') : t('Next')}
      </button>
    </div>
  );
};

// Export the component for use in signup flow.
export default PasswordStep;