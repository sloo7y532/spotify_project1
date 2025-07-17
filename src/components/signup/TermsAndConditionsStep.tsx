// src/components/auth/TermsAndConditionsStep.tsx

// Import React and core hooks for component state.
import React, { useState } from 'react';
// Imports for navigation (react-router-dom) and Redux state management (hooks and auth slice actions).
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { signupStart, signupSuccess, signupFailure, setError } from '../../store/slices/authSlice.ts';
// Imports for Firebase authentication.
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase/firebase.js';
// Import for internationalization (i18n).
import { useTranslation } from 'react-i18next';

// TermsAndConditionsStep component for the final step of user signup.
const TermsAndConditionsStep: React.FC = () => {
  // States for checkbox selections (marketing messages and data sharing).
  const [receiveMarketing, setReceiveMarketing] = useState(false);
  const [shareData, setShareData] = useState(false);
  // Redux state selectors for loading status, signup credentials, and error messages.
  const { loading, signupEmail, signupPassword, error } = useAppSelector(state => state.auth);
  // Redux dispatch hook to send actions.
  const dispatch = useAppDispatch();
  // Navigation hook for programmatic routing.
  const navigate = useNavigate();
  // Translation hook for i18n.
  const { t } = useTranslation();

  // Handler for the "Sign up" button click.
  const handleSignup = async () => {
    dispatch(setError(null)); // Clear any previous errors.

    // Basic validation: ensure email/password are available from previous steps.
    if (!signupEmail || !signupPassword) {
      dispatch(signupFailure(t("Missing email or password information. Please go back and fill them.")));
      return;
    }

    // Validation: ensure both checkboxes are checked.
    if (!receiveMarketing || !shareData) {
      dispatch(setError(t("Please check all the boxes.")));
      return;
    }

    dispatch(signupStart()); // Dispatch signup start action to set loading state.
    const auth = getAuth(app); // Get Firebase Auth instance.

    try {
      // Create user with email and password using Firebase Auth.
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;

      // Dispatch signup success with user details and navigate to dashboard.
      dispatch(signupSuccess({ id: user.uid, email: user.email, token: await user.getIdToken() }));
      navigate('/dashboard', { replace: true });

    } catch (err: any) {
      console.error("Firebase Signup Error:", err.message); // Log Firebase error for debugging.

      // Determine the specific error message based on Firebase error code and translate it.
      let errorMessage = t("An error occurred during signup. Please try again.");
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = t("This email is already in use. Please log in or use another email.");
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = t("The email entered is invalid.");
      } else if (err.code === 'auth/weak-password') {
        errorMessage = t("The password is too weak.");
      }
      dispatch(signupFailure(errorMessage)); // Dispatch signup failure with the translated error message.
    }
  };

  // Renders the terms and conditions form with checkboxes and relevant links.
  return (
    <div className="signup-step-content">
      {/* Header section with back arrow and step title. */}
      <div className="signup-step-header">
        <span onClick={() => navigate('/signup/profile')} className="back-arrow">&#8249;</span>
        <h2 className="step-title">
          {t('Step 3 of 3')}
          <br/>
          {t('Terms and Conditions')}
        </h2>
      </div>

      {/* Displays general error message if present. */}
      {error && <p className="error-message">{error}</p>}

      {/* Checkbox for marketing messages. */}
      <div className="checkbox-option">
        <input
          type="checkbox"
          id="receiveMarketing"
          checked={receiveMarketing}
          onChange={(e) => setReceiveMarketing(e.target.checked)}
        />
        <label htmlFor="receiveMarketing">{t('I want to receive marketing messages from Spotify')}</label>
      </div>

      {/* Checkbox for data sharing. */}
      <div className="checkbox-option">
        <input
          type="checkbox"
          id="shareData"
          checked={shareData}
          onChange={(e) => setShareData(e.target.checked)}
        />
        <label htmlFor="shareData">{t('I agree to let Spotify share my registration data with content providers for marketing purposes.')}</label>
      </div>

      {/* Terms and privacy policy text with translated links. */}
      <p className="terms-text">
        {t('After clicking the signup button, you agree to')}
        {' '}
        <a href="/terms-of-use">{t("Spotify's Terms of Use and Conditions")}</a>.
        {' '}
        {t('For more information on how Spotify collects, uses, and protects your personal data, please refer to')}
        {' '}
        <a href="/privacy-policy">{t("Spotify's Privacy Policy")}</a>.
      </p>

      {/* "Sign up" button, disabled during loading or if checkboxes are not checked. */}
      <button
        onClick={handleSignup}
        className="primary-button"
        disabled={loading || !receiveMarketing || !shareData}
      >
        {loading ? t('Signing up...') : t('Sign up')}
      </button>

      {/* reCAPTCHA disclaimer text with translated links. */}
      <p className="recapcha-text">
        {t('This site is protected by reCAPTCHA and the Google')}
        {' '}
        <a href="https://policies.google.com/privacy">{t('Privacy Policy')}</a>
        {' '}
        {t('and')}
        {' '}
        <a href="https://policies.google.com/terms">{t('Terms of Service')}</a> {t('apply.')}
      </p>
    </div>
  );
};

// Export the component for use in the signup flow.
export default TermsAndConditionsStep;