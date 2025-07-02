import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks.ts";
import { clearError, clearLoginData } from "../../store/slices/authSlice.ts";
import { useTranslation } from 'react-i18next';
//import spotifyLogo from "../../assets/spotify-icon-green.png"; 

// Import login step components.
import EmailOrPhoneStep from "./EmailOrPhoneStep.tsx";
import PasswordOrCodeStep from "./PasswordOrCodeStep.tsx";

// LoginFlow component manages the multi-step user login process.
const LoginFlow: React.FC = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation.
  const dispatch = useAppDispatch(); // Hook to dispatch Redux actions.
  const { user } = useAppSelector((state) => state.auth); // Selects user information from Redux auth slice.
  const { i18n } = useTranslation(); // Translation function and i18n instance for language detection.

  // Effect to redirect authenticated users to the home page.
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true }); // Redirects and replaces the current history entry.
    }
  }, [user, navigate]); // Dependencies: re-runs if 'user' or 'navigate' changes.

  // Effect to clear authentication errors and login data when the component mounts or unmounts.
  useEffect(() => {
    dispatch(clearError()); // Clears any error messages.
    dispatch(clearLoginData()); // Clears previously stored login data.
    return () => {
      dispatch(clearError()); // Cleanup: clear errors on unmount.
      dispatch(clearLoginData()); // Cleanup: clear login data on unmount.
    };
  }, [dispatch]); // Dependency: re-runs if 'dispatch' changes.

  // Effect to set the document's text direction (RTL/LTR) based on the current i18n language.
  useEffect(() => {
    document.body.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr'); // Sets 'dir' attribute of the <body>.
    return () => {
      document.body.setAttribute('dir', 'ltr');
      document.body.removeAttribute('dir');
    };
  }, [i18n.language]); // Dependency: re-runs when the i18n language changes.

  // Renders the login flow container and defines nested routes for each login step.
  return (
    <div className="login-flow-container">
      {/* Defines the routing for the login steps */}
      <Routes>
        <Route index element={<EmailOrPhoneStep />} /> {/* Default route for /login. */}
        <Route path="password-or-code" element={<PasswordOrCodeStep />} /> {/* Route for /login/password-or-code. */}
        <Route path="*" element={<EmailOrPhoneStep />} /> {/* Fallback route for invalid paths within /login. */}
      </Routes>
    </div>
  );
};

export default LoginFlow; 