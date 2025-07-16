// src/components/login/PasswordOrCodeStep.tsx

import React, { useState } from 'react'; // Imports React and the useState hook for component state.
import { useNavigate } from 'react-router-dom'; // Imports useNavigate for programmatic navigation.
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts'; // Imports custom Redux hooks.
import { clearError } from '../../store/slices/authSlice.ts'; // Imports action to clear authentication errors.
import { loginUser } from '../../services/authService.ts'; // Imports the login service function.
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Imports eye icons for password visibility toggle.
import { useTranslation } from 'react-i18next'; // Imports the translation hook for i18n.

// PasswordOrCodeStep component handles entering the password or login code.
const PasswordOrCodeStep: React.FC = () => {
  // State for the password input field.
  const [password, setPassword] = useState("");
  // State to toggle password visibility.
  const [showPassword, setShowPassword] = useState(false);
  // Hook for programmatic navigation.
  const navigate = useNavigate();
  // Hook to dispatch Redux actions.
  const dispatch = useAppDispatch();
  // Selects loading status, error message, and the previously entered login identifier from Redux state.
  const { loading, error, loginIdentifier } = useAppSelector(state => state.auth);
  // Hook for internationalization (translation).
  const { t } = useTranslation();

  // Handles the login form submission.
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form submission behavior (page reload).
    dispatch(clearError()); // Clears any existing error messages.

    // Basic validation to ensure both identifier and password are present.
    if (!loginIdentifier || !password) {
      return; // Stops the function if data is missing.
    }

    try {
      // Calls the async login service function.
      await loginUser(loginIdentifier, password, dispatch);
      navigate('/', { replace: true }); // Navigates to the home page on successful login.
    } catch (err) {
      console.error("Failed to login:", err); // Logs any login failure.
      // Error handling is likely managed by authService.ts and reflected in Redux 'error' state.
    }
  };

  // Renders the password input form for login.
  return (
    <div className="login-step-content">
      {/* Header section with a back arrow and step title. */}
      <div className="signup-step-header">
        <span onClick={() => navigate("/login")} className="back-arrow">
          &#8249; {/* Back arrow character. */}
        </span>
        <h2 className="step-title">
          <span>{t('Enter your password for')}</span><br />{loginIdentifier} {/* Displays the user's identifier. */}
        </h2>
      </div>

      {/* Login form with password input. */}
      <form onSubmit={handleLogin}>
        <div className="password-input-wrapper">
          {/* Password input field, type changes based on showPassword state. */}
          <input
            type={showPassword ? 'text' : 'password'} // Toggles input type for visibility.
            placeholder={t('Password')} // Placeholder text for the input.
            className="input-field" // CSS class for styling.
            value={password} // Binds input value to component state.
            onChange={(e) => setPassword(e.target.value)} // Updates password state on input change.
            required // Makes the field mandatory.
          />
          {/* Icon to toggle password visibility. */}
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)} // Toggles showPassword state.
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Renders appropriate eye icon. */}
          </span>
        </div>

        {/* Displays error message if present. */}
        {error && <p className="error-message">{error}</p>}
        {/* Displays loading message when an action is in progress. */}
        {loading && <p className="loading-message">{t('...Loading')}</p>}

        {/* Login button. */}
        <button
          type="submit"
          className="primary-button"
          disabled={loading || !password.trim()} // Disables button if loading or password is empty.
        >
          {t('Login')} {/* Button text. */}
        </button>
      </form>
    </div>
  );
};

export default PasswordOrCodeStep; // Exports the component for use in the login flow.