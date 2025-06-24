import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks.ts";
import { clearError, clearLoginData } from "../../store/slices/authSlice.ts";
import { useTranslation } from 'react-i18next'; // استيراد useTranslation
//import spotifyLogo from "../../assets/spotify-icon-green.png";

import EmailOrPhoneStep from "./EmailOrPhoneStep.tsx"; // تأكد من المسار الصحيح
import PasswordOrCodeStep from "./PasswordOrCodeStep.tsx"; // تأكد من المسار الصحيح

const LoginFlow: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { t, i18n } = useTranslation(); // استيراد i18n هنا

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

  // **هنا إضافة الـ RTL/LTR:**
  useEffect(() => {
    // ضبط اتجاه الـ body بناءً على اللغة الحالية
    document.body.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');
    // تنظيف عند إزالة المكون (العودة للوضع الافتراضي إذا لزم الأمر)
    return () => {
      // document.body.removeAttribute('dir'); // أو
      // document.body.setAttribute('dir', 'ltr');
    };
  }, [i18n.language]); // إعادة تشغيل هذا التأثير عند تغيير اللغة

  return (
    <div className="login-flow-container">
      {/*<img src={spotifyLogo} alt={t("Spotify Logo")} className="spotify-logo" />*/}

      <Routes>
        <Route index element={<EmailOrPhoneStep />} />
        <Route path="password-or-code" element={<PasswordOrCodeStep />} />
        <Route path="*" element={<EmailOrPhoneStep />} />
      </Routes>
    </div>
  );
};

export default LoginFlow;