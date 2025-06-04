// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// const auth = getAuth(firebaseApp);
// onAuthStateChanged(auth, user => {
// Check for user status
// });
const firebaseConfig = {
  apiKey: "AIzaSyAk47u4hPSgspFvNaLwc-JfjC_kHwU7A1E",
  authDomain: "spotify-project-123.firebaseapp.com",
  projectId: "spotify-project-123",
  storageBucket: "spotify-project-123.firebasestorage.app",
  messagingSenderId: "564978051586",
  appId: "1:564978051586:web:72f84408fe71505a8b551b",
  measurementId: "G-4FP7WP09E4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

