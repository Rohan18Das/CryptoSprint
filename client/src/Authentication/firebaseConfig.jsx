//firebaseConfig.jsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCXRXJSSgeTJgBrs_ioksGRggihPE7kIUg",
  authDomain: "cryptosprint-a0d1d.firebaseapp.com",
  projectId: "cryptosprint-a0d1d",
  storageBucket: "cryptosprint-a0d1d.firebasestorage.app",
  messagingSenderId: "1016743529935",
  appId: "1:1016743529935:web:67c4d1b4e746b870bbd6ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export { auth, db, RecaptchaVerifier, signInWithPhoneNumber };
export default app;
