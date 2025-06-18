// src/components/Navbar.tsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";
import logo from "../assets/spotify-icon.png";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index.ts";
import { logoutUser } from "../services/authService.ts";

import SearchIcon from "@mui/icons-material/Search";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logoutUser(dispatch);
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Spotify Logo" />
          </Link>
        </div>

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

        <div className="search-container">
          <SearchIcon className="search-icon-N" />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            className="search-input"
          />
          <hr className="search-divider" />
          <SplitscreenIcon className="splitscreen-icon" />
        </div>
      </div>

      <div className="navbar-right">
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <MenuIcon />
        </button>

        <ul
          className={`nav-links ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}
        >
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/premium">Premium</Link>
          </li>
          <li>
            <Link to="/download">Download</Link>
          </li>
          <hr className="nav-divider" />

          {user ? (
            <li>
              <Link to="/login">
                <button onClick={handleLogout} className="login-button">
                  Logout
                </button>
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
              <li>
                <Link to="/login">
                  <button className="login-button">Login</button>
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
