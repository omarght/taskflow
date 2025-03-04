import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTeamMembers } from '../services/TeamServices'; // Import necessary services
import MiscForm from './MiscForm'; // Import MiscForm component
import { Fullscreen } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProjectModal from './ProjectModal';
import { deleteProject } from '../services/ProjectServices';
import MemberCard from './MemberCard';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  start_date: string;
  due_date: string;
}

interface TeamProjectsProps {
  teamId: string;
}

const TeamMembers: React.FC<TeamProjectsProps> = ({ teamId }) => {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [miscOpen, setMiscOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Project modal state
    // const [mode, setMode] = useState({ mode: 'create' as 'view' | 'edit' | 'create', id: 0 });

    const navigate = useNavigate();

    const handleMiscClose = () => setMiscOpen(false);

    const fetchMembers = async () => {
        setLoading(true);
        setError(null);
        const { members, error, status } = await getTeamMembers(teamId);

        if (status === 401) {
            navigate('/login');
            return;
        }
        if (error) {
            setError("Failed to fetch projects. Please try again later.");
            setLoading(false);
            return;
        }
        setMembers(members);
        setLoading(false);
    };

    const handleCreateButton = () => {
        // setMode({ mode: 'create', id: 0 });
        setIsModalOpen(true);
    };

    const handleEditProject = (id: string) => {
        // setMode({ mode: 'edit', id: Number(id) });
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchMembers();
    }, [teamId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Grid width={'%100'} container spacing={1}>
           {members.map((member, index) => (
            <MemberCard key={index} member={member} />
            ))}
        </Grid>
    );
};

export default TeamMembers;