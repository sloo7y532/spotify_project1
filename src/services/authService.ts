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
    let errorKey: string = "An unknown error occurred."; // مفتاح افتراضي للخطأ غير المعروف
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorKey = "auth/invalid-credential"; // استخدام مفتاح مخصص لهذه الأخطاء
    } else if (error.code === 'auth/invalid-email') {
      errorKey = "auth/invalid-email-format"; // مفتاح للبريد الإلكتروني غير الصالح
    } else if (error.code === 'auth/too-many-requests') {
      errorKey = "auth/too-many-requests"; // مفتاح للطلبات الكثيرة
    } else {
        // إذا كان هناك أي رسالة خطأ أخرى مباشرة من Firebase يمكن استخدامها كمفتاح
        // يفضل توحيد المفاتيح قدر الإمكان
        errorKey = error.code || "An unknown error occurred.";
    }
    dispatch(loginFailure(errorKey)); // إرسال مفتاح الترجمة بدلاً من النص
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
    // يمكنك هنا إرسال خطأ إلى الـ slice إذا أردت التعامل مع أخطاء تسجيل الخروج
    // dispatch(setError(t('logout_error_message_key')));
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
    let errorKey: string = "An unknown error occurred."; // مفتاح افتراضي للخطأ غير المعروف
    if (error.code === 'auth/email-already-in-use') {
      errorKey = "auth/email-already-in-use"; // مفتاح للبريد المستخدم بالفعل
    } else if (error.code === 'auth/invalid-email') {
      errorKey = "auth/invalid-email-format"; // مفتاح للبريد الإلكتروني غير الصالح
    } else if (error.code === 'auth/weak-password') {
        errorKey = "auth/weak-password"; // مفتاح لكلمة المرور الضعيفة
    } else {
        errorKey = error.code || "An unknown error occurred.";
    }
    dispatch(signupFailure(errorKey)); // إرسال مفتاح الترجمة بدلاً من النص
    throw error;
  }
};