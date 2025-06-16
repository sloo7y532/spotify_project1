// src/AppRoutes.tsx

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// استيراد صفحاتك/مكوناتك
import DashboardPage from "../pages/Dashboard-Page.tsx";
import LoginFlow from "../components/login/LoginFlow.tsx"; // غيرت الاسم من LoginPage إلى LoginFlow عشان يكون أوضح
import SignupFlow from "../components/signup/SignupFlow.tsx";
import PremiumPage from "../pages/Premium-Page.tsx";
import DownloadPage from "../pages/Download-Page.tsx";
import SignupSuccessScreen from "../components/signup/SignupSuccessScreen.tsx";
import CreatePlaylistPage from "../pages/CreatePlaylist-Page.tsx";
import Navbar from "./Navbar.tsx"; // مسار الاستيراد الصحيح للـ Navbar

export default function AppRoutes() {
  return (
    <BrowserRouter>
      {/* الـ Navbar لازم يكون خارج <Routes> إذا كنت تبيه يظهر في معظم الصفحات */}
      <Navbar /> 
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        {/* استخدام /* للمسارات المتداخلة (nested routes) زي /login/password-or-code */}
        <Route path="/login/*" element={<LoginFlow />} /> 
        {/* استخدام /* للمسارات المتداخلة في تدفق التسجيل */}
        <Route path="/signup/*" element={<SignupFlow />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/signup/success" element={<SignupSuccessScreen />} />
        <Route path="/create-playlist" element={<CreatePlaylistPage />} /> {/* صححت اسم المسار */}
      </Routes>
    </BrowserRouter>
  );
}