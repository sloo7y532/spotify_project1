import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setSignupEmail, setError, clearError } from '../../store/slices/authSlice.ts';
import { useTranslation } from 'react-i18next';
// import * as i18nRaw from "../../locals/en-translation.json";
// const i18n = (i18nRaw as any).default || i18nRaw; 

// EmailSignupStep component for the email input during signup.
const EmailSignupStep: React.FC = () => {
  // State for the email input field.
  const [email, setEmail] = useState('');
  // Redux state selectors for loading status and error messages from the auth slice.
  const { loading, error } = useAppSelector(state => state.auth);
  // Redux dispatch hook to send actions.
  const dispatch = useAppDispatch();
  // Navigation hook to programmatically change routes.
  const navigate = useNavigate();
  // Translation hook for i18n.
  const { t } = useTranslation();

  // Handler for the "Next" button click.
  const handleNext = () => {
    dispatch(clearError()); // Clear any previous errors.

    // Validate email format (non-empty, contains '@' and '.').
    if (email.trim() && email.includes('@') && email.includes('.')) {
      dispatch(setSignupEmail(email)); // Save email to Redux state.
      navigate('/signup/password'); // Navigate to the password step.
    } else {
      dispatch(setError(t('Please enter a valid email.'))); // Set error message if validation fails.
    }
  };

  // Renders the email input form and related elements.
  return (
    <div className="signup-step-content">
      {/* Signup title */}
      <h1 className="signup-title">{t('Sign up to start listening')}</h1>

      {/* Email input field with label and dynamic value/change handler. */}
      <label htmlFor="email" className="input-label">{t('Email address')}</label>
      <input
        id="email"
        type="email"
        placeholder={t('Email address')}
        className="input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {/* Displays error message if present. */}
      {error && <p className="error-message">{error}</p>}

      {/* "Next" button with dynamic text and disabled state based on loading/email validity. */}
      <button
        onClick={handleNext}
        className="primary-button"
        disabled={loading || !email.trim()}
      >
        {loading ? t('...Loading') : t('Next')}
      </button>

      {/* Link for existing users to log in. */}
      <p className="login-link">
        {t('Already have an account ?')} <a href="/login">{t('Log in here.')}</a>
      </p>
    </div>
  );
};

// Export the component for use in other parts of the application.
export default EmailSignupStep;