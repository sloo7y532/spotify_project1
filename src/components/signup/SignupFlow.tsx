// src/components/auth/SignupFlow.tsx

import React, { useEffect } from 'react'; // تم إضافة useEffect
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks.ts'; // تم إضافة useAppDispatch
import { clearError } from '../../store/slices/authSlice.ts'; // تم إضافة clearError
import { useTranslation } from 'react-i18next'; // تم إضافة هذا الاستيراد

import EmailSignupStep from './EmailSignupStep.tsx';
import PasswordStep from './PasswordStep.tsx';
import ProfileInfoStep from './ProfileInfoStep.tsx';
import TermsAndConditionsStep from './TermsAndConditionsStep.tsx';
import spotifyLogo from '../../assets/spotify-icon-green.png';

const SignupFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch(); // تم إضافة dispatch
  const { loading, user } = useAppSelector(state => state.auth);
  const { t } = useTranslation(); // تم تعريف دالة الترجمة هنا

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // إضافة useEffect لمسح الأخطاء عند تحميل المكون
  useEffect(() => {
    dispatch(clearError());
    // يمكنك إضافة تنظيف إضافي هنا إذا لزم الأمر
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, location.pathname]); // مسح الأخطاء عند تغيير المسار أيضًا


  let currentStepIndex = 0;
  if (location.pathname.includes('/signup/password')) {
    currentStepIndex = 1;
  } else if (location.pathname.includes('/signup/profile')) {
    currentStepIndex = 2;
  } else if (location.pathname.includes('/signup/terms')) {
    currentStepIndex = 3;
  }

  return (
    <div className="signup-flow-container">
      <img src={spotifyLogo} alt={t('Spotify Logo')} className="spotify-logo" /> {/* تم تعريب alt text */}

      {currentStepIndex > 0 && currentStepIndex <= 3 && (
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${(currentStepIndex / 3) * 100}%` }}></div>
        </div>
      )}

      {loading && <p className="loading-message">{t('...Loading')}</p>} {/* تم تعريب نص التحميل */}
      
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