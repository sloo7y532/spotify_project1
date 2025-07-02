// src/components/Navbar.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";
import logo from "../assets/spotify-icon.png";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index.ts";
import { logoutUser } from "../services/authService.ts";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher.tsx";

import SearchIcon from "@mui/icons-material/Search";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import MenuIcon from "@mui/icons-material/Menu";

/**
 * Props interface for the Navbar component
 */
interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

/**
 * Navbar Component
 *
 * Main navigation component that provides:
 * - Brand logo and home navigation
 * - Global search functionality
 * - User authentication controls (login/logout)
 * - Language switching capabilities
 * - Responsive mobile menu
 *
 * Features:
 * - Dynamic authentication state handling
 * - Real-time search with parent state updates
 * - Mobile-responsive design with hamburger menu
 * - Internationalization support
 * - Clean logout functionality with navigation
 */
const Navbar = ({ searchTerm, setSearchTerm }: NavbarProps) => {
  const { t } = useTranslation();

  // =============== STATE MANAGEMENT ===============
  // Mobile menu toggle state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Mobile search toggle state
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Redux state for user authentication
  const user = useSelector((state: RootState) => state.auth.user);

  // Navigation and Redux dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =============== EFFECT HOOKS ===============

  /**
   * Close mobile menu when clicking outside of navbar
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.querySelector(".navbar");
      if (navbar && !navbar.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      // Close mobile menu when window is resized to desktop size
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen]);

  // =============== EVENT HANDLERS ===============

  /**
   * Toggles mobile menu visibility
   * Used for responsive navigation on smaller screens
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Handles user logout process
   * Clears authentication state and redirects to home page
   */
  const handleLogout = async () => {
    await logoutUser(dispatch);
    setIsMobileMenuOpen(false);
    navigate("/", { replace: true });
  };

  /**
   * Closes mobile menu when clicking on navigation links
   */
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  /**
   * Toggles mobile search visibility
   */
  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  // =============== RENDER ===============
  return (
    <nav className="navbar">
      {/* Left section: Logo, home, and search */}
      <div className="navbar-left">
        {/* Brand logo with home link */}
        <div className="logo">
          <Link to="/">
            <img src={logo} alt={t("Spotify Logo")} />
          </Link>
        </div>

        {/* Home icon button */}
        <div className="home-icon-container">
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="home-icon"
            >
              <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
            </svg>
          </Link>
        </div>

        {/* Global search container */}
        <div className="search-container">
          <SearchIcon className="search-icon-N" />
          <input
            type="text"
            placeholder={t("What do you want to listen to?")}
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <hr className="search-divider" />
          <SplitscreenIcon className="splitscreen-icon" />
        </div>

        {/* Mobile search container */}
        <div
          className={`mobile-search-container ${isMobileSearchOpen ? "open" : ""}`}
        >
          <SearchIcon className="search-icon-N" />
          <input
            type="text"
            placeholder={t("What do you want to listen to?")}
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus={isMobileSearchOpen}
          />
        </div>
      </div>

      {/* Right section: Language switcher, menu, and authentication */}
      <div className="navbar-right">
        {/* Language switcher component */}
        <div className="language-switcher-container">
          <LanguageSwitcher />
        </div>

        {/* Mobile search toggle button */}
        <button
          className={`mobile-search-button ${isMobileSearchOpen ? "active" : ""}`}
          onClick={toggleMobileSearch}
          aria-label={t("Toggle search")}
          aria-expanded={isMobileSearchOpen}
        >
          <SearchIcon />
        </button>

        {/* Mobile menu toggle button */}
        <button
          className={`mobile-menu-button ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label={t("Toggle mobile menu")}
          aria-expanded={isMobileMenuOpen}
        >
          <MenuIcon />
        </button>

        {/* Navigation links with responsive mobile menu */}
        <ul
          className={`nav-links ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}
        >
          {/* Main navigation links */}
          <li>
            <Link to="/" onClick={handleLinkClick}>
              {t("Home")}
            </Link>
          </li>
          <li>
            <Link to="/premium" onClick={handleLinkClick}>
              {t("Premium")}
            </Link>
          </li>
          <li>
            <Link to="/download" onClick={handleLinkClick}>
              {t("Download")}
            </Link>
          </li>

          {/* Visual divider */}
          <hr className="nav-divider" />

          {/* Authentication-based conditional rendering */}
          {user ? (
            // Logout button for authenticated users
            <li>
              <Link to="/login">
                <button onClick={handleLogout} className="login-button">
                  {t("Logout")}
                </button>
              </Link>
            </li>
          ) : (
            // Signup and login links for unauthenticated users
            <>
              <li>
                <Link to="/signup" onClick={handleLinkClick}>
                  {t("Signup")}
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={handleLinkClick}>
                  <button className="login-button">{t("Login")}</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
