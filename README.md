make a firebase.jsk file in utils 
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


const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
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
