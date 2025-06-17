// src/pages/LoginFlow.tsx
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks.ts";
import { clearError, clearLoginData } from "../../store/slices/authSlice.ts";
import spotifyLogo from "../../assets/spotify-icon-green.png";

import EmailOrPhoneStep from "./EmailOrPhoneStep.tsx";
import PasswordOrCodeStep from "./PasswordOrCodeStep.tsx";

const LoginFlow: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearLoginData());
    return () => {
      dispatch(clearError());
      dispatch(clearLoginData());
    };
  }, [dispatch]);
  return (
    <div className="login-flow-container">
      <img src={spotifyLogo} alt="Spotify Logo" className="spotify-logo" />

      <Routes>
        <Route index element={<EmailOrPhoneStep />} />
        <Route path="password-or-code" element={<PasswordOrCodeStep />} />
        <Route path="*" element={<EmailOrPhoneStep />} />
      </Routes>
    </div>
  );
};

export default LoginFlow;
