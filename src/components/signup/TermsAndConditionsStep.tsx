// src/components/auth/TermsAndConditionsStep.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { signupStart, signupSuccess, signupFailure, setError } from '../../store/slices/authSlice.ts';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase/firebase.js';
import { useTranslation } from 'react-i18next'; // تم إضافة هذا الاستيراد

const TermsAndConditionsStep: React.FC = () => {
  const [receiveMarketing, setReceiveMarketing] = useState(false);
  const [shareData, setShareData] = useState(false);
  const { loading, signupEmail, signupPassword, error, signupProfile } = useAppSelector(state => state.auth); // <--- جلب البيانات من Redux
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(); // تم تعريف دالة الترجمة هنا

  const handleSignup = async () => {
    // Clear any previous error before attempting signup
    dispatch(setError(null));

    if (!signupEmail || !signupPassword) {
      // تم تعريب رسالة الخطأ
      dispatch(signupFailure(t("Missing email or password information. Please go back and fill them.")));
      return;
    }

    if (!receiveMarketing || !shareData) {
      // تم تعريب رسالة الخطأ
      dispatch(setError(t("Please check all the boxes.")));
      return;
    }

    dispatch(signupStart());
    const auth = getAuth(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;

      // إضافة بيانات المستخدم إلى Firestore بعد التسجيل
      // تأكد من أن authService.ts هو المسؤول عن هذه العملية بعد التسجيل بنجاح
      // بما أننا نستخدم registerUser في authService، يمكننا استدعاؤه هنا
      // أو التأكد من أن Logic لـ setDoc موجود في registerUser
      // هنا سنفترض أن signupSuccess يكفي لأننا نستخدم authService
      // و authService هو من يقوم بـ setDoc
      
      // هنا سنقوم بتمرير البيانات المطلوبة للوظيفة registerUser في authService
      // ملاحظة: الأفضل أن يتم استدعاء registerUser من authService مباشرةً
      // بدلاً من تكرار منطق Firebase هنا.
      // لكن بما أن الكود الأصلي استخدم createUserWithEmailAndPassword مباشرةً هنا،
      // سأضيف استدعاء to registerUser بعده، أو نعدل على authService ليتم استخدامه هنا بشكل كامل.
      // لتجنب تعقيد الأمور الآن، سأتبع نفس نمطك، مع ملاحظة أنه يجب أن يتم التعامل مع
      // تسجيل بيانات المستخدم في Firestore عبر authService إذا كانت هذه هي الطريقة المعتمدة.

      // بما أنك قمت بتضمين Firebase authService الذي يحتوي على registerUser،
      // الأفضل أن تستدعيها هنا لتجنب تكرار الكود ولضمان أن يتم تسجيل بيانات الملف الشخصي.
      // ولكن للالتزام بالطلب وتعديل هذا الملف فقط، سأركز على تعريب النصوص فقط
      // وأبقي على منطق Firebase المباشر الذي كان موجودًا.
      // سأفترض أن setDoc تتم معالجته في مكان آخر أو أنك ستدمج ذلك لاحقًا.

      dispatch(signupSuccess({ id: user.uid, email: user.email, token: await user.getIdToken() }));
      // بعد التسجيل بنجاح، قد تحتاج إلى إعادة توجيه المستخدم
      navigate('/dashboard', { replace: true });

    } catch (err: any) {
      console.error("Firebase Signup Error:", err.message);
      let errorMessage = t("An error occurred during signup. Please try again."); // تم تعريب الرسالة العامة
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = t("This email is already in use. Please log in or use another email."); // تم تعريب الرسالة
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = t("The email entered is invalid."); // تم تعريب الرسالة
      } else if (err.code === 'auth/weak-password') {
        errorMessage = t("The password is too weak."); // تم تعريب الرسالة
      }
      dispatch(signupFailure(errorMessage));
    }
  };

  return (
    <div className="signup-step-content">
      <div className="signup-step-header">
        <span onClick={() => navigate('/signup/profile')} className="back-arrow">&#8249;</span>
        <h2 className="step-title">
          {t('Step 3 of 3')}
          <br/>
          {t('Terms and Conditions')} {/* تم تعريب العنوان */}
        </h2>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="checkbox-option">
        <input
          type="checkbox"
          id="receiveMarketing"
          checked={receiveMarketing}
          onChange={(e) => setReceiveMarketing(e.target.checked)}
        />
        <label htmlFor="receiveMarketing">{t('I do not want to receive marketing messages from Spotify')}</label> {/* تم تعريب الليبل */}
      </div>

      <div className="checkbox-option">
        <input
          type="checkbox"
          id="shareData"
          checked={shareData}
          onChange={(e) => setShareData(e.target.checked)}
        />
        <label htmlFor="shareData">{t('I agree to let Spotify share my registration data with content providers for marketing purposes.')}</label> {/* تم تعريب الليبل */}
      </div>

      <p className="terms-text">
        {t('After clicking the signup button, you agree to')}
        {' '}
        <a href="/terms-of-use">{t("Spotify's Terms of Use and Conditions")}</a>.
        {' '}
        {t('For more information on how Spotify collects, uses, and protects your personal data, please refer to')}
        {' '}
        <a href="/privacy-policy">{t("Spotify's Privacy Policy")}</a>.
      </p>

      <button
        onClick={handleSignup}
        className="primary-button"
        disabled={loading || !receiveMarketing || !shareData} // إضافة شروط التعطيل للتشيك بوكس
      >
        {loading ? t('Signing up...') : t('Sign up')} {/* تم تعريب نص الزر */}
      </button>
      <p className="recapcha-text">
        {t('This site is protected by reCAPTCHA and the Google')}
        {' '}
        <a href="https://policies.google.com/privacy">{t('Privacy Policy')}</a>
        {' '}
        {t('and')}
        {' '}
        <a href="https://policies.google.com/terms">{t('Terms of Service')}</a> {t('apply.')}
      </p>
    </div>
  );
};

export default TermsAndConditionsStep;