// src/components/auth/PasswordStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAppDispatch } from '../../store/hooks.ts';
import { setSignupPassword } from '../../store/slices/authSlice.ts'; // استيراد الأكشن الجديد

const PasswordStep: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch(); // تهيئة dispatch
  const navigate = useNavigate();

  const hasMinLength = password.length >= 10;
  const hasChar = /[a-zA-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password);

  const isFormValid = hasMinLength && hasChar && hasNumberOrSpecial;

  const handleNext = () => {
    if (isFormValid) {
      dispatch(setSignupPassword(password)); // <--- حفظ كلمة المرور في Redux
      navigate('/signup/profile');
    }
  };

  return (
    <div className="signup-step-content">
      {/* ... باقي الـ JSX كما هو ... */}
      <div className="signup-step-header">
        <span onClick={() => navigate('/signup')} className="back-arrow">&#8249;</span>
        <h2 className="step-title">الخطوة 1 من 3<br/>إنشاء كلمة مرور</h2>
      </div>

      <label htmlFor="password" className="input-label">كلمة المرور</label>
      <div className="password-input-wrapper">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="password-toggle-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <ul className="password-requirements">
        <li className={hasChar ? 'valid' : ''}>
          <span className="check-icon">{hasChar ? '✓' : ''}</span>
          حرف واحدًا (A-Z أو a-z)
        </li>
        <li className={hasNumberOrSpecial ? 'valid' : ''}>
          <span className="check-icon">{hasNumberOrSpecial ? '✓' : ''}</span>
          رقم واحد (0-9) أو حرف خاص (مثال: !? &%)
        </li>
        <li className={hasMinLength ? 'valid' : ''}>
          <span className="check-icon">{hasMinLength ? '✓' : ''}</span>
          10 أحرف على الأقل
        </li>
      </ul>

      <button
        onClick={handleNext}
        className="primary-button"
        disabled={!isFormValid}
      >
        التالي
      </button>
    </div>
  );
};

export default PasswordStep;