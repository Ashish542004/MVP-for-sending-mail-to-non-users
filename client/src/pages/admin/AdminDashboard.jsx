import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const AdminDashboard = () => {
  const auth = getAuth();
  const db = getFirestore();
  const functions = getFunctions();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().admin) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [auth, db]);

  const sendReferralEmails = async () => {
    if (!isAdmin) {
      alert("You do not have permission to perform this action.");
      return;
    }

    try {
      const sendEmails = httpsCallable(functions, "sendReferralEmails");
      await sendEmails();
      alert("Referral emails sent successfully!");
    } catch (error) {
      alert("Error sending emails: " + error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {isAdmin ? (
        <button
          onClick={sendReferralEmails}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Send Referral Emails
        </button>
      ) : (
        <p>You do not have admin access.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
