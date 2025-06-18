import { auth, db } from '../firebase/firebase';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { AppDispatch } from '../store/index.ts';
import {
  loginSuccess,
  loginFailure,
  loginStart,
  logout,
  signupStart,
  signupSuccess,
  signupFailure,
} from '../store/slices/authSlice.ts';
import { doc, setDoc } from 'firebase/firestore';

export const loginUser = async (email: string, password: string, dispatch: AppDispatch) => {
  dispatch(loginStart());
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();
    const userPayload = { id: user.uid, email: user.email, token };
    dispatch(loginSuccess(userPayload));
    localStorage.setItem('user', JSON.stringify(userPayload));
    return user;
  } catch (error: any) {
    let errorMessage = "An error occurred while logging in. Please try again.";
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage = "The email or password is incorrect.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "The email format is invalid.";
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = "You have tried to login multiple times. Please wait a moment or reset your password.";
    }
    dispatch(loginFailure(errorMessage));
    throw error;
  }
};

export const logoutUser = async (dispatch: AppDispatch) => {
  try {
    await signOut(auth); 
    dispatch(logout()); 
    localStorage.removeItem('user');
    console.log("Logged out successfully!");
  } catch (error: any) {
    console.error("Error logging out:", error.message);
  }
};

export const registerUser = async (email: string, password: string, dispatch: AppDispatch, profile: {
  name: string;
  gender: string;
  day: string;
  month: string;
  year: string;
}) => {
  dispatch(signupStart());
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();
    const userPayload = { id: user.uid, email: user.email, token };
    dispatch(signupSuccess(userPayload));
    localStorage.setItem('user', JSON.stringify(userPayload));

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      name: profile.name,
      gender: profile.gender,
      birthdate: `${profile.day}-${profile.month}-${profile.year}`,
    });

    return user;
  } catch (error: any) {
    let errorMessage = "An error occurred while signing up. Please try again.";
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "The email is already in use.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "The email format is invalid.";
    }
    dispatch(signupFailure(errorMessage));
    throw error;
  }
};
