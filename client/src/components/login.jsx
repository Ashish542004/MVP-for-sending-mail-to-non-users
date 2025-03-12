import React, { useState } from "react";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  db,
  doc,
  setDoc,
  getDoc,
} from "../utils/firebase";

const Login = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);

      console.log("User signed in:", user);

      // Reference to user document in Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log("Creating new user in Firestore...");
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          referralCode: generateReferralCode(user.uid),
          createdAt: new Date(),
        });
        console.log("User saved to Firestore.");
      } else {
        console.log("User already exists.");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User logged out.");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Function to generate a referral code
  const generateReferralCode = (uid) => {
    return uid.slice(0, 6).toUpperCase(); // Generates a simple referral code
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}!</h2>
          <p>Email: {user.email}</p>
          <p>Your Referral Code: {generateReferralCode(user.uid)}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Login;
