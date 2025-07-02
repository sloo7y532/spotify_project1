import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setLoginIdentifier, clearError, setError } from '../../store/slices/authSlice.ts';
import { useTranslation } from 'react-i18next';

// EmailOrPhoneStep component handles the initial login step where a user enters their email or username.
const EmailOrPhoneStep: React.FC = () => {
  // State to store the user's input (email or username).
  const [identifier, setIdentifier] = useState('');
  // Hook for programmatic navigation.
  const navigate = useNavigate();
  // Hook to dispatch Redux actions.
  const dispatch = useAppDispatch();
  // Selects loading status and error message from the Redux auth slice.
  const { loading, error } = useAppSelector(state => state.auth);
  // Hook for internationalization (translation).
  const { t } = useTranslation();

  // Handles the form submission when the "Continue" button is clicked.
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form submission behavior (page reload).
    dispatch(clearError()); // Clears any previous errors.

    // Validates if the identifier field is not empty.
    if (identifier.trim()) {
      dispatch(setLoginIdentifier(identifier.trim())); // Saves the entered identifier to Redux state.
      navigate('password-or-code'); // Navigates to the next step in the login flow.
    } else {
      dispatch(setError(t("Please enter your email or username."))); // Sets an error message if the field is empty.
    }
  };

  // Renders the login form for email or username input.
  return (
    <div className="login-step-content">
      {/* Login page title. */}
      <h1 className="login-title">{t('Log in to Spotify')}</h1>

      {/* Login form. */}
      <form onSubmit={handleContinue}>
        {/* Label for the input field. */}
        <label htmlFor="identifier" className="input-label">{t('Email or Username')}</label>
        {/* Input field for email or username. */}
        <input
          id="identifier"
          type="text"
          placeholder={t('Email or Username')}
          className="input-field"
          value={identifier} // Binds input value to component state.
          onChange={(e) => setIdentifier(e.target.value)} // Updates state on input change.
          required // Makes the field mandatory.
        />

        {/* Displays error message if present. */}
        {error && <p className="error-message">{error}</p>}
        {/* Displays loading message when an action is in progress. */}
        {loading && <p className="loading-message">{t('...Loading')}</p>}

        {/* Continue button to proceed to the next step. */}
        <button
          type="submit"
          className="primary-button"
          disabled={loading || !identifier.trim()} // Disables button if loading or input is empty.
        >
          {t('Continue')}
        </button>
      </form>

      {/* Link for users who don't have an account to sign up. */}
      <p className="signup-prompt">
        {t("Don't have an account ?")} <a href="/signup">{t('Sign up for Spotify')}</a>
      </p>
    </div>
  );
};

export default EmailOrPhoneStep; // Exports the component for use in the login flow.