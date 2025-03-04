import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

interface MemberCardProps {
    member: Member;
}

interface Member {
    name: string;
    email: string;
    open_tasks: number;
    completed_tasks: number;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
    return (
        <Card sx={{ 
            maxWidth: 300, 
            margin: 2,
            boxShadow: 3,
            '&:hover': { boxShadow: 6 }
        }}>
            <CardContent>
                <Typography 
                    variant="h5" 
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                >
                    {member.name}
                </Typography>
                
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
        </Card>
    );
};

export default MemberCard;