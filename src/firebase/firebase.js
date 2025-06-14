import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAk47u4hPSgspFvNaLwc-JfjC_kHwU7A1E',
  authDomain: 'spotify-project-123.firebaseapp.com',
  projectId: 'spotify-project-123',
  storageBucket: 'spotify-project-123.appspot.com',
  messagingSenderId: '564978051586',
  appId: '1:564978051586:web:72f84408fe71505a8b551b',
  measurementId: 'G-4FP7WP09E4',
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
