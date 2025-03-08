//firebaseConfig.jsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDe4E4FohKiT00LoOLzvkT7OalCPF3Qj_4",
  authDomain: "cryptosprint-ff839.firebaseapp.com",
  projectId: "cryptosprint-ff839",
  storageBucket: "cryptosprint-ff839.firebasestorage.app",
  messagingSenderId: "1016521743116",
  appId: "1:1016521743116:web:82e067a3bc7899471d4729"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
export { auth, db, RecaptchaVerifier, signInWithPhoneNumber };
export default app;
