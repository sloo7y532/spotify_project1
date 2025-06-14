// src/components/auth/PasswordOrCodeStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../store/slices/authSlice.ts';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // يمكن إضافة signInWithPhoneNumber إذا كنت تستخدم OTP
import { app } from '../../firebase/firebase.js';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // لأيقونة العين

const PasswordOrCodeStep: React.FC = () => {
  const [inputField, setInputField] = useState(''); // لكلمة المرور أو الرمز
  const [showPassword, setShowPassword] = useState(false); // فقط لكلمة المرور
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, loginIdentifier } = useAppSelector(state => state.auth); // جلب معرف الدخول

  // لتحديد ما إذا كنا نتوقع كلمة مرور أو رمز (مثال بسيط)
  // في تطبيق حقيقي، يجب أن تحدد هذا المنطق بدقة أكبر بناءً على نوع المعرف
  const isEmailOrUsernameLogin = loginIdentifier && loginIdentifier.includes('@'); // افتراض أن البريد الإلكتروني يعني كلمة مرور
  const isPhoneLogin = loginIdentifier && !isEmailOrUsernameLogin && loginIdentifier.match(/^\+?[0-9\s-]{10,}$/); // افتراض أن الرقم يعني رمز OTP
  const isCodeExpected = isPhoneLogin; // إذا كان تسجيل دخول بالهاتف، نتوقع رمز OTP

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    dispatch(clearError());

    const authInstance = getAuth(app);

    try {
      if (isCodeExpected) {
        // منطق التحقق من الرمز (OTP)
        // هذا يتطلب إعداد Firebase Phone Auth
        // في هذه الحالة، inputField هو الرمز
        // ستحتاج إلى "confirmationResult" الذي يتم الحصول عليه بعد إرسال الرمز
        // const confirmationResult = window.confirmationResult; // يجب أن يتم تخزينه في مكان ما
        // if (confirmationResult) {
        //   const userCredential = await confirmationResult.confirm(inputField);
        //   const user = userCredential.user;
        //   dispatch(loginSuccess({ id: user.uid, email: user.email, token: await user.getIdToken() }));
        // } else {
        //   throw new Error("رمز التحقق غير صالح أو انتهت صلاحيته. الرجاء إعادة إرسال الرمز.");
        // }
         dispatch(loginFailure("تسجيل الدخول بالرمز غير مفعل في هذا المثال.")); // رسالة مؤقتة
      } else {
        // منطق تسجيل الدخول بكلمة المرور (للبريد الإلكتروني/اسم المستخدم)
        if (!loginIdentifier || !inputField) {
            dispatch(loginFailure("الرجاء إدخال البريد الإلكتروني وكلمة المرور."));
            return;
        }
        const userCredential = await signInWithEmailAndPassword(authInstance, loginIdentifier, inputField);
        const user = userCredential.user;
        dispatch(loginSuccess({ id: user.uid, email: user.email, token: await user.getIdToken() }));
      }
    } catch (err: any) {
      console.error("Firebase Login Error:", err.message);
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "صيغة البريد الإلكتروني غير صحيحة.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "لقد حاولت تسجيل الدخول عدة مرات. الرجاء الانتظار قليلاً أو إعادة تعيين كلمة المرور.";
      }
      dispatch(loginFailure(errorMessage));
    }
  };

  const handleResendCode = () => {
    console.log("Resending code to:", loginIdentifier);
    // منطق إعادة إرسال الرمز هنا (يتطلب Firebase Phone Auth)
  };

  return (
    <div className="login-step-content">
      {/* سهم الرجوع للمرحلة الأولى */}
      <div className="signup-step-header"> {/* يمكن إعادة استخدام نفس التنسيق */}
        <span onClick={() => navigate('/login')} className="back-arrow">&#8249;</span>
        <h2 className="step-title">
          {isCodeExpected ? (
            <>إدخال الرمز المكون من 6 أرقام<br/>الذي تلقيته على {loginIdentifier}</>
          ) : (
            <>إدخال كلمة المرور لـ<br/>{loginIdentifier}</>
          )}
        </h2>
      </div>

      <form onSubmit={handleLogin}>
        {isCodeExpected ? (
          <>
            {/* حقول إدخال الرمز (يمكن استخدام حقل واحد أو 6 حقول منفصلة) */}
            <div className="otp-input-container"> {/* ستحتاج لتنسيق هذا في CSS */}
              <input type="text" maxLength={1} className="otp-input" />
              <input type="text" maxLength={1} className="otp-input" />
              <input type="text" maxLength={1} className="otp-input" />
              <input type="text" maxLength={1} className="otp-input" />
              <input type="text" maxLength={1} className="otp-input" />
              <input type="text" maxLength={1} className="otp-input" />
            </div>
            <button type="button" onClick={handleResendCode} className="resend-code-button">
              إعادة إرسال الرمز
            </button>
          </>
        ) : (
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="كلمة المرور"
              className="input-field"
              value={inputField}
              onChange={(e) => setInputField(e.target.value)}
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
        {loading && <p className="loading-message">جاري التحقق...</p>}

        <button
          type="submit"
          className="primary-button"
          disabled={loading || !inputField.trim()}
        >
          تسجيل الدخول
        </button>
      </form>

      {/* رابط تسجيل الدخول بكلمة المرور (إذا كنت في وضع الرمز) */}
      {isCodeExpected && (
        <p className="login-link">
          <button className="link-button" onClick={() => { /* يمكنك توجيه لصفحة Login التقليدية */ }}>
            تسجيل الدخول باستخدام كلمة مرور
          </button>
        </p>
      )}
    </div>
  );
};

export default PasswordOrCodeStep;