import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectTasks } from '../services/ProjectServices';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Box, Typography, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TasksTable from '../pages/TaskTable';
import PriorityGridCell from './PriorityGridCell';
import ProjectTaskModal from './ProjectTaskModal';
import MiscForm from './MiscForm';
import { deleteTask } from '../services/TaskServices';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import VisibilityIcon from Material UI
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';

const isMobile = window.innerWidth <= 768; // Adjust breakpoint as needed
interface Task {
    id: number;
    title: string;
    status: string;
    assigned_to?: { id: number; name: string };
}

interface ProjectTasksProps {
    teamId: string | undefined;
    projectId: string;
}

const ProjectTasks: React.FC<ProjectTasksProps> = ({ teamId, projectId }) => {
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
        // { field: 'tags', headerName: 'Tags', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: isMobile? 100 : 160,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            disableReorder: true,
            disableExport: true,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                    <EditButton
                        isMobile={isMobile}
                        onClick={() => { setMode({ mode: 'edit', id: params.row.id });
                        setOpen(true); }}
                    />
                   <DeleteButton isMobile={isMobile} onClick={() => { setMiscOpen(true) }} />
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
            const { tasks, error } = await getProjectTasks(teamId, id);
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

    const handleOpenSelectedTask = (modeType: "view" | "edit" | "create", id?: any) => {
        setMode({ mode: `${modeType}`, id: id ?? null });
        setOpen(true);
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                <Button variant="outlined" color="primary" onClick={() => handleOpenSelectedTask('create')}>
                    New Task
                </Button>
                { selectedRow && 
                    <Button variant="outlined" color="primary" onClick={() => handleOpenSelectedTask('view', selectedRow.row.id)}>
                        <VisibilityIcon /> View
                    </Button>
                }
            </Box>
            <TasksTable
                rows={rows}
                columns={columns}
                onRowClick={(params: any) => setSelectedRow(params)}
                onRowDoubleClick={() => handleOpenSelectedTask('view', selectedRow.row.id)}
            />
             <ProjectTaskModal open={open} handleClose={handleClose} updateTasks={fetchTasks} mode={mode} projectId={projectId} />
             <MiscForm open={miscOpen} onClose={handleMiscClose} message="Are you sure you want to delete this team?" type="confirmation" onConfirm={() => handleDeleteClick(selectedRow.id)} />
        </Box>
    );
};

export default ProjectTasks;
