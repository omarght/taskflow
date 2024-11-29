import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [showMobile, setShowMobile] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowMobile(false);
  }

  const showMobileMenu = () => {
    setShowMobile(!showMobile);
  }

  return (
    <header>
      <img className="logo" src="https://via.placeholder.com/100" alt="Logo" />
      <button onClick={showMobileMenu} className="menu-btn">
        <div className={`bar ${showMobile ? 'bar1-active' : ''}`}></div>
        <div className={`bar ${showMobile ? 'bar2-active' : ''}`}></div>
        <div className={`bar ${showMobile ? 'bar3-active' : ''}`}></div>
      </button>
      <nav className={!showMobile? "" : "mobile-active"}>
        <ul className="left-nav">
          {isAuthenticated && (
            <>
                <Link className="nav-item left-nav-item" to="/">
                    Home
                </Link>
                <Link className="nav-item left-nav-item" to="/profile">
                    Profile
                </Link>
                <Link className="nav-item left-nav-item" to="/my-tasks">
                    My Tasks
                </Link>
            </>
          )}
        </ul>
        <ul className="right-nav">
          {!isAuthenticated ? (
            <>
                <Link to="/login">
                <li className="nav-item right-nav-item">Login</li>
                </Link>
                <li className="nav-item right-nav-item">Signup</li>
            </>
          ) : (
            <li onClick={handleLogout} className="nav-item righ-nav-item">Logout</li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
