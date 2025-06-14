// src/components/auth/EmailSignupStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { setSignupEmail } from '../../store/slices/authSlice.ts'; // استيراد الأكشن الجديد

const EmailSignupStep: React.FC = () => {
  const [email, setEmail] = useState('');
  const { loading, error } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    if (email.trim() && email.includes('@')) {
      dispatch(setSignupEmail(email)); // <--- حفظ البريد الإلكتروني في Redux
      navigate('/signup/password');
    } else {
      // يمكنك استخدام Redux أيضاً لإظهار رسالة خطأ، أو ببساطة alert
      alert('الرجاء إدخال بريد إلكتروني صحيح.');
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Signing up with ${provider}`);
    // منطق التسجيل الاجتماعي
  };

  return (
    <div className="signup-step-content">
      {/* ... باقي الـ JSX كما هو ... */}
      <h1 className="signup-title">سجل الاشتراك لبدء الاستماع</h1>

      <label htmlFor="email" className="input-label">عنوان البريد الإلكتروني</label>
      <input
        id="email"
        type="email"
        placeholder="name@domain.com"
        className="input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}

      <button
        onClick={handleNext}
        className="primary-button"
        disabled={loading || !email.trim()}
      >
        {loading ? 'جاري التحقق...' : 'التالي'}
      </button>

      <div className="separator">أو</div>

      <button onClick={() => handleSocialSignup('Google')} className="social-login-button">
        <img src="/assets/google-icon.png" alt="Google" />
        التسجيل الاشتراك من خلال Google
      </button>
      <button onClick={() => handleSocialSignup('Facebook')} className="social-login-button">
        <img src="/assets/facebook-icon.png" alt="Facebook" />
        التسجيل باستخدام Facebook
      </button>
      <button onClick={() => handleSocialSignup('Apple')} className="social-login-button">
        <img src="/assets/apple-icon.png" alt="Apple" />
        التسجيل الاشتراك باستخدام Apple
      </button>

      <p className="login-link">
        هل لديك حساب حاليًا؟ <a href="/login">سجل الدخول هنا.</a>
      </p>
    </div>
  );
};

export default EmailSignupStep;