import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import DashboardPage from "../pages/Dashboard-Page.tsx";
import LoginPage from "../pages/Login-Page.tsx";
import SignupPage from "../pages/Signup-Page.tsx";
import PremiumPage from "../pages/Premium-Page.tsx";
import DownloadPage from "../pages/Download-Page.tsx";
import Navbar from "./Navbar.tsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/download" element={<DownloadPage />} />
      </Routes>
    </BrowserRouter>

    
  );
}
