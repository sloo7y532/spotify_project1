import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAk47u4hPSgspFvNaLwc-JfjC_kHwU7A1E",
  authDomain: "spotify-project-123.firebaseapp.com",
  databaseURL: "https://spotify-project-123-default-rtdb.firebaseio.com",
  projectId: "spotify-project-123",
  messagingSenderId: "564978051586",
  appId: "1:564978051586:web:72f84408fe71505a8b551b",
  measurementId: "G-4FP7WP09E4",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
