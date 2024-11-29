import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
  const [showMobile, setShowMobile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setShowMobile(false);
    navigate("/login");
  }

  const showMobileMenu = () => {
    setShowMobile(!showMobile);
  }

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img className="logo" src="https://via.placeholder.com/100" alt="Logo" />
                <h3 className="sidebar-title">Task Manager</h3>
                <button onClick={showMobileMenu} className="menu-btn">
                    <div className={`bar ${showMobile ? 'bar1-active' : ''}`}></div>
                    <div className={`bar ${showMobile ? 'bar2-active' : ''}`}></div>
                    <div className={`bar ${showMobile ? 'bar3-active' : ''}`}></div>
                </button>
            </div>
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
                        <Link className="nav-item right-nav-item" to="/login">
                            Login
                        </Link>
                        <li className="nav-item right-nav-item">Signup</li>
                    </>
                ) : (
                    <li onClick={handleLogout} className="nav-item righ-nav-item">Logout</li>
                )}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;