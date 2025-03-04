import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2'; // Import Grid2 from Material UI
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { getTeamTasks } from '../services/TeamServices'; // Import getTeamTasks from TeamServices
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import TeamTaskModal from './TeamTaskModal'; // Import TeamTaskModal component
import MiscForm from './MiscForm'; // Import MiscForm component
import Button from '@mui/material/Button'; // Import Button from Material UI
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import VisibilityIcon from Material UI
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon from Material UI
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon from Material UI
import PriorityGridCell from './PriorityGridCell'; // Import PriorityGridCell component
import TasksTable from '../pages/TaskTable';
import { Task } from '@mui/icons-material';
import { deleteTask } from '../services/TaskServices';


interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface TeamTasksProps {
  teamId: string;
}

const TeamTasks: React.FC<TeamTasksProps> = ({ teamId }) => {
    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'description', headerName: 'Description', width: 250 },
        { 
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => PriorityGridCell({ priority: params.row.status, outlined: true }),
        },
        {
            field: 'importance',
            headerName: 'Priority',
            width: 100,
            renderCell: (params) => <PriorityGridCell priority={params.row.importance} />,
        },
        { field: 'start_date', headerName: 'Start Date', width: 125 },
        { field: 'due_date', headerName: 'Due Date', width: 125 },
        { field: 'categoryTitle', headerName: 'Category', width: 100 },
        { field: 'projectTitle', headerName: 'Project', width: 100 },
        // { field: 'tags', headerName: 'Tags', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                    <Button onClick={() => { setMode({ mode: 'edit', id: params.row.id }); setOpen(true); }} variant="contained" color="success">
                        <EditIcon  />
                    </Button>
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

    const handleOpenSelectedTask = (params: any, modeType: "view" | "edit" | "create") => {
        setMode({ mode: `${modeType}`, id: params.row.id });
        setOpen(true);
    };

    const mapTaskData = (task: any) => ({
        ...task,
        categoryTitle: task.category?.title || 'No Category',
        projectTitle: task.project?.title || 'Personal',
        tags: task.tags?.map((tag: any) => tag.title).join(', '),
        start_date: new Date(task.start_date).toLocaleString(),
        due_date: new Date(task.due_date).toLocaleString(),
    });

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        const { tasks, error, status } = await getTeamTasks(teamId);

        if (status === 401) {
            navigate('/login');
            return;
        }
        if (error) {
            setError("Failed to fetch tasks. Please try again later.");
            setLoading(false);
            return;
        }
        setRows(tasks.map(mapTaskData));
        setLoading(false);
    };

    const handleDeleteClick = async (id:string) => {
        setLoading(true); // Start loading
        try {
            const res = await deleteTask(id);
            if(res.status === 200) {
                setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            } else {
                console.log('error', res)
            }
        } catch (error) {
            console.error(error);
        } finally {
            setMiscOpen(false);
            setLoading(false); // Stop loading
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

  return (
    <Grid container spacing={1}>
            
            <Grid size={12}>
                <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                    <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
                        New Task
                    </Button>
                    { selectedRow && 
                        <Button variant="outlined" color="primary" onClick={() => handleOpenSelectedTask(selectedRow, 'view')}>
                            <VisibilityIcon /> View
                        </Button>
                    }
                </Box>
                <TasksTable
                    rows={rows}
                    columns={columns}
                    onRowClick={(params: any) => setSelectedRow(params)}
                    onRowDoubleClick={() => handleOpenSelectedTask(selectedRow, 'view')}
                />
            </Grid>
            <TeamTaskModal open={open} handleClose={handleClose} updateTasks={fetchTasks} mode={mode} teamId={teamId} />
            <MiscForm open={miscOpen} onClose={handleMiscClose} message="Are you sure you want to delete this team?" type="confirmation" onConfirm={() => handleDeleteClick(selectedRow.id)} />
        </Grid>
  );
};

export default TeamTasks;
