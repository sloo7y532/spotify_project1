// import React, { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase/firebase"; // تأكد من المسار الصحيح لملف firebase.ts
// import { useAppDispatch, useAppSelector } from "../store/hooks.ts"; // تأكد من المسار الصحيح
// import { signupStart, signupSuccess, signupFailure, clearError } from "../store/slices/authSlice.ts"; // تأكد من المسار الصحيح
// import '../styles/signup.css'; // سننشئ هذا الملف لتنسيقاتنا

// // شعار Spotify (يمكن أن يكون مكون SVG أو مجرد صورة)
// const SpotifyLogo = () => (
//   // يمكنك استبدال هذا برابط أو مكون SVG لشعار سبوتيفاي
//   <img src="https://www.scdn.co/i/spotify-logo-primary-green.svg" alt="Spotify Logo" className="spotify-logo" />
// );

// const SignupPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState(""); // جديد لخطوة 2
//   const [day, setDay] = useState(""); // جديد لخطوة 2
//   const [month, setMonth] = useState(""); // جديد لخطوة 2
//   const [year, setYear] = useState(""); // جديد لخطوة 2
//   const [gender, setGender] = useState(""); // جديد لخطوة 2
//   const [showPassword, setShowPassword] = useState(false); // جديد لخطوة 1

//   const [currentStep, setCurrentStep] = useState(0); // 0: شاشة البدء, 1: كلمة المرور, 2: البيانات الشخصية, 3: الشروط

//   const dispatch = useAppDispatch();
//   const { loading, error } = useAppSelector((state) => state.auth);

//   const handleNextStep = () => {
//     setCurrentStep((prevStep) => prevStep + 1);
//   };

//   const handlePreviousStep = () => {
//     setCurrentStep((prevStep) => prevStep - 1);
//     dispatch(clearError()); // مسح الأخطاء عند العودة للخلف
//   };

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     dispatch(signupStart());
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       const token = await user.getIdToken();

//       // هنا يمكنك أيضًا تحديث ملف تعريف المستخدم في Firebase لإضافة الاسم وتاريخ الميلاد والنوع
//       // مثال: await updateProfile(user, { displayName: name });
//       // أو حفظها في قاعدة بياناتك (مثل Firestore أو Realtime Database)

//       dispatch(
//         signupSuccess({
//           id: user.uid,
//           email: user.email,
//           token,
//         })
//       );
//       // بعد النجاح، يمكنك توجيه المستخدم إلى لوحة التحكم أو صفحة الترحيب
//       // مثال: navigate('/dashboard'); // ستحتاج إلى استخدام react-router-dom for this
//     } catch (err: any) {
//       dispatch(signupFailure(err.message));
//     }
//   };

//   const renderCurrentStep = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <div className="signup-step-container">
//             <h1 className="signup-title">سجّل الاشتراك <br /> لبدء الاستماع</h1>
//             <div className="input-group">
//               <label htmlFor="email" className="input-label">عنوان البريد الإلكتروني</label>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="name@domain.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="signup-input"
//               />
//               <a href="#" className="alternative-link">استخدام رقم الهاتف بدلاً من ذلك</a>
//             </div>
//             <button className="signup-button primary-button" onClick={handleNextStep}>
//               التالي
//             </button>
//             <div className="or-divider">
//               <span className="or-text">أو</span>
//             </div>
//             <button className="signup-button social-button google-button">
//               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google" className="social-icon" />
//               تسجيل الاشتراك من خلال Google
//             </button>
//             <button className="signup-button social-button facebook-button">
//               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png" alt="Facebook" className="social-icon" />
//               التسجيل باستخدام Facebook
//             </button>
//             <button className="signup-button social-button apple-button">
//               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png" alt="Apple" className="social-icon" />
//               تسجيل الاشتراك باستخدام Apple
//             </button>
//             <div className="login-prompt">
//               <p>هل لديك حساب حاليًا؟ <a href="#" className="login-link">سجّل الدخول هنا</a></p>
//             </div>
//           </div>
//         );

//       case 1:
//         return (
//           <div className="signup-step-container">
//             <div className="step-header">
//               <div className="progress-bar">
//                 <div className="progress-fill" style={{ width: '33%' }}></div>
//               </div>
//               <p className="step-indicator">الخطوة 1 من 3</p>
//               {/* <span className="arrow-icon" onClick={handlePreviousStep}>&gt;</span> */}
//             </div>
//             <h2 className="step-title">إنشاء كلمة مرور</h2>
//             <div className="input-group password-group">
//               <label htmlFor="password" className="input-label">كلمة المرور</label>
//               <div className="password-input-wrapper">
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="كلمة المرور"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="signup-input"
//                 />
//                 <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
//                   {showPassword ? '👁️' : '🚫'} {/* أيقونة العين أو الخط المائل */}
//                 </span>
//               </div>
//               <p className="password-requirements">يجب أن تتضمن كلمة مرورك ما يلي على الأقل:</p>
//               <ul>
//                 <li className={password.length > 0 && /[a-zA-Z]/.test(password) ? 'valid' : ''}>
//                   {password.length > 0 && /[a-zA-Z]/.test(password) ? '✓' : '•'} حرفًا واحدًا
//                 </li>
//                 <li className={password.length > 0 && (/[0-9]/.test(password) || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) ? 'valid' : ''}>
//                   {password.length > 0 && (/[0-9]/.test(password) || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) ? '✓' : '•'} رقم واحد أو حرف خاص (مثال: #? !&)
//                 </li>
//                 <li className={password.length >= 10 ? 'valid' : ''}>
//                   {password.length >= 10 ? '✓' : '•'} 10 أحرف
//                 </li>
//               </ul>
//             </div>
//             <button
//               className="signup-button primary-button"
//               onClick={handleNextStep}
//               disabled={!(password.length >= 10 && /[a-zA-Z]/.test(password) && (/[0-9]/.test(password) || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)))}
//             >
//               التالي
//             </button>
//           </div>
//         );

//       case 2:
//         const months = Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('ar', { month: 'long' }));
//         const currentYear = new Date().getFullYear();
//         const years = Array.from({ length: 100 }, (_, i) => currentYear - i); // 100 سنة للخلف

//         return (
//           <div className="signup-step-container">
//             <div className="step-header">
//               <div className="progress-bar">
//                 <div className="progress-fill" style={{ width: '66%' }}></div>
//               </div>
//               <p className="step-indicator">الخطوة 2 من 3</p>
//               {/* <span className="arrow-icon" onClick={handlePreviousStep}>&gt;</span> */}
//             </div>
//             <h2 className="step-title">عرّفنا عن نفسك</h2>
//             <div className="input-group">
//               <label htmlFor="name" className="input-label">الاسم</label>
//               <input
//                 id="name"
//                 type="text"
//                 placeholder="اسمك"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="signup-input"
//               />
//               <p className="input-hint">سيظهر هذا الاسم في صفحتك الشخصية</p>
//             </div>
//             <div className="input-group">
//               <label htmlFor="dob" className="input-label">تاريخ الميلاد</label>
//               <p className="input-hint">لماذا نحتاج إلى معرفة تاريخ ميلادك؟ <a href="#" className="learn-more">معرفة المزيد</a></p>
//               <div className="date-input-group">
//                 <input
//                   type="text"
//                   placeholder="اليوم"
//                   value={day}
//                   onChange={(e) => setDay(e.target.value.replace(/[^0-9]/g, ''))} // فقط أرقام
//                   className="date-input day-input"
//                   maxLength={2}
//                 />
//                 <select
//                   value={month}
//                   onChange={(e) => setMonth(e.target.value)}
//                   className="date-input month-input"
//                 >
//                   <option value="">الشهر</option>
//                   {months.map((m, index) => (
//                     <option key={index + 1} value={index + 1}>{m}</option>
//                   ))}
//                 </select>
//                 <select
//                   value={year}
//                   onChange={(e) => setYear(e.target.value)}
//                   className="date-input year-input"
//                 >
//                   <option value="">العام</option>
//                   {years.map((y) => (
//                     <option key={y} value={y}>{y}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className="input-group">
//               <label className="input-label">النوع</label>
//               <p className="input-hint">نستخدم نوعك الاجتماعي للمساعدة في تخصيص اقتراحات المحتوى والإعلانات التي تظهر لك.</p>
//               <div className="radio-group">
//                 <label className="radio-label">
//                   <input
//                     type="radio"
//                     name="gender"
//                     value="female"
//                     checked={gender === "female"}
//                     onChange={(e) => setGender(e.target.value)}
//                   />
//                   <span>امرأة</span>
//                 </label>
//                 <label className="radio-label">
//                   <input
//                     type="radio"
//                     name="gender"
//                     value="male"
//                     checked={gender === "male"}
//                     onChange={(e) => setGender(e.target.value)}
//                   />
//                   <span>رجل</span>
//                 </label>
//                 <label className="radio-label">
//                   <input
//                     type="radio"
//                     name="gender"
//                     value="prefer_not_to_say"
//                     checked={gender === "prefer_not_to_say"}
//                     onChange={(e) => setGender(e.target.value)}
//                   />
//                   <span>أفضل عدم الإجابة</span>
//                 </label>
//               </div>
//             </div>
//             <button
//               className="signup-button primary-button"
//               onClick={handleNextStep}
//               // يمكنك إضافة شروط للتحقق من ملء الحقول المطلوبة قبل الانتقال للخطوة التالية
//             >
//               التالي
//             </button>
//           </div>
//         );

//       case 3:
//         return (
//           <div className="signup-step-container">
//             <div className="step-header">
//               <div className="progress-bar">
//                 <div className="progress-fill" style={{ width: '100%' }}></div>
//               </div>
//               <p className="step-indicator">الخطوة 3 من 3</p>
//               {/* <span className="arrow-icon" onClick={handlePreviousStep}>&gt;</span> */}
//             </div>
//             <h2 className="step-title">الشروط والأحكام</h2>
//             <div className="checkbox-group">
//               <label className="checkbox-label">
//                 <input type="checkbox" />
//                 <span>لا أرغب في تلقي الرسائل التسويقية من Spotify</span>
//               </label>
//               <label className="checkbox-label">
//                 <input type="checkbox" />
//                 <span>أسمح بمشاركة بيانات التسجيل الخاصة بي مع موفري محتوى Spotify لأغراض التسويق.</span>
//               </label>
//             </div>
//             <p className="terms-text">
//               بعد النقر على زر التسجيل الاشتراك موافقة منك على <a href="#" className="link">شروط الاستخدام والأحكام</a> لدي Spotify.
//               لمعرفة المزيد عن كيفية جمع Spotify لبياناتك الشخصية واستخدامها وحمايتها، يرجى الاطلاع على <a href="#" className="link">سياسة الخصوصية</a> لدي Spotify.
//             </p>
//             <button
//               className="signup-button primary-button"
//               onClick={handleSignup}
//               disabled={loading}
//             >
//               {loading ? "جاري التسجيل..." : "سجّل"}
//             </button>
//             {error && <p className="error-message">{error}</p>}
//             <p className="reCAPTCHA-info">
//                 This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="reCAPTCHA-link">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="reCAPTCHA-link">Terms of Service</a> apply.
//             </p>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="signup-page-wrapper">
//       <SpotifyLogo />
//       {renderCurrentStep()}
//     </div>
//   );
// };

// export default SignupPage;