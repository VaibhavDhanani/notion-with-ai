// Import the functions you need from the SDKs you need
import { getApps, initializeApp,getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTYtrHF5ezWXHpO4ImFXU5Fsqh3KnhcMc",
  authDomain: "notion-clone-ad65d.firebaseapp.com",
  projectId: "notion-clone-ad65d",
  storageBucket: "notion-clone-ad65d.firebasestorage.app",
  messagingSenderId: "123194833329",
  appId: "1:123194833329:web:f0605388bcd70acb352590"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
export {db};