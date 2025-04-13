import React from 'react';
import { styled } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteButton from './DeleteButton';

const isMobile = window.innerWidth <= 768;
interface MemberCardProps {
    removeMember: (id: string) => Promise<void>;
    member: Member;
}
interface Member {
    id: string;
    name: string;
    email: string;
    open_tasks: number;
    completed_tasks: number;
}

const StyledCard = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 300,
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.3s ease',
    margin: 'auto',

    '&:hover': {
        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
    },

    [theme.breakpoints.up('sm')]: {
        width: '48%',
    },
    [theme.breakpoints.up('md')]: {
        width: '30%',
    },
    [theme.breakpoints.up('lg')]: {
        width: '23%',
    },
}));

const MemberCard: React.FC<MemberCardProps> = ({ member, removeMember }) => {
    return (
        <StyledCard>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        {member.name}
                    </Typography>
                    <DeleteButton
                        onClick={() => removeMember(member.id)}
                        isMobile={isMobile}
                    />
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Email: {member.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Open Tasks: {member.open_tasks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Completed Tasks: {member.completed_tasks}
                    </Typography>
                </Box>
            </CardContent>
        </StyledCard>
    );
};

export default MemberCard;
