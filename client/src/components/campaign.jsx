import React, { useState } from "react";
import { db } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Campaign = () => {
  const [email, setEmail] = useState("");
  const [referrerCode, setReferrerCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleCampaignSubmit = async () => {
    if (!email.trim() || !referrerCode.trim()) {
      alert("Please enter your email and referral code.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Store participant data in Firestore
      await setDoc(doc(db, "campaignParticipants", email), {
        email,
        referrerCode,
        participatedAt: new Date(),
        formSubmitted: false, // Mark that form is not submitted yet
      });

      setMessage("You have joined the campaign! Redirecting to form...");
      setTimeout(
        () => navigate(`/form?email=${email}&referrer=${referrerCode}`),
        2500
      );
    } catch (error) {
      console.error("Error submitting campaign:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-indigo-100 to-blue-100">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Join Our Campaign
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring focus:ring-blue-200 mb-4"
        />
        <input
          type="text"
          value={referrerCode}
          onChange={(e) => setReferrerCode(e.target.value)}
          placeholder="Enter referral code"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring focus:ring-blue-200 mb-6"
        />
        <button
          onClick={handleCampaignSubmit}
          disabled={loading}
          className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl transition-colors duration-300 ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:from-indigo-600 hover:to-blue-600"
          }`}
        >
          {loading ? "Submitting..." : "Join Campaign"}
        </button>
        {message && (
          <p className="text-green-600 text-center mt-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Campaign;
