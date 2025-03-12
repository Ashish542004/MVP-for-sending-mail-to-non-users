import React from "react";
import ReferralStats from "../components/ReferralStats";

const Dashboard = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Dashboard</h1>
      <div
        style={{
          marginTop: "20px",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>Referral Statistics</h2>
        <ReferralStats />
      </div>
    </div>
  );
};

export default Dashboard;
