import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectTasks } from '../services/ProjectServices';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Box, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TasksTable from '../pages/TaskTable';
import PriorityGridCell from './PriorityGridCell';
import TaskModal from './TaskModal';
import MiscForm from './MiscForm';
import { deleteTask } from '../services/TaskServices';

interface Task {
    id: number;
    title: string;
    status: string;
    assigned_to?: { id: number; name: string };
}

interface ProjectTasksProps {
    projectId: string;
}

const ProjectTasks: React.FC<ProjectTasksProps> = ({ projectId }) => {
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

    const mapTaskData = (task: any) => ({
        ...task,
        categoryTitle: task.category?.title || 'No Category',
        projectTitle: task.project?.title || 'Personal',
        tags: task.tags?.map((tag: any) => tag.title).join(', '),
        start_date: new Date(task.start_date).toLocaleString(),
        due_date: new Date(task.due_date).toLocaleString(),
    });

    const [rows, setRows] = useState<GridRowsProp>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [miscOpen, setMiscOpen] = useState(false);
    const [mode, setMode] = useState({ mode: "create" as "view" | "edit" | "create", id: 0 });
    const [selectedRow, setSelectedRow] = useState<any | null>(null);

    const { id } = useParams<{ id: string }>(); // Extract project ID from URL

    const handleClose = () => setOpen(false);
    const handleMiscClose = () => setMiscOpen(false);

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const { tasks, error } = await getProjectTasks(id!);
            console.log('tasks', tasks);
            if (error) {
                setError('Failed to load tasks.');
            } else {
                setRows(tasks.map(mapTaskData));
            }
        } catch {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
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
    }, [id]);

    const handleOpenSelectedTask = (params: any, modeType: "view" | "edit" | "create") => {
        setMode({ mode: `${modeType}`, id: params.row.id });
        setOpen(true);
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Project Tasks
            </Typography>
            <TasksTable
                rows={rows}
                columns={columns}
                onRowClick={(params: any) => setSelectedRow(params)}
                onRowDoubleClick={() => handleOpenSelectedTask(selectedRow, 'view')}
            />
             <TaskModal open={open} handleClose={handleClose} updateTasks={fetchTasks} mode={mode} />
             <MiscForm open={miscOpen} onClose={handleMiscClose} message="Are you sure you want to delete this team?" type="confirmation" onConfirm={() => handleDeleteClick(selectedRow.id)} />
        </Box>
    );
};

export default ProjectTasks;
