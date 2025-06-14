// src/components/auth/SignupSuccessScreen.tsx

import React from 'react';

const SignupSuccessScreen: React.FC = () => {
  return (
    <div className="success-container">
      <img src="/path/to/success-icon.png" alt="Success" className="success-icon" />
      <h1 className="success-title">تم التسجيل بنجاح!</h1>
      <p className="success-message">أهلاً بك في Spotify. يمكنك الآن البدء بالاستماع.</p>
      <button className="primary-button" onClick={() => { /* navigate to dashboard */ }}>ابدأ الاستماع</button>
    </div>
  );
};

export default SignupSuccessScreen;