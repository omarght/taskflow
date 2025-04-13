import { Box } from '@mui/material';
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { useTheme, styled } from '@mui/material/styles';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import HowToRegIcon from '@mui/icons-material/HowToReg';

interface SidebarNavProps {
    isAuthenticated: boolean;
    handleLogout: () => void;
    showMobile: boolean;
}

interface NavLinkProps extends RouterLinkProps {
    component?: string | React.ElementType;
}

const SidebarNav = ({ isAuthenticated, handleLogout, showMobile }: SidebarNavProps) => {
  const theme = useTheme();

    const StyledList = styled('ul')(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        listStyleType: 'none',
        padding: '1rem',
        textDecoration: 'none',
        listStyle: 'none',
    }));

    const StyledListItem = styled('li')(({ theme }) => ({
        textDecoration: 'none',
        padding: '12px 16px',
        color: theme.palette.primary.dark,
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '8px',
        '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.default,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        },
    }));

    // Combine MUI and React Router types
    const NavLink = styled(MuiLink)<NavLinkProps>({
        textDecoration: 'none',
        padding: '12px 16px',
        color: theme.palette.primary.dark,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '8px',
        borderRadius: '8px',
        '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.default,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        },
    });

    console.log('showMobile', showMobile);

  return (
    <Box
      component="nav"
      sx={{
        backgroundColor: theme.custom.darkPaper,
        position: 'relative',
        zIndex: 999, // To keep nav below the header
        width: '100%',
        [theme.breakpoints.up('md')]: {
            height: '100%',
        },
        transition: 'all 0.3s ease',
        transform: {
            xs: showMobile ? theme.custom.mobileNavTransform : theme.custom.mobileNavTransformActive,
            md: 'none', // Desktop: no transform at all
        },          
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >

        {isAuthenticated && (
          <StyledList>
            <NavLink component={RouterLink} to="/profile">
                <PersonIcon />Profile
            </NavLink>
            <NavLink component={RouterLink} to="/my-tasks">
              <AssignmentIcon />My Tasks
            </NavLink>
            <NavLink component={RouterLink} to="/teams">
              <GroupsIcon />Teams
            </NavLink>
          </StyledList>
        )}
      <StyledList>
        {!isAuthenticated ? (
          <>
            <NavLink component={RouterLink} to="/login">
              <LockOpenIcon />Login
            </NavLink>
            <NavLink component={RouterLink} to="/signup">
              <HowToRegIcon />Signup
            </NavLink>
          </>
        ) : (
          <StyledListItem onClick={handleLogout}>
            <LogoutIcon />Logout
          </StyledListItem>
        )}
      </StyledList>
    </Box>
  );
};

export default SidebarNav;
