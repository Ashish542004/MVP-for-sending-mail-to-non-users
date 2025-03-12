import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import {
  doc,
  updateDoc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

const Form = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const referrerCode = queryParams.get("referrer");

  useEffect(() => {
    if (!email || !referrerCode) {
      navigate("/"); // Redirect if email or referrerCode is missing
    }
  }, [email, referrerCode, navigate]);

  const handleFormSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const participantRef = doc(db, "campaignParticipants", email);
      const usersRef = collection(db, "users");

      // Check if form is already submitted
      const participantSnap = await getDoc(participantRef);
      if (participantSnap.exists() && participantSnap.data().formSubmitted) {
        setMessage("You have already submitted the form.");
        setLoading(false);
        return;
      }

      // Find the referrer by matching referrerCode to referralCode in users collection
      const q = query(usersRef, where("referralCode", "==", referrerCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn("Referrer not found.");
        setMessage("Referrer not found. Please check the referral code.");
        setLoading(false);
        return;
      }

      // Get the referrer's document reference
      const referrerDoc = querySnapshot.docs[0];
      const referrerRef = doc(db, "users", referrerDoc.id);

      // Update campaign participant entry (mark form as submitted)
      await setDoc(
        participantRef,
        {
          formSubmitted: true,
          name,
          phone,
        },
        { merge: true }
      );

      // Update referrer's referralCount securely
      const currentCount = referrerDoc.data().referralCount || 0;
      await updateDoc(referrerRef, {
        referralCount: currentCount + 1, // Ensuring +1 update
      });

      setMessage("Form submitted successfully! Redirecting...");
      setTimeout(() => navigate("/"), 2500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Complete Your Registration
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring focus:ring-blue-200 mb-4"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring focus:ring-blue-200 mb-6"
        />
        <button
          onClick={handleFormSubmit}
          disabled={loading}
          className={`w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 rounded-xl transition-colors duration-300 ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:from-blue-600 hover:to-green-600"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {message && (
          <p className="text-green-600 text-center mt-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Form;
