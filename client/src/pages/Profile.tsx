import React, { useEffect, useState } from 'react';
import { styled, Box, Typography, Card, CardContent, Divider, CircularProgress, Avatar, Link as MuiLink } from '@mui/material';
import { Link, useNavigate, LinkProps as RouterLinkProps } from 'react-router-dom';
import Breadcrumbs from '../misc/Breadcrumbs';
import { getCurrentUser } from '../services/UserServices';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1200px',
  margin: '0 auto',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: 2,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
}));

const CardHeader = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  paddingBottom: 0,

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    textAlign: 'left',
    gap: theme.spacing(3),
  },
}));

const AvatarWrapper = styled('div')(({ theme }) => ({
  margin: '0 auto 16px',

  [theme.breakpoints.up('md')]: {
    margin: '0 0 0 16px',
  },
}));

const ProfileDetails = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(2),

  [theme.breakpoints.up('md')]: {
    paddingTop: 0,
  },
}));

const StatsSection = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const StatItem = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 500,

  '& span': {
    color: theme.palette.primary.main,
  },
}));

const TeamsSection = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(3),
}));


interface TeamLinkProps extends RouterLinkProps {
    component?: string | React.ElementType;
}

// Styled TeamLink component
const StyledTeamLink = styled(Link)(({ theme }) => ({
  display: 'inline-block', // Ensures links don't wrap unless needed
  padding: theme.spacing(1, 2), // Consistent padding
  margin: theme.spacing(0.5), // Some spacing between links
  backgroundColor: theme.palette.grey[100], // Light grey background
  color: theme.palette.primary.main, // Main color for text
  textDecoration: 'none', // Remove default underline
  borderRadius: theme.shape.borderRadius, // Rounded corners
  transition: 'all 0.3s ease', // Smooth hover transition
  width: 'max-content',
  '&:hover': {
    backgroundColor: theme.palette.grey[200], // Slightly darker on hover
    transform: 'translateX(2px)', // Subtle lift effect
    color: theme.palette.primary.dark, // Darker text on hover
  },

  '&:active': {
    transform: 'translateX(0)', // Reset on click
  },
}));

// Styled NoTeamsMessage component
const NoTeamsMessage = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2), // Padding around the message
  color: theme.palette.text.secondary, // Secondary text color
  textAlign: 'center', // Center the text
  fontStyle: 'italic', // Italic for emphasis
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  color: theme.palette.error.main,
}));

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await getCurrentUser();
            if (response.status === 401) return navigate('/login');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingContainer><CircularProgress /></LoadingContainer>;
    if (!data) return <ErrorContainer><Typography>Error loading profile.</Typography></ErrorContainer>;

    const { open_tasks, completed_tasks, overdue_tasks_count, task_count, teams } = data;
    const { name, email, created_at, admin } = data.user;

    return (
        <StyledContainer>
            <Breadcrumbs />

            <StyledCard>
                <CardHeader>
                    <AvatarWrapper>
                        <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
                            {name?.charAt(0).toUpperCase()}
                        </Avatar>
                    </AvatarWrapper>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: theme => theme.spacing(1) }}>
                            {name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: theme => theme.spacing(1) }}>
                            {email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: theme => theme.spacing(1) }}>
                            Role: {admin ? 'Admin' : 'Member'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Joined: {new Date(created_at).toLocaleDateString()}
                        </Typography>
                    </Box>
                </CardHeader>

                <ProfileDetails>
                    <Divider sx={{ marginY: theme => theme.spacing(2) }} />

                    <StatsSection>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Task Statistics
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: theme => theme.spacing(2) }}>
                            {[
                                { label: 'Open Tasks', value: open_tasks },
                                { label: 'Completed Tasks', value: completed_tasks },
                                { label: 'Overdue Tasks', value: overdue_tasks_count },
                                { label: 'Total Tasks', value: task_count },
                            ].map((stat) => (
                                <StatItem variant="body1" key={stat.label}>
                                    {stat.label}: <span>{stat.value}</span>
                                </StatItem>
                            ))}
                        </Box>
                    </StatsSection>

                    <Divider sx={{ marginY: theme => theme.spacing(2) }} />

                    <TeamsSection>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Teams
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme => theme.spacing(1) }}>
                        {teams.length ? (
                          teams.map((team: any) => (
                            <StyledTeamLink
                              key={team.id}
                              to={`/teams/${team.id}`}
                            >
                              {team.name.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}    
                            </StyledTeamLink>
                          ))
                        ) : (
                          <NoTeamsMessage variant="body2">
                            No teams yet
                          </NoTeamsMessage>
                        )}
                        </Box>
                    </TeamsSection>
                </ProfileDetails>
            </StyledCard>
        </StyledContainer>
    );
};

export default Profile;