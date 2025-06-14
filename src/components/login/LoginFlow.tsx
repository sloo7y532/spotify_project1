// src/pages/LoginFlow.tsx
// هذا الملف أصبح الآن هو "LoginFlow"
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks.ts';
import { clearError, clearLoginData } from '../../store/slices/authSlice.ts';

// استيراد المكونات الفرعية لخطوات تسجيل الدخول
import EmailOrPhoneStep from './EmailOrPhoneStep.tsx';
import PasswordOrCodeStep from './PasswordOrCodeStep.tsx';

const LoginFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  // إعادة التوجيه إذا كان المستخدم مسجلاً للدخول بالفعل
  useEffect(() => {
    if (user) {
      navigate('/Home', { replace: true });
    }
  }, [user, navigate]);

  // مسح أي أخطاء أو بيانات مؤقتة عند الدخول أو الخروج من صفحة تسجيل الدخول بالكامل
  // الآن يتم التشغيل فقط عند تحميل/إلغاء تحميل LoginFlow
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearLoginData());
    return () => {
      dispatch(clearError());
      dispatch(clearLoginData());
    };
  }, [dispatch]); // <--- تم حذف location.pathname من هنا!

  return (
    <div className="login-flow-container">
      {/* الشعار */}
      <img src="/path/to/spotify-logo.png" alt="Spotify Logo" className="spotify-logo" />

      {/* المسارات الفرعية لخطوات تسجيل الدخول */}
      <Routes>
        <Route index element={<EmailOrPhoneStep />} />
        <Route path="password-or-code" element={<PasswordOrCodeStep />} />
        {/* مسار احتياطي لأي شيء غير متوقع يعود للشاشة الأولى */}
        <Route path="*" element={<EmailOrPhoneStep />} />
      </Routes>
    </div>
  );
};

export default LoginFlow;