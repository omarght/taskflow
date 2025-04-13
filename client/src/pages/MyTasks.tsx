import React, { useEffect, useState } from 'react';
import { GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import PriorityGridCell from '../misc/PriorityGridCell';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TaskModal from '../misc/TaskModal';
import { getCurrentUserTasks, deleteTask } from '../services/TaskServices';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; 
import VisibilityIcon from '@mui/icons-material/Visibility';
import MiscForm from '../misc/MiscForm';
import TasksTable from './TaskTable';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import DeleteButton from '../misc/DeleteButton';
import EditButton from '../misc/EditButton';
import Breadcrumbs from '../misc/Breadcrumbs';

const isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed

const MyTasks: React.FC = () => {
    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', flex: 1, minWidth: 150 },
        { field: 'description', headerName: 'Description', flex: 1, minWidth: 200 },
        { 
            field: 'status',
            headerName: 'Status',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => PriorityGridCell({ priority: params.row.status, outlined: true }),
        },
        {
            field: 'importance',
            headerName: 'Priority',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => <PriorityGridCell priority={params.row.importance} />,
        },
        { field: 'start_date', headerName: 'Start Date', flex: 1, minWidth: isMobile? 100 : 150 },
        { field: 'due_date', headerName: 'Due Date', flex: 1, minWidth: isMobile? 100 : 150 },
        { field: 'categoryTitle', headerName: 'Category', flex: 1, minWidth: 120 },
        { field: 'projectTitle', headerName: 'Project', flex: 1, minWidth: 120 },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: isMobile? 100 : 160,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            disableReorder: true,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>                      
                        <EditButton isMobile={isMobile} onClick={() => { setMode({ mode: 'edit', id: params.row.id }); setOpen(true); }}  />
                        <DeleteButton isMobile={isMobile} onClick={() => setMiscOpen(true)} />
                    </Box>
                );
            }
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
    const theme = useTheme();

    const handleClose = () => setOpen(false);
    const handleMiscClose = () => setMiscOpen(false);

    const mapTaskData = (task: any) => ({
        ...task,
        categoryTitle: task.category?.title || 'No Category',
        projectTitle: task.project?.title || 'Personal',
        tags: task.tags.map((tag: any) => tag.title).join(', '),
        start_date: new Date(task.start_date).toLocaleDateString(),
        due_date: new Date(task.due_date).toLocaleDateString(),
    });

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        const { data, error } = await getCurrentUserTasks();

        if (error?.status === 401) {
            navigate('/login');
            return;
        }
        if (error) {
            setError("Failed to fetch tasks. Please try again later.");
            setLoading(false);
            return;
        }
        setRows(data.map(mapTaskData));
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, [navigate]);

    const handleDeleteClick = async (id: string) => {
        setLoading(true);
        try {
            const res = await deleteTask(id);
            if (res.status === 200) {
                setRows(prev => prev.filter(row => row.id !== id));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setMiscOpen(false);
            setLoading(false);
        }
    };

    const handleOpenSelectedTask = (params: any, modeType: "view" | "edit" | "create") => {
        setMode({ mode: modeType, id: params.row.id });
        setOpen(true);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const breadcrumbsPaths = [
        { name: 'Home', path: '/' },
        { name: 'My Tasks', path: '/my-tasks' }
    ];

    return (
        <Box sx={{ p: 2 }}>
            <Grid spacing={1}>
                <Grid size={12}>
                    <Breadcrumbs />
                </Grid>
                <Grid size={12}>
                    <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                        <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>New Personal Task</Button>
                        {selectedRow && (
                            <Button variant="outlined" color="primary" onClick={() => handleOpenSelectedTask(selectedRow, 'view')}>
                                <VisibilityIcon /> View
                            </Button>
                        )}
                    </Box>
                    <TasksTable
                        rows={rows}
                        columns={columns}
                        onRowClick={(params: any) => setSelectedRow(params)}
                        onRowDoubleClick={() => handleOpenSelectedTask(selectedRow, 'view')}
                    />
                </Grid>
            </Grid>
            <TaskModal open={open} handleClose={handleClose} updateTasks={fetchTasks} mode={mode} />
            <MiscForm
                open={miscOpen}
                onClose={handleMiscClose}
                message="Are you sure you want to delete this team?"
                type="confirmation"
                onConfirm={() => handleDeleteClick(selectedRow.id)}
            />
        </Box>
    );
};

export default MyTasks;
