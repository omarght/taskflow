import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { SelectChangeEvent } from '@mui/material';
import { getCategories, getProjects, createTask, getTaskById, updateTask } from '../services/TaskServices';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress } from '@mui/material';
import { getTeamById, createTeam, updateTeam } from '../services/TeamServices';
import { getAllProjects } from '../services/ProjectServices';
import { Checkbox, ListItemText, OutlinedInput } from '@mui/material';

interface TeamModalProps {
    open: boolean;
    handleClose: () => void;
    updateTeams: () => void;
    mode: {
        mode: 'create' | 'edit' | 'view',
        id: number;
    }
}

type Errors = {
    name: boolean;
    manager: boolean;
};

type Project = {
    id: number;
    title: string;
}

type Manager = {
    id: number;
    name: string;
}

const TeamModal: React.FC<TeamModalProps> = ({ open, handleClose, updateTeams, mode }) => {
    const { loggedInUser } = useAuth();
    
    // Define initial state
    const initialTeamState = {
        id: 0,
        name: '',
        manager: { id: loggedInUser?.id || 0, name: loggedInUser?.name || '' } as Manager,
        user_count: 0,
        task_count: 0,
        project_count: 0,
        projects: [] as Project[],
        created_at: dayjs().toISOString(),
    };

    // Initialize state
    const [team, setTeam] = useState<typeof initialTeamState>(initialTeamState);

    const [errors, setErrors] = useState<Errors>({
        name: false,
        manager: false
    });
    const [loading, setLoading] = useState(false); // New loading state

    // Reset function
    const resetTeamState = () => setTeam(initialTeamState);

    useEffect(() => {
        if (open) {
            if (mode.mode === 'edit' || mode.mode === 'view') {
                getTeamById(`${mode.id}`).then((res) => {
                    console.log(res.team);
                    setTeam(res.team);
                });
            } else {
                resetTeamState();
            }
        }
    }, [open]); // Only depend on `open`

    const verifyInputs = (): boolean => {
        const newErrors: Errors = {
            name: team.name.length === 0,
            manager: team.manager.id === 0
        };

        setErrors(newErrors);

        // If any error exists, the form is invalid
        return !Object.values(newErrors).some((error) => error);
    };   
    

    const handleSaveClick = async () => {
        setLoading(true); // Start loading
        try {
            if (verifyInputs()) {
                const payload = {
                    manager_id: team.manager.id,
                    name: team.name,
                }
                const res = await createTeam(payload);
                if (res.status === 201) {
                    updateTeams();
                    resetTeamState();
                    handleClose();
                } else {
                    console.log('error', res);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleUpdateClick = async () => {
        setLoading(true); // Start loading
        try {
            if (verifyInputs()) {
                const payload = {
                    id: team.id,
                    manager_id: team.manager.id,
                    name: team.name,
                }
                const res = await updateTeam(payload);
                if (res.status === 200) {
                    updateTeams();
                    handleClose();
                } else {
                    console.log('error', res);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Stop loading
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTeam((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    return (
        <Modal open={open} onClose={handleClose} sx={{ overflow: 'scroll' }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '5%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 700,
                    bgcolor: 'background.paper',
                    border: '2px solid #FFF',
                    boxShadow: 24,
                    p: 2,
                    borderRadius: 1,
                }}
            >
                <TextField
                    error={errors.name}
                    fullWidth
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    name="name"
                    value={team.name}
                    onChange={handleInputChange}
                />

                <TextField
                    error={errors.manager}
                    disabled
                    fullWidth
                    label="Manager"
                    variant="outlined"
                    margin="normal"
                    name="manager_id"
                    multiline
                    value={team.manager.name}
                    onChange={handleInputChange}
                />

                { mode.mode != "view" &&
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={mode.mode === 'edit' ? handleUpdateClick : handleSaveClick}
                        disabled={loading}
                        sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
                    </Button>
                }
            </Box>
        </Modal>
    );
};

export default TeamModal;
