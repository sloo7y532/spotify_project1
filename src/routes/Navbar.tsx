import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import logo from "../assets/spotify-icon.png";

// material ui icons
import SearchIcon from "@mui/icons-material/Search";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // العنصر الجذر (root element) للمكون يجب أن يكون واحدًا فقط
    <nav className="navbar"> {/* دمجت الـ <nav> مع الـ <div> الخارجي */}
      <div className="navbar-left">
        <div className="logo">
          <Link to="/"> {/* عادةً الشعار يكون رابط للصفحة الرئيسية */}
            <img src={logo} alt="Spotify Logo" />
          </Link>
        </div>
        {/*
          إذا كان هذا الجزء يمثل الشريط الجانبي أو عناصر التنقل الرئيسية للصفحة
          فيمكن أن يكون هنا. لكن يجب أن يكون متناسقًا مع الـ Navbar الرئيسي.
          عادةً شريط البحث والعناصر الجانبية تكون في مكونات منفصلة أو جزء من تخطيط الصفحة الرئيسية
          وليس جزءًا من الـ Navbar العلوي.
          إذا كنت تقصد هذا شريط بحث دائم في الـ Navbar، هذا مكانه.
        */}
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
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="What do you want to play?"
            className="search-input"
          />
          <hr className="search-divider" />
          <SplitscreenIcon className="splitscreen-icon" />
        </div>
      </div>

      <div className="navbar-right">
        {/* زر قائمة الجوال (للعرض على الشاشات الصغيرة) */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <MenuIcon />
        </button>
        
        {/* روابط التنقل الرئيسية */}
        <ul className={`nav-links ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}>
          <li><Link to="/">Home</Link></li> {/* أضفت رابط Home هنا لأنه مهم */}
          <li><Link to="/premium">Premium</Link></li>
          <li><Link to="/download">Download</Link></li>
          <hr className="nav-divider" /> {/* فاصل مرئي */}
          <li><Link to="/signup">Signup</Link></li>
          <li>
            <Link to="/login">
              <button className="login-button">Log in</button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;