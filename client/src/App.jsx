import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Dashboard from "./components/ReferralDashboard";
import Auth from "./components/signup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Campaign from "./components/campaign";
import Form from "./components/form";
import Leaderboard from "./components/leaderboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/campaign" element={<Campaign />} />
        <Route path="/form" element={<Form />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
