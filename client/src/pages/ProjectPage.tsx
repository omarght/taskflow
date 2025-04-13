import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { getProjectById } from '../services/ProjectServices';
import ProjectTasks from '../misc/ProjectTasks';
import Breadcrumbs from '../misc/Breadcrumbs';

const ProjectPage: React.FC = () => {
    const { team_id, id } = useParams<{ team_id: string; id: string }>();
    const [project, setProject] = useState<any>(null);
    const [tab, setTab] = useState(0); // Keeping this in case you use tabs later
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProject = async () => {
        if (!team_id || !id) {
            setError('Missing team or project ID.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { project, error } = await getProjectById(team_id, id);
            if (error) {
                setError('Failed to fetch project details. Please try again.');
            } else {
                setProject(project);
            }
        } catch {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [team_id, id]);

    useEffect(() => {
        if (project) {
            console.log('project', project);
        }
    }, [project]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!project) return <div>No project found.</div>;

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Breadcrumbs />
            <ProjectTasks teamId={team_id} projectId={id!} />
        </Box>
    );
};

export default ProjectPage;
