// src/components/auth/EmailOrPhoneStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setLoginIdentifier, clearError } from '../../store/slices/authSlice.ts'; // استيراد الأكشن الجديد و clearError

const EmailOrPhoneStep: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // يمكن أن يكون بريد إلكتروني أو اسم مستخدم أو رقم هاتف
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError()); // مسح أي أخطاء سابقة

    if (identifier.trim()) {
      dispatch(setLoginIdentifier(identifier.trim())); // حفظ المعرف في Redux
      // هنا يمكنك إضافة منطق للتحقق من نوع المعرف (بريد إلكتروني، رقم هاتف، اسم مستخدم)
      // وتوجيه المستخدم إما لخطوة كلمة المرور أو خطوة الرمز.
      // حالياً، سنفترض أننا ننتقل إلى خطوة إدخال كلمة المرور أو الرمز
      navigate('password-or-code');
    } else {
      dispatch(clearError());
      dispatch(setLoginIdentifier("الرجاء إدخال بريدك الإلكتروني أو اسم المستخدم أو رقم هاتفك."));
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
        {/* تأكد من مسار الأيقونات */}
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
      <button onClick={() => handleSocialLogin('Phone')} className="social-login-button">
        <img src="/assets/phone-icon.png" alt="Phone" /> {/* أيقونة افتراضية للهاتف */}
        استمر باستخدام رقم الهاتف
      </button>

      <div className="separator">أو</div>

      <form onSubmit={handleContinue}>
        <label htmlFor="identifier" className="input-label">البريد الإلكتروني أو اسم المستخدم</label>
        <input
          id="identifier"
          type="text" // يمكن أن يكون نصًا لأنه قد يكون اسم مستخدم
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