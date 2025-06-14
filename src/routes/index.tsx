// src/AppRoutes.tsx

import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import DashboardPage from "../pages/Dashboard-Page.tsx";
import LoginPage from "../components/login/LoginFlow.tsx"; 
import SignupFlow from "../components/signup/SignupFlow.tsx";
import PremiumPage from "../pages/Premium-Page.tsx";
import DownloadPage from "../pages/Download-Page.tsx";
import Navbar from "../routes/Navbar.tsx";
import SignupSuccessScreen from "../components/signup/SignupSuccessScreen.tsx";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login/*" element={<LoginPage />} /> 
        <Route path="/signup/*" element={<SignupFlow />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/signup/success" element={<SignupSuccessScreen />} />
      </Routes>
    </BrowserRouter>
  );
}