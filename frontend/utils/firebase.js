// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "jettai-cbe49.firebaseapp.com",
  projectId: "jettai-cbe49",
  storageBucket: "jettai-cbe49.firebasestorage.app",
  messagingSenderId: "982876452040",
  appId: "1:982876452040:web:8ca17141681a56c4be21fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider =new GoogleAuthProvider