import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { loginSuccess, logout } from "../store/slices/authSlice.ts";

import DashboardPage from "../pages/Dashboard-Page.tsx";
import LoginFlow from "../components/login/LoginFlow.tsx";
import SignupFlow from "../components/signup/SignupFlow.tsx";
import PremiumPage from "../pages/Premium-Page.tsx";
import DownloadPage from "../pages/Download-Page.tsx";
import CreatePlaylistPage from "../pages/CreatePlaylist-Page.tsx";
import Navbar from "./Navbar.tsx";

export default function AppRoutes() {
  const location = useLocation();
  const dispatch = useDispatch();

  const hideNavbarOn = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarOn.some(path => location.pathname.startsWith(path));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(loginSuccess(JSON.parse(storedUser)));
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const userPayload = { id: user.uid, email: user.email, token };
        dispatch(loginSuccess(userPayload));
        localStorage.setItem('user', JSON.stringify(userPayload));
      } else {
        dispatch(logout());
        localStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

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
