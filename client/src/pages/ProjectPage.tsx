import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { getProjectById } from '../services/ProjectServices';
import ProjectTasks from '../misc/ProjectTasks';

interface ProjectPageProps {}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { id } = useParams<{ id: string }>();

    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const ProjectPage: React.FC<ProjectPageProps> = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<any>(null);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const fetchProject = async () => {
        setLoading(true);
        setError(null);
        try {
            const { project, error } = await getProjectById(id!);
            if (error) {
                setError("Failed to fetch project details. Please try again.");
            } else {
                setProject(project);
            }
        } catch (e) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    if (!id) return <div>Project ID not found.</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Typography variant="h4">{project.title}</Typography>
                <Typography variant="subtitle1">{project.description}</Typography>
                <Typography variant="body2">Start: {project.start_date || 'N/A'} - End: {project.end_date || 'N/A'}</Typography>
            </Grid>

            <Grid size={12}>
                <Tabs value={tab} onChange={handleTabChange}>
                    <Tab label="Tasks" />
                    <Tab label="Team" />
                </Tabs>
            </Grid>

            <TabPanel value={tab} index={0}>
                {id ? <ProjectTasks projectId={id} /> : <Typography variant="body1">Project ID is missing</Typography>}
            </TabPanel>
        </Grid>
    );
};

export default ProjectPage;
