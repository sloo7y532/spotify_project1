// src/components/auth/SignupFlow.tsx

import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks.ts'; 

import EmailSignupStep from './EmailSignupStep.tsx';
import PasswordStep from './PasswordStep.tsx';
import ProfileInfoStep from './ProfileInfoStep.tsx';
import TermsAndConditionsStep from './TermsAndConditionsStep.tsx';
import SignupSuccessScreen from './SignupSuccessScreen.tsx';

const SignupFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, user } = useAppSelector(state => state.auth);

  // منطق إعادة التوجيه بعد تسجيل الدخول بنجاح
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // تحديد الخطوة الحالية لعرض شريط التقدم
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
      {/* الشعار */}
      <img src="/path/to/spotify-logo.png" alt="Spotify Logo" className="spotify-logo" />

      {/* شريط التقدم يظهر فقط للخطوات 1-3 */}
      {currentStepIndex > 0 && currentStepIndex <= 3 && (
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${(currentStepIndex / 3) * 100}%` }}></div>
        </div>
      )}

      {/* رسائل التحميل والخطأ يمكن أن تظهر هنا في المكون الأب */}
      {loading && <p className="loading-message">جاري المعالجة...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* المسارات الفرعية لكل خطوة */}
      <Routes>
        <Route index element={<EmailSignupStep />} />
        <Route path="password" element={<PasswordStep />} />
        <Route path="profile" element={<ProfileInfoStep />} />
        <Route path="terms" element={<TermsAndConditionsStep />} />
        <Route path="success" element={<SignupSuccessScreen />} />
        <Route path="*" element={<EmailSignupStep />} />
      </Routes>
    </div>
  );
};

export default SignupFlow;