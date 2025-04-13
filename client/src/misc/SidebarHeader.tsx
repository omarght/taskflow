import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

interface SidebarHeaderProps {
    showMobileMenu: () => void;
    showMobile: boolean;
}

const SidebarHeaderContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    zIndex: 1000,
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
}));

const Logo = styled('img')(({ theme }) => ({
    width: '3rem',
    height: 'auto',
    borderRadius: '50%',
    marginRight: theme.spacing(2),
}));

const MenuButton = styled('button')(({ theme }) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& .bar': {
      width: 25,
      height: 3,
      backgroundColor: theme.palette.primary.main,
      transition: '0.3s',
      margin: '2px 0',
    },
    '& .bar1-active': {
      transform: 'rotate(45deg) translate(5px, 5px)',
    },
    '& .bar2-active': {
      opacity: 0,
    },
    '& .bar3-active': {
      transform: 'rotate(-45deg) translate(5px, -5px)',
    },
    [theme.breakpoints.down('md')]: {
        display: 'flex',
    }
}));

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ showMobileMenu, showMobile }) => {
    return (
        <SidebarHeaderContainer>
            <Logo src="/assets/logo-lg.jpeg" alt="Logo" />
            <SidebarTitle variant="h5" className="sidebar-title">
                Task Manager
            </SidebarTitle>
            <MenuButton onClick={showMobileMenu} className="menu-btn">
                <div className={`bar ${showMobile ? 'bar1-active' : ''}`}></div>
                <div className={`bar ${showMobile ? 'bar2-active' : ''}`}></div>
                <div className={`bar ${showMobile ? 'bar3-active' : ''}`}></div>
            </MenuButton>
        </SidebarHeaderContainer>
    );
}

export default SidebarHeader;

