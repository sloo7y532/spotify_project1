// // src/components/auth/SignupSuccessScreen.tsx

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import successIcon from '../../assets/success-icon.png';

// const SignupSuccessScreen: React.FC = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="success-container">
//       <img src={successIcon} alt="Success" className="success-icon" />
//       <h1 className="success-title">Welcome to Spotify. You can now start listening.</h1>
//       <p className="success-message">Welcome to Spotify. You can now start listening.</p>
//       <button className="primary-button" onClick={() => { navigate('/') }}>Start listening</button>
//     </div>
//   );
// };

// export default SignupSuccessScreen;