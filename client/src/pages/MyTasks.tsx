import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import PriorityGridCell from '../misc/PriorityGridCell';


interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', width: 150, editable: true },
    { field: 'description', headerName: 'Description', width: 250, editable: true },
    { 
        field: 'status',
        headerName: 'Status',
        width: 150,
        renderCell: (params) => {
            return PriorityGridCell({ priority: params.row.status, outlined: true });
        }
    },
    {
        field: 'importance',
        headerName: 'Priority',
        width: 100,
        renderCell: (params) => { return <PriorityGridCell priority={params.row.importance} /> }
    },
    { field: 'start_date', headerName: 'Start Date', width: 125, editable: true },
    { field: 'due_date', headerName: 'Due Date', width: 125, editable: true },
    { field: 'categoryTitle', headerName: 'Category', width: 100, editable: true },
    { field: 'projectTitle', headerName: 'Project', width: 100 },
    { field: 'tags', headerName: 'Tags', width: 200, editable: true },
];  

const MyTasks: React.FC = () => {
    const [rows, setRows] = useState<GridRowsProp>([]);
    const Navigate = useNavigate();

    useEffect(() => {
        // Fetch tasks from an API or a local source
        const fetchTasks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/current-user-tasks');
                const data = response.data.map((task: any) => ({
                    ...task,
                    categoryTitle: task.category?.title || 'No Category',
                    projectTitle: task.project?.title || 'Personal',
                    tags: task.tags.map((tag: any) => tag.title).join(', '),
                    start_date: new Date(task.start_date).toLocaleString(),
                    due_date: new Date(task.due_date).toLocaleString()
                }));
                setRows(data)
            } catch (error) {
                if(axios.isAxiosError(error) && error.response?.status === 401) {
                    Navigate('/login');
                    console.log('You are not logged in');
                }
            }
        };

        fetchTasks();
    }, []);

    return (
        <div>
            <h1>My Tasks</h1>
            <div style={{ height: 300, width: '100%' }}>
                <DataGrid
                    autosizeOptions={{
                        columns: ['title', 'description'],
                        includeOutliers: true,
                        includeHeaders: false,
                    }}                
                 rows={rows} columns={columns}/>
            </div>
        </div>
    );
};

export default MyTasks;