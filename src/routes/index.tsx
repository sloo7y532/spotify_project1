import React, { useEffect, useState } from "react";
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
import JobPage from "../pages/Job-Page.tsx";
import AboutPage from "../pages/About-page.tsx";
import LocationPage from "../pages/Location-Page.tsx";
import Navbar from "./Navbar.tsx";
import CreatePlaylistPage from "../pages/CreatePlaylist-Page.tsx";
import BrowsePodcastsPage from "../pages/BrowsePodcasts-Page.tsx";



export default function AppRoutes() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const hideNavbarOn = [
    "/login",
    "/signup",
    "/login/password-or-code",
    "/signup/password",
    "/signup/profile",
    "/signup/terms",
  ];

  const shouldHideNavbar = hideNavbarOn.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(loginSuccess(JSON.parse(storedUser)));
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const userPayload = { id: user.uid, email: user.email, token };
        dispatch(loginSuccess(userPayload));
        localStorage.setItem("user", JSON.stringify(userPayload));
      } else {
        dispatch(logout());
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      {!shouldHideNavbar && (
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}
      <Routes>
        <Route path="/" element={<DashboardPage searchTerm={searchTerm} />} />
        <Route path="/login/*" element={<LoginFlow />} />
        <Route path="/signup/*" element={<SignupFlow />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/download" element={<DownloadPage />} />

        <Route path="/CreatePlaylist-Page" element={<CreatePlaylistPage />} />
        <Route path="/about" element={<AboutPage />} /> 
        <Route path="/location" element={<LocationPage />} />
        <Route path="/job" element={<JobPage/>}/>

        <Route path="/create-playlist" element={<CreatePlaylistPage />} />
        <Route
          path="/create-playlist/:playlistId"
          element={<CreatePlaylistPage />}
        />
        <Route path="/browse-podcasts" element={<BrowsePodcastsPage />} />

      </Routes>
    </>
  );
}
