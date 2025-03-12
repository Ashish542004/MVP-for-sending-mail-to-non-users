import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import ReferralDashboard from "../components/ReferralDashboard";
import ReferralStats from "../components/ReferralStats";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User logged out successfully.");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const handleLeaderboardClick = () => {
    navigate("/leaderboard");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center">
          Welcome to Your Referral Program
        </h1>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>

        {/* Leaderboard Button */}
        <button
          onClick={handleLeaderboardClick}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Leaderboard
        </button>

        {/* Referral Components */}
        <ReferralDashboard />
        <ReferralStats />
      </div>
    </div>
  );
};

export default Home;
