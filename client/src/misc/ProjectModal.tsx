import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, CircularProgress } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { createProject, getProjectById, updateProject } from '../services/ProjectServices';
import { useAuth } from '../contexts/AuthContext';
import { StyledModal, ModalContent, DateTimeRow, ActionButton } from './ModalComponents';

const isMobile = window.innerWidth <= 768;
interface ProjectModalProps {
    open: boolean;
    handleClose: () => void;
    updateProjects: () => void;
    mode: {
        mode: 'create' | 'edit' | 'view',
        id: number;
    };
    teamId: string; // Pass the teamId to associate the project with a team
}

type Errors = {
    title: boolean;
    description: boolean;
};

const ProjectModal: React.FC<ProjectModalProps> = ({ open, handleClose, updateProjects, mode, teamId }) => {
    const { loggedInUser } = useAuth();
    
    // Define initial state
    const initialProjectState = {
        id: 0,
        title: '',
        description: '',
        start_date: dayjs().toISOString(),
        end_date: dayjs().add(1, 'month').toISOString(),
        team_id: teamId,
    };

    // Initialize state
    const [project, setProject] = useState<typeof initialProjectState>(initialProjectState);
    const [errors, setErrors] = useState<Errors>({ title: false, description: false });
    const [loading, setLoading] = useState(false);

    // Reset function
    const resetProjectState = () => setProject(initialProjectState);

    useEffect(() => {
        if (open) {
            if (mode.mode === 'edit' || mode.mode === 'view') {
                getProjectById(`${teamId}`, `${mode.id}`).then((res) => {
                    setProject(res.project.project);
                });
            } else {
                resetProjectState();
            }
        }
    }, [open, mode.id]);

    const verifyInputs = (): boolean => {
        const newErrors: Errors = {
            title: project.title.length === 0,
            description: project.description.length === 0,
        };

        setErrors(newErrors);

        // If any error exists, the form is invalid
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSaveClick = async () => {
        setLoading(true);
        try {
            if (verifyInputs()) {
                const { id, ...payload } = project; // Keep team_id in the payload
                const res = await createProject(payload);
                if (res.status === 201) {
                    updateProjects();
                    resetProjectState();
                    handleClose();
                } else {
                    console.log('error', res);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClick = async () => {
        setLoading(true);
        try {
            if (verifyInputs()) {
                const payload = {
                    ...project,
                    team_id: teamId,
                };
                const res = await updateProject(payload);
                if (res.status === 200) {
                    updateProjects();
                    handleClose();
                } else {
                    console.log('error', res);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProject((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (name: string, value: Dayjs | null) => {
        if (value) {
            setProject((prev) => ({
                ...prev,
                [name]: value.toISOString(),
            }));
        }
    };

    return (
        <StyledModal open={open} onClose={handleClose} sx={{ overflow: 'scroll' }}>
            <ModalContent isMobile={isMobile}>
                <TextField
                    error={errors.title}
                    fullWidth
                    label="Title"
                    variant="outlined"
                    margin="normal"
                    name="title"
                    value={project.title}
                    onChange={handleInputChange}
                />

                <TextField
                    error={errors.description}
                    fullWidth
                    label="Description"
                    variant="outlined"
                    margin="normal"
                    name="description"
                    multiline
                    rows={4}
                    value={project.description}
                    onChange={handleInputChange}
                />

                <DateTimeRow>
                    <DateTimePicker
                        label="Start Date"
                        value={dayjs(project.start_date)}
                        onChange={(value) => handleDateChange('start_date', value)}
                        sx={{ mt: 2, width: '100%' }}
                    />

                    <DateTimePicker
                        label="End Date"
                        value={dayjs(project.end_date)}
                        onChange={(value) => handleDateChange('end_date', value)}
                        sx={{ mt: 2, width: '100%' }}
                    />
                </DateTimeRow>

                {mode.mode !== "view" && (
                    <ActionButton
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={mode.mode === 'edit' ? handleUpdateClick : handleSaveClick}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
                    </ActionButton>
                )}
            </ModalContent>
        </StyledModal>
    );
};

export default ProjectModal;