import React, { useEffect } from "react"; // Imports React and the useEffect hook.
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"; // Imports routing hooks and components from react-router-dom.
import { useAppSelector, useAppDispatch } from '../../store/hooks.ts'; // Imports custom Redux hooks.
import { clearError } from '../../store/slices/authSlice.ts'; // Imports an action to clear auth errors.
import { useTranslation } from 'react-i18next'; // Imports translation hook for i18n.

// Imports individual signup step components.
import EmailSignupStep from "./EmailSignupStep.tsx";
import PasswordStep from "./PasswordStep.tsx";
import ProfileInfoStep from "./ProfileInfoStep.tsx";
import TermsAndConditionsStep from "./TermsAndConditionsStep.tsx";
import spotifyLogo from "../../assets/spotify-icon-green.png"; // Imports the Spotify logo image.

// SignupFlow component manages the multi-step signup process.
const SignupFlow: React.FC = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate.
  const location = useLocation(); // Hook to get current URL location.
  const dispatch = useAppDispatch(); // Hook to dispatch Redux actions.
  const { loading, user } = useAppSelector(state => state.auth); // Selects loading state and user info from Redux auth slice.
  const { t, i18n } = useTranslation(); // Translation function and i18n instance for language detection.

  // Effect hook to redirect logged-in users to the home page.
  React.useEffect(() => {
    if (user) {
      navigate("/", { replace: true }); // Redirects and replaces history entry.
    }
  }, [user, navigate]); // Re-runs when 'user' or 'navigate' changes.

  // Effect hook to clear Redux errors on route changes and component unmount.
  useEffect(() => {
    dispatch(clearError()); // Clears errors when component mounts or path changes.
    return () => {
      dispatch(clearError()); // Clears errors when component unmounts.
    };
  }, [dispatch, location.pathname]); // Re-runs when 'dispatch' or 'location.pathname' changes.

  // Effect hook to set the document's text direction (RTL/LTR) based on the current language.
  useEffect(() => {
    document.body.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr'); // Sets 'dir' attribute of the <body> tag.
  }, [i18n.language]); // Re-runs when the i18n language changes.

  // Determines the current step index based on the URL path for the progress bar.
  let currentStepIndex = 0;
  if (location.pathname.includes("/signup/password")) {
    currentStepIndex = 1;
  } else if (location.pathname.includes("/signup/profile")) {
    currentStepIndex = 2;
  } else if (location.pathname.includes("/signup/terms")) {
    currentStepIndex = 3;
  }

  // Renders the signup flow container, logo, progress bar, loading message, and nested routes.
  return (
    <div className="signup-flow-container">
      <img src={spotifyLogo} alt={t('Spotify Logo')} className="spotify-logo" /> {/* Spotify logo with translation. */}

      {/* Renders the progress bar only if it's not the initial step (index > 0). */}
      {currentStepIndex > 0 && currentStepIndex <= 3 && (
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(currentStepIndex / 3) * 100}%` }} // Dynamically sets progress bar width.
          ></div>
        </div>
      )}

      {/* Displays a loading message if the auth state is loading. */}
      {loading && <p className="loading-message">{t('...Loading')}</p>}

      {/* Defines the routes for each step of the signup process. */}
      <Routes>
        <Route index element={<EmailSignupStep />} /> {/* Default route for /signup. */}
        <Route path="password" element={<PasswordStep />} /> {/* Route for /signup/password. */}
        <Route path="profile" element={<ProfileInfoStep />} /> {/* Route for /signup/profile. */}
        <Route path="terms" element={<TermsAndConditionsStep />} /> {/* Route for /signup/terms. */}
        <Route path="*" element={<EmailSignupStep />} /> {/* Fallback route for invalid paths. */}
      </Routes>
    </div>
  );
};

export default SignupFlow; // Exports the component for use in the main application.