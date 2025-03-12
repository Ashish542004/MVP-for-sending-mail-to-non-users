import React, { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

const ReferralStats = () => {
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    const fetchReferralCount = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const count = userSnap.data().referralCount || 0;
          setReferralCount(count);
        }
      }
    };
    fetchReferralCount();
  }, [auth.currentUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-indigo-100 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Your Referral Stats
        </h2>
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
          <p className="text-gray-600 text-lg mb-2">You have referred:</p>
          <p className="text-4xl font-bold text-green-600">
            {referralCount} users!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralStats;
