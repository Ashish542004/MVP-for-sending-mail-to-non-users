import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Campaign from "./campaign";
import {
  auth,
  db,
  provider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "../utils/firebase";

const Auth = () => {
  const [name, setName] = useState(""); // New state for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referrerCode, setReferrerCode] = useState("");
  const [user, setUser] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");
    if (refCode) setReferrerCode(refCode);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        navigate("/home");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const generateReferralCode = () =>
    Math.random().toString(36).substr(2, 8).toUpperCase();

  const findReferrerUid = async (code) => {
    if (!code) return null;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", code));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    } else {
      alert("Invalid referral code. Please check and try again.");
      return null;
    }
  };

  const updateReferrerCount = async (referrerUid) => {
    if (!referrerUid) return;

    const referrerRef = doc(db, "users", referrerUid);
    const referrerDoc = await getDoc(referrerRef);

    if (referrerDoc.exists()) {
      const currentCount = referrerDoc.data().referralCount || 0;
      await updateDoc(referrerRef, { referralCount: currentCount + 1 });
    }
  };

  const handleEmailPasswordAuth = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    // Name validation (only for signup)
    if (isSignUp && !name.trim()) {
      alert("Please enter your name.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userId = userCredential.user.uid;
        const newReferralCode = generateReferralCode();

        const referrerUid = await findReferrerUid(referrerCode);

        await setDoc(doc(db, "users", userId), {
          uid: userId,
          name, // Store the name
          email,
          referralCode: newReferralCode,
          referredBy: referrerUid || null,
          referralCount: 0,
          createdAt: serverTimestamp(),
        });

        if (referrerUid) await updateReferrerCount(referrerUid);

        setReferralCode(newReferralCode);
        console.log("User signed up successfully.");
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User signed in successfully.");
      }
      navigate("/home");
    } catch (error) {
      console.error("Authentication error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      setUser(googleUser);

      const userRef = doc(db, "users", googleUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const newReferralCode = generateReferralCode();

        const referrerUid = await findReferrerUid(referrerCode);

        await setDoc(userRef, {
          uid: googleUser.uid,
          name: googleUser.displayName,
          email: googleUser.email,
          referralCode: newReferralCode,
          referredBy: referrerUid || null,
          referralCount: 0,
          createdAt: serverTimestamp(),
        });

        if (referrerUid) await updateReferrerCount(referrerUid);

        setReferralCode(newReferralCode);
        console.log("New Google user stored in Firestore.");
      } else {
        console.log("Google user already exists.");
        setReferralCode(userDoc.data().referralCode);
        setReferralCount(userDoc.data().referralCount || 0);
      }

      navigate("/home");
    } catch (error) {
      console.error("Google Login Error:", error);
      alert(`Google Login Error: ${error.message}`);
    } finally {
      setLoading(false);
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
        {user ? (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Welcome, {user.displayName || user.email}!
            </h2>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="mt-4 text-lg">
              Your Referral Code:{" "}
              <strong className="text-blue-600">{referralCode}</strong>
            </p>
            <p className="text-lg">
              People Referred:{" "}
              <strong className="text-green-600">{referralCount}</strong>
            </p>
            <div className="mt-6 space-x-4">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/signup?ref=${referralCode}`
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Copy Referral Link
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              {isSignUp ? "Sign Up" : "Sign In"}
            </h2>
            {isSignUp && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-200 mb-4"
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-200 mb-4"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-200 mb-4"
            />
            {isSignUp && (
              <input
                type="text"
                value={referrerCode}
                onChange={(e) => setReferrerCode(e.target.value)}
                placeholder="Referral Code (Optional)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-200 mb-4"
              />
            )}
            <button
              onClick={handleEmailPasswordAuth}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300 mb-4"
            >
              {loading
                ? isSignUp
                  ? "Signing Up..."
                  : "Signing In..."
                : isSignUp
                ? "Sign Up"
                : "Sign In"}
            </button>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 transition-colors duration-300 mb-4"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
            <hr className="border-gray-200 my-6" />
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition-colors duration-300 mb-4"
            >
              {loading ? "Signing In..." : "Sign in with Google"}
            </button>
            <hr className="border-gray-200 my-6" />
            <button
              onClick={() => navigate("/campaign")}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
            >
              Join Our Campaign
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
