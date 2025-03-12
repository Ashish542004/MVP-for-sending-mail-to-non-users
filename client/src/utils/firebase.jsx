import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getFunctions } from "firebase/functions";

// 🔹 Firebase Configuration (Replace with actual credentials)
const firebaseConfig = {
  apiKey: "AIzaSyBRvgHdSCY9mbnt5TyX1YVWSS5-jkOV4k4",
  authDomain: "mvpproject-a09eb.firebaseapp.com",
  projectId: "mvpproject-a09eb",
  storageBucket: "mvpproject-a09eb.appspot.com",
  messagingSenderId: "248931477656",
  appId: "1:248931477656:web:63268ffdd03e14fdbf08ed",
  measurementId: "G-2H24B1F9Q5",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Initialize Analytics (Only in Browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// 🔹 Initialize Auth & Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const functions = getFunctions(app);

// 🔹 Export Firebase Services
export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  collection,
  signInWithEmailAndPassword,
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  functions,
  analytics,
  serverTimestamp,
};
export default app;
