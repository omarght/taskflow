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
import { getTeamMembers, deleteTeamMember } from '../services/TeamServices'; // Import necessary services
import MiscForm from './MiscForm'; // Import MiscForm component
import { Fullscreen } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProjectModal from './ProjectModal';
import { deleteProject } from '../services/ProjectServices';
import MemberCard from './MemberCard';
import NewMemberForm from './NewMemberForm';


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
    const [newMemberFormOpen, setNewMemberFormOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Project modal state
    // const [mode, setMode] = useState({ mode: 'create' as 'view' | 'edit' | 'create', id: 0 });

    const navigate = useNavigate();

    const handleMiscClose = () => setMiscOpen(false);

    const fetchMembers = async () => {
        setLoading(true);
        setError(null);
        const { members, error, status } = await getTeamMembers(teamId);
console.log('members', members);
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
    
    const handleAddMember = () => {
        setNewMemberFormOpen(true);
    };

    useEffect(() => {
        fetchMembers();
    }, [teamId]);

    const handleRemoveMember = async (id: string) => {
        try {
            const { error, status } = await deleteTeamMember(teamId, id);
            if (status === 401) {
                navigate('/login');
                return;
            }
            if (error) {
                console.error(error);
                return;
            }
            setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Box sx={{ mb: 1, display: 'flex', flexDirection: "column", gap: 1, flexWrap: "wrap" }}>
            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                <Button variant="outlined" color="primary" onClick={() => handleAddMember()}>
                    Add Member
                </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', flexWrap: 'wrap', p: 0 }}>
                {members.map((member, index) => (
                    <MemberCard removeMember={() => handleRemoveMember(member.id)} key={index} member={member} />
                ))}
            </Box>
        <NewMemberForm teamId={teamId} closeModal={() => setNewMemberFormOpen(false)} open={newMemberFormOpen} />
        <MiscForm open={miscOpen} onClose={handleMiscClose} message="Are you sure you want to delete this team?" type="confirmation" onConfirm={() => console.log('test')} />
        </Box>
    );
};

export default TeamMembers;