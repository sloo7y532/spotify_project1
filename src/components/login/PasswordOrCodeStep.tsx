// src/components/login/PasswordOrCodeStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { clearError } from '../../store/slices/authSlice.ts';
import { loginUser } from '../../services/authService.ts';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // تم إضافة هذا الاستيراد

const PasswordOrCodeStep: React.FC = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, loginIdentifier } = useAppSelector(state => state.auth);
  const { t } = useTranslation(); // تم تعريف دالة الترجمة هنا

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!loginIdentifier || !password) {
      // يمكنك إضافة رسالة خطأ هنا إذا كانت هذه الحالة ممكنة
      // dispatch(setError(t("Please enter your password.")));
      return;
    }

    try {
      await loginUser(loginIdentifier, password, dispatch);
      navigate('/', { replace: true });
    } catch (err) {
      console.error("Failed to login:", err);
      // الأخطاء التي تأتي من loginUser (authService) ستُرسل إلى Redux Slice
      // لذا لا نحتاج لتعريبها هنا بشكل مباشر إذا كانت تُعالج في authService
      // وإلا ستحتاج إلى جلب رسالة الخطأ من err.message وتعريبها هنا.
      // بما أن authService.ts هو من يحدد رسائل الأخطاء، سنتأكد من تعريبها هناك.
    }
  };

  return (
    <div className="login-step-content">
      <div className="signup-step-header">
        <span onClick={() => navigate("/login")} className="back-arrow">
          &#8249;
        </span>
        <h2 className="step-title">
          <span>{t('Enter your password for')}</span><br />{loginIdentifier} {/* تم تعريب جزء العنوان */}
        </h2>
      </div>

      <form onSubmit={handleLogin}>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={t('Password')} 
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className="error-message">{error}</p>}
        {loading && <p className="loading-message">{t('...Loading')}</p>} {/* تم تعريب نص التحميل */}

        <button
          type="submit"
          className="primary-button"
          disabled={loading || !password.trim()}
        >
          {t('Login')} {/* تم تعريب نص الزر */}
        </button>
      </form>
    </div>
  );
};

export default PasswordOrCodeStep;
