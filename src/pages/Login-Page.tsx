// // // src/pages/LoginPage.tsx
// // // هذا الملف أصبح الآن هو "LoginFlow"
// // import React, { useEffect } from 'react';
// // import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
// // import { useAppSelector, useAppDispatch } from '../store/hooks.ts';
// // import { clearError, clearLoginData } from '../store/slices/authSlice.ts'; // استيراد clearLoginData

// <<<<<<< HEAD
// // // استيراد المكونات الفرعية لخطوات تسجيل الدخول
// // import EmailOrPhoneStep from '../components/login/EmailOrPhoneStep.tsx';
// // import PasswordOrCodeStep from '../components/login/PasswordOrCodeStep.tsx';

// // const LoginPage: React.FC = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const dispatch = useAppDispatch();
// //   const { user } = useAppSelector(state => state.auth);

// //   // إعادة التوجيه إذا كان المستخدم مسجلاً للدخول بالفعل
// //   useEffect(() => {
// //     if (user) {
// //       navigate('/dashboard', { replace: true });
// //     }
// //   }, [user, navigate]);

// //   // مسح أي أخطاء أو بيانات مؤقتة عند الدخول أو الخروج من صفحة تسجيل الدخول
// //   useEffect(() => {
// //     dispatch(clearError());
// //     dispatch(clearLoginData());
// //     return () => {
// //       dispatch(clearError());
// //       dispatch(clearLoginData());
// //     };
// //   }, [dispatch, location.pathname]);


// //   return (
// //     <div className="login-flow-container"> {/* حاوية جديدة لـ Login Flow */}
// //       {/* الشعار */}
// //       <img src="/path/to/spotify-logo.png" alt="Spotify Logo" className="spotify-logo" />

// //       {/* المسارات الفرعية لخطوات تسجيل الدخول */}
// //       <Routes>
// //         <Route index element={<EmailOrPhoneStep />} />
// //         <Route path="password-or-code" element={<PasswordOrCodeStep />} />
// //         {/* مسار احتياطي لأي شيء غير متوقع يعود للشاشة الأولى */}
// //         <Route path="*" element={<EmailOrPhoneStep />} />
// //       </Routes>
// //     </div>
// //   );
// // };

// // export default LoginPage;
// =======
// export default function LoginPage() {
//   return <div>LoginPage</div>;
// }
// >>>>>>> 0bb6859ebc809033a4d587941c999aad70895fbc
