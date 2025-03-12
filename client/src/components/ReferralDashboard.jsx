import React, { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ReferralDashboard = () => {
  const [referralCode, setReferralCode] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchReferralCode = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setReferralCode(userSnap.data().referralCode || "NoCode");
        }
      }
    };
    fetchReferralCode();
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-indigo-100 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Your Referral Dashboard
        </h2>
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mb-6">
          <p className="text-gray-600 text-lg mb-2">Your Referral Code:</p>
          <p className="text-2xl font-bold text-blue-600">{referralCode}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm mb-6">
          <p className="text-gray-600 text-lg mb-2">Share this link:</p>
          <p className="text-blue-500 break-words">
            https://yourapp.com/signup?ref={referralCode}
          </p>
        </div>
        <button
          onClick={() =>
            navigator.clipboard.writeText(
              `https://yourapp.com/signup?ref=${referralCode}`
            )
          }
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-colors duration-300"
        >
          Copy Referral Link
        </button>
      </div>
    </div>
  );
};

export default ReferralDashboard;
