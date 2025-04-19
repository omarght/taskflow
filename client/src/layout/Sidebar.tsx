import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import SidebarNav from "../misc/SidebarNav";
import SidebarHeader from "../misc/SidebarHeader";

const SidebarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.custom.darkPaper,
  color: theme.palette.text.primary,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
  [theme.breakpoints.down("md")]: {
    height: "9vh",
  },
}));

const Sidebar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [showMobile, setShowMobile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setShowMobile(false);
    navigate("/login");
  };

  const toggleMobileMenu = () => setShowMobile(prev => !prev);

  return (
    <SidebarContainer>
      <SidebarHeader showMobileMenu={toggleMobileMenu} showMobile={showMobile} />
      <SidebarNav
        showMobile={showMobile}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />
    </SidebarContainer>
  );
};

export default Sidebar;
