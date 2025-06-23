// src/components/auth/TermsAndConditionsStep.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import {
  signupStart,
  signupSuccess,
  signupFailure,
} from "../../store/slices/authSlice.ts";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebase/firebase.js";

const TermsAndConditionsStep: React.FC = () => {
  const [receiveMarketing, setReceiveMarketing] = useState(false);
  const [shareData, setShareData] = useState(false);
  const { loading, signupEmail, signupPassword } = useAppSelector(
    (state) => state.auth
  ); // <--- جلب البيانات من Redux
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!signupEmail || !signupPassword) {
      dispatch(signupFailure("Please complete all previous steps."));
      return;
    }

    dispatch(signupStart());
    const auth = getAuth(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );
      const user = userCredential.user;

      dispatch(
        signupSuccess({
          id: user.uid,
          email: user.email,
          token: await user.getIdToken(),
        })
      );
    } catch (err: any) {
      console.error("Firebase Signup Error:", err.message);
      let errorMessage = "An error occurred during signup. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already in use. Please log in or use another email.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "The email entered is invalid.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "The password is too weak.";
      }
      dispatch(signupFailure(errorMessage));
    }
  };

  return (
    <div className="signup-step-content">
      <div className="signup-step-header">
        <span
          onClick={() => navigate("/signup/profile")}
          className="back-arrow"
        >
          &#8249;
        </span>
        <h2 className="step-title">
          Step 3 of 3<br />
          Terms and Conditions
        </h2>
      </div>

      <div className="checkbox-option">
        <input
          type="checkbox"
          id="receiveMarketing"
          checked={receiveMarketing}
          onChange={(e) => setReceiveMarketing(e.target.checked)}
        />
        <label htmlFor="receiveMarketing">
          I do not want to receive marketing messages from Spotify
        </label>
      </div>

      <div className="checkbox-option">
        <input
          type="checkbox"
          id="shareData"
          checked={shareData}
          onChange={(e) => setShareData(e.target.checked)}
        />
        <label htmlFor="shareData">
          I agree to let Spotify share my registration data with content
          providers for marketing purposes.
        </label>
      </div>

      <p className="terms-text">
        After clicking the signup button, you agree to{" "}
        <a href="/terms-of-use">Spotify's Terms of Use and Conditions</a>. For
        more information on how Spotify collects, uses, and protects your
        personal data, please refer to{" "}
        <a href="/privacy-policy">Spotify's Privacy Policy</a>.
      </p>

      <button
        onClick={handleSignup}
        className="primary-button"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign up"}
      </button>
      <p className="recapcha-text">
        This site is protected by reCAPTCHA and the Google{" "}
        <a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
        <a href="https://policies.google.com/terms">Terms of Service</a> apply.
      </p>
    </div>
  );
};

export default TermsAndConditionsStep;
