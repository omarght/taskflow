import React, { useState, useEffect } from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import PriorityGridCell from '../misc/PriorityGridCell';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from 'react-router-dom';
import { getAllTeams, deleteTeam } from '../services/TeamServices';
import TeamModal from '../misc/TeamModal';
import MiscForm from '../misc/MiscForm';

interface TeamsProps {
}

const Teams: React.FC<TeamsProps> = ({}) => {
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            renderCell: (params) => (
                <Link to={`/team/${params.row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {params.value}
                </Link>
            ),
        },
        { field: 'manager', headerName: 'Manager', width: 200 },
        { field: 'user_count', headerName: 'Members Count', width: 150 },
        { field: 'task_count', headerName: 'Tasks', width: 100 },
        { field: 'project_count', headerName: 'Projects', width: 100 },
        { field: 'created_at', headerName: 'Created', width: 125 },
        // { field: 'tags', headerName: 'Tags', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                    <Button onClick={() => { setMiscOpen(true) }} variant="contained" color="error">
                        <DeleteIcon />
                    </Button>
                </ Box>
            )
        }
    ]; 

    const [rows, setRows] = useState<GridRowsProp>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [miscOpen, setMiscOpen] = useState(false);
    const [mode, setMode] = useState({ mode: "create" as "view" | "edit" | "create", id: 0 });
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const navigate = useNavigate();

    const handleClose = () => setOpen(false);
    const handleMiscClose = () => setMiscOpen(false);

    const mapTaskData = (task: any) => ({
        ...task,
        categoryTitle: task.category?.title || 'No Category',
        projectTitle: task.project?.title || 'Personal',
        tags: task.tags.map((tag: any) => tag.title).join(', '),
        start_date: new Date(task.start_date).toLocaleString(),
        due_date: new Date(task.due_date).toLocaleString(),
    });

    const fetchTeams = async () => {
        setLoading(true);
        setError(null);

        const { teams, error, status } = await getAllTeams();
        if (status === 401) {
            navigate('/login');
            return;
        }
        if (error) {
            setError("Failed to fetch tasks. Please try again later.");
            setLoading(false);
            return;
        }

        const teamsWithManagerName = teams.map((team: any) => {
            return {
                ...team,
                manager: team.manager?.name || 'No Manager',
            }
        })
        setRows(teamsWithManagerName);
        setLoading(false);
    };

    useEffect(() => {
        fetchTeams();
    }, [navigate]);

    const handleDeleteClick = async (id:string) => {
        setLoading(true); // Start loading
        try {
            const res = await deleteTeam(id);
            if(res.status === 200) {
                setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            } else {
                console.log('error', res)
            }
        } catch (error) {
            console.log('error', error)
        } finally {
            setMiscOpen(false);
            setLoading(false); // Stop loading
        }
    }

    const handleOpenSelectedTeam = (params: any, modeType: "view" | "edit" | "create") => {
        setMode({ mode: `${modeType}`, id: params.row.id });
        setOpen(true);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Grid container spacing={1}>
            <Grid size={12}>
                <h1 className='section-title'>My Tasks</h1>
            </Grid>
            
            <Grid size={11.5}>
                <Box sx={{ marginBottom: 1, display: 'flex', gap: 1 }}>
                    <Button variant="outlined" color="primary" onClick={() => { setMode({ mode: `create`, id: 0 }); setOpen(true) }}>
                        New Team
                    </Button>
                    { selectedRow && 
                        <Button variant="outlined" color="primary" onClick={() => handleOpenSelectedTeam(selectedRow, 'view')}>
                            <VisibilityIcon /> View
                        </Button>
                    }
                </Box>
                <DataGrid
                    onRowClick={(params) => setSelectedRow(params)} // Handle row click event
                    onRowDoubleClick={() => handleOpenSelectedTeam(selectedRow, 'view')} // Handle double-click event
                    autosizeOptions={{
                        columns: ['title', 'description'],
                        includeOutliers: true,  
                        includeHeaders: false,
                    }}                
                 rows={rows} columns={columns}/>
            </Grid>
            <TeamModal open={open} handleClose={handleClose} updateTeams={fetchTeams} mode={mode} />
            <MiscForm open={miscOpen} onClose={handleMiscClose} message="Are you sure you want to delete this team?" type="confirmation" onConfirm={() => handleDeleteClick(selectedRow.id)} />
        </Grid>
    );
};

export default Teams;