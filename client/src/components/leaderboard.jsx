import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from Firestore, ordered by referralCount in descending order
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("referralCount", "desc"));
        const querySnapshot = await getDocs(q);

        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });

        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load leaderboard. Please try again.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-8">{error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-indigo-100 to-blue-100">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
          Leaderboard
        </h2>
        {users.length > 0 ? (
          <div className="space-y-4">
            {/* MVP Section */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-2xl shadow-lg text-center">
              <h3 className="text-2xl font-bold text-white">MVP 🏆</h3>
              <p className="text-white text-lg mt-2">
                {users[0].name} - {users[0].referralCount} referrals
              </p>
            </div>

            {/* Leaderboard List */}
            <div className="space-y-3">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600 font-semibold">
                      #{index + 1}
                    </span>
                    <span className="text-gray-800">{user.name}</span>
                  </div>
                  <span className="text-gray-600">
                    {user.referralCount} referrals
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
