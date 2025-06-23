
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import {
  setLoginIdentifier,
  clearError,
  setError,
} from "../../store/slices/authSlice.ts";
import Spinner from "../Spinner.tsx";

const EmailOrPhoneStep: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (identifier.trim()) {
      dispatch(setLoginIdentifier(identifier.trim()));
      navigate("password-or-code");
    } else {
      dispatch(setError("Please enter your email or username."));
    }
  };

  return (
    <div className="login-step-content">
      <h1 className="login-title">Log in to Spotify</h1>

      <form onSubmit={handleContinue}>
        <label htmlFor="identifier" className="input-label">
          Email or Username
        </label>
        <input
          id="identifier"
          type="text"
          placeholder="Email or Username"
          className="input-field"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}
        {loading && <Spinner />}

        <button
          type="submit"
          className="primary-button"
          disabled={loading || !identifier.trim()}
        >
          Continue
        </button>
      </form>

      <p className="signup-prompt">
        Don't have an account ? <a href="/signup">Sign up for Spotify</a>
      </p>
    </div>
  );
};

export default EmailOrPhoneStep;
