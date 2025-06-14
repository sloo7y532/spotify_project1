// src/components/auth/TermsAndConditionsStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { signupStart, signupSuccess, signupFailure } from '../../store/slices/authSlice.ts';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase/firebase.js'; 

const TermsAndConditionsStep: React.FC = () => {
  const [receiveMarketing, setReceiveMarketing] = useState(false);
  const [shareData, setShareData] = useState(false);
  const { loading, error, signupEmail, signupPassword } = useAppSelector(state => state.auth); // <--- جلب البيانات من Redux
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    // التحقق من وجود البريد الإلكتروني وكلمة المرور قبل محاولة التسجيل
    if (!signupEmail || !signupPassword) {
      dispatch(signupFailure("الرجاء إكمال جميع الخطوات السابقة."));
      return;
    }

    dispatch(signupStart());
    const auth = getAuth(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword); // <--- استخدام البيانات من Redux
      const user = userCredential.user;



      dispatch(signupSuccess({ id: user.uid, email: user.email, token: await user.getIdToken() }));
      // الـ useEffect في SignupFlow سيعيد توجيه المستخدم بعد هذا النجاح
    } catch (err: any) {
      console.error("Firebase Signup Error:", err.message);
      let errorMessage = "حدث خطأ أثناء التسجيل. الرجاء المحاولة مرة أخرى.";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "هذا البريد الإلكتروني مستخدم بالفعل. الرجاء تسجيل الدخول أو استخدام بريد آخر.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "البريد الإلكتروني المدخل غير صحيح.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "كلمة المرور ضعيفة جداً.";
      }
      dispatch(signupFailure(errorMessage));
    }
  };

  return (
    <div className="signup-step-content">
      {/* ... باقي الـ JSX كما هو ... */}
      <div className="signup-step-header">
        <span onClick={() => navigate('/signup/profile')} className="back-arrow">&#8249;</span>
        <h2 className="step-title">الخطوة 3 من 3<br/>الشروط والأحكام</h2>
      </div>

      <div className="checkbox-option">
        <input
          type="checkbox"
          id="receiveMarketing"
          checked={receiveMarketing}
          onChange={(e) => setReceiveMarketing(e.target.checked)}
        />
        <label htmlFor="receiveMarketing">لا أرغب في تلقي الرسائل التسويقية من Spotify</label>
      </div>

      <div className="checkbox-option">
        <input
          type="checkbox"
          id="shareData"
          checked={shareData}
          onChange={(e) => setShareData(e.target.checked)}
        />
        <label htmlFor="shareData">أسمح بمشاركة بيانات التسجيل الخاصة بي مع موفري محتوى Spotify لأغراض التسويق.</label>
      </div>

      <p className="terms-text">
        بعد النقر على زر التسجيل الاشتراك موافقة منك على{' '}
        <a href="/terms-of-use">شروط الاستخدام وأحكامه لدى Spotify</a>.{' '}
        لمعرفة المزيد عن كيفية جمع Spotify لبياناتك الشخصية واستخدامها ومشاركتها وحمايتها، يرجى الاطلاع على{' '}
        <a href="/privacy-policy">سياسة الخصوصية لدى Spotify</a>.
      </p>

      <button
        onClick={handleSignup}
        className="primary-button"
        disabled={loading}
      >
        {loading ? 'جاري التسجيل...' : 'سجل'}
      </button>

      {error && <p className="error-message">{error}</p>}

      <p className="recapcha-text">
        This site is protected by reCAPTCHA and the Google{' '}
        <a href="https://policies.google.com/privacy">Privacy Policy</a> and{' '}
        <a href="https://policies.google.com/terms">Terms of Service</a> apply.
      </p>
    </div>
  );
};

export default TermsAndConditionsStep;