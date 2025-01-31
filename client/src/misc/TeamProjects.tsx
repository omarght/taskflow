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
import { getTeamProjects } from '../services/TeamServices'; // Import necessary services
import MiscForm from './MiscForm'; // Import MiscForm component
import { Fullscreen } from '@mui/icons-material';
import { Link } from 'react-router-dom';

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

const TeamProjects: React.FC<TeamProjectsProps> = ({ teamId }) => {
    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', width: 150, renderCell: (params) => <Link to={`/project/${params.row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{params.row.title}</Link> },
        { field: 'description', headerName: 'Description', width: 250 },
        { field: 'task_count', headerName: 'Tasks', width: 150 },
        { field: 'completed_task_count', headerName: 'Completed Tasks', width: 150 },
        { field: 'open_tasks', headerName: 'Open Tasks', width: 150 },
        // { 
        //     field: 'status',
        //     headerName: 'Status',
        //     width: 150,
        //     renderCell: (params) => (
        //         <Chip
        //             label={params.row.status}
        //             color={
        //                 params.row.status === 'Completed' ? 'success' :
        //                 params.row.status === 'In Progress' ? 'warning' :
        //                 'error'
        //             }
        //         />
        //     ),
        // },
        // { field: 'start_date', headerName: 'Start Date', width: 125 },
        // { field: 'due_date', headerName: 'Due Date', width: 125 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                    <Button onClick={() => handleEditProject(params.row.id)} variant="contained" color="success">
                        <EditIcon />
                    </Button>
                    <Button onClick={() => handleDeleteProject(params.row.id)} variant="contained" color="error">
                        <DeleteIcon />
                    </Button>
                </Box>
            )
        }
    ]; 

    const [rows, setRows] = useState<GridRowsProp>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [miscOpen, setMiscOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleMiscClose = () => setMiscOpen(false);

    const mapProjectData = (project: any) => ({
        ...project,
        start_date: new Date(project.start_date).toLocaleString(),
        due_date: new Date(project.due_date).toLocaleString(),
    });

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        const { projects, error, status } = await getTeamProjects(teamId);

        if (status === 401) {
            navigate('/login');
            return;
        }
        if (error) {
            setError("Failed to fetch projects. Please try again later.");
            setLoading(false);
            return;
        }
        setRows(projects.map(mapProjectData));
        setLoading(false);
    };

    const handleViewProject = (id: string) => {
        // Navigate to project detail page or open a modal
        console.log(`View project with id: ${id}`);
    };

    const handleEditProject = (id: string) => {
        // Navigate to project edit page or open a modal
        console.log(`Edit project with id: ${id}`);
    };

    const handleDeleteProject = async (id: string) => {
        setSelectedProjectId(id);
        setMiscOpen(true);
    };

    const confirmDeleteProject = async () => {
        // if (selectedProjectId) {
        //     setLoading(true);
        //     try {
        //         const res = await deleteProject(selectedProjectId);
        //         if (res.status === 200) {
        //             setRows((prevRows) => prevRows.filter((row) => row.id !== selectedProjectId));
        //         } else {
        //             console.log('error', res);
        //         }
        //     } catch (error) {
        //         console.error(error);
        //     } finally {
        //         setMiscOpen(false);
        //         setLoading(false);
        //     }
        // }
    };

    useEffect(() => {
        fetchProjects();
    }, [teamId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Grid width={'%100'} container spacing={1}>
            <Grid size={12}>
                <Box sx={{ marginBottom: 1, display: 'flex', gap: 1 }}>
                    <Button variant="contained" color="primary" onClick={() => handleViewProject('new')}>
                        Add New Project
                    </Button>
                </Box>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    onRowClick={(params) => console.log(params)}
                />
            </Grid>
            <MiscForm 
                open={miscOpen} 
                onClose={handleMiscClose} 
                message="Are you sure you want to delete this project?" 
                type="confirmation" 
                onConfirm={confirmDeleteProject} 
            />
        </Grid>
    );
};

export default TeamProjects;