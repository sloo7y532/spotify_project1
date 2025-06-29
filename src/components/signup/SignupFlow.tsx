import React, { useEffect } from "react"; // تأكد من استيراد useEffect
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../../store/hooks.ts';
import { clearError } from '../../store/slices/authSlice.ts';
import { useTranslation } from 'react-i18next';

import EmailSignupStep from "./EmailSignupStep.tsx";
import PasswordStep from "./PasswordStep.tsx";
import ProfileInfoStep from "./ProfileInfoStep.tsx";
import TermsAndConditionsStep from "./TermsAndConditionsStep.tsx";
import spotifyLogo from "../../assets/spotify-icon-green.png";

const SignupFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loading, user } = useAppSelector(state => state.auth);
  const { t, i18n } = useTranslation(); // استيراد i18n هنا

  React.useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, location.pathname]);

  // **هنا إضافة الـ RTL/LTR:**
  useEffect(() => {
    // ضبط اتجاه الـ body بناءً على اللغة الحالية
    document.body.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');
    // تنظيف عند إزالة المكون (العودة للوضع الافتراضي إذا لزم الأمر، لكن عادةً ما يكون هذا كافياً)
    return () => {
      // إذا كنت تريد إزالة الـ 'dir' attribute عند الخروج من مسارات التسجيل
      // يمكنك إما تعيينه إلى 'ltr' افتراضيًا أو إزالته تمامًا
      // document.body.removeAttribute('dir'); // أو
      // document.body.setAttribute('dir', 'ltr');
    };
  }, [i18n.language]); // إعادة تشغيل هذا التأثير عند تغيير اللغة

  let currentStepIndex = 0;
  if (location.pathname.includes("/signup/password")) {
    currentStepIndex = 1;
  } else if (location.pathname.includes("/signup/profile")) {
    currentStepIndex = 2;
  } else if (location.pathname.includes("/signup/terms")) {
    currentStepIndex = 3;
  }

  return (
    <div className="signup-flow-container">
      <img src={spotifyLogo} alt={t('Spotify Logo')} className="spotify-logo" />

      {currentStepIndex > 0 && currentStepIndex <= 3 && (
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(currentStepIndex / 3) * 100}%` }}
          ></div>
        </div>
      )}

      {loading && <p className="loading-message">{t('...Loading')}</p>}

      <Routes>
        <Route index element={<EmailSignupStep />} />
        <Route path="password" element={<PasswordStep />} />
        <Route path="profile" element={<ProfileInfoStep />} />
        <Route path="terms" element={<TermsAndConditionsStep />} />
        <Route path="*" element={<EmailSignupStep />} />
      </Routes>
    </div>
  );
};

export default SignupFlow;
