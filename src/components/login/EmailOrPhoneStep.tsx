// src/components/login/EmailOrPhoneStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
// تم استيراد setError من authSlice.ts
import { setLoginIdentifier, clearError, setError } from '../../store/slices/authSlice.ts';

const EmailOrPhoneStep: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // يمكن أن يكون بريد إلكتروني أو اسم مستخدم
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError()); // مسح أي أخطاء سابقة

    if (identifier.trim()) {
      dispatch(setLoginIdentifier(identifier.trim())); // حفظ المعرف في Redux
      navigate('password-or-code');
    } else {
      // استخدام أكشن setError لوضع رسالة الخطأ
      dispatch(setError("الرجاء إدخال بريدك الإلكتروني أو اسم المستخدم."));
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // منطق Firebase للمصادقة الاجتماعية
  };

  return (
    <div className="login-step-content">
      <h1 className="login-title">قم بتسجيل الدخول إلى Spotify</h1>

      {/* أزرار تسجيل الدخول الاجتماعي */}
      <button onClick={() => handleSocialLogin('Google')} className="social-login-button">
        <img src="/assets/google-icon.png" alt="Google" />
        المتابعة باستخدام Google
      </button>
      <button onClick={() => handleSocialLogin('Facebook')} className="social-login-button">
        <img src="/assets/facebook-icon.png" alt="Facebook" />
        تابع باستخدام Facebook
      </button>
      <button onClick={() => handleSocialLogin('Apple')} className="social-login-button">
        <img src="/assets/apple-icon.png" alt="Apple" />
        تابع باستخدام Apple
      </button>
      {/* تم حذف زر "استمر باستخدام رقم الهاتف" */}

      <div className="separator">أو</div>

      <form onSubmit={handleContinue}>
        <label htmlFor="identifier" className="input-label">البريد الإلكتروني أو اسم المستخدم</label>
        <input
          id="identifier"
          type="text"
          placeholder="البريد الإلكتروني أو اسم المستخدم"
          className="input-field"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}
        {loading && <p className="loading-message">جاري التحقق...</p>}

        <button
          type="submit"
          className="primary-button"
          disabled={loading || !identifier.trim()}
        >
          متابعة
        </button>
      </form>

      <p className="signup-prompt">
        ليس لديك حساب؟ <a href="/signup">سجل في Spotify</a>
      </p>
    </div>
  );
};

export default EmailOrPhoneStep;