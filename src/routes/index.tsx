import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import DashboardPage from "../pages/Dashboard-Page.tsx";
import LoginFlow from "../components/login/LoginFlow.tsx";
import SignupFlow from "../components/signup/SignupFlow.tsx";
import PremiumPage from "../pages/Premium-Page.tsx";
import DownloadPage from "../pages/Download-Page.tsx";
import CreatePlaylistPage from "../pages/CreatePlaylist-Page.tsx";
import Navbar from "./Navbar.tsx";
import { useLocation } from "react-router-dom";

export default function AppRoutes() {
  const location = useLocation();
  const hideNavbarOn = ["/login", "/signup"];

  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login/*" element={<LoginFlow />} />
        <Route path="/signup/*" element={<SignupFlow />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="/create-playlist" element={<CreatePlaylistPage />} />
      </Routes>
    </>
  );
}
