import React, { useEffect, useState } from 'react';
import { Box, Button, Modal, Select, TextField, Typography, FormControl, InputLabel, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { getNoneMembers, addTeamMember, inviteUser } from '../services/TeamServices';

interface NewMemberFormProps {
    open: boolean;
    closeModal: () => void;
    teamId: string;
}

interface TeamMember {
    name: string;
    email: string;
    id: string;
};

const NewMemberForm: React.FC<NewMemberFormProps> = ({ open, closeModal, teamId }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [noneMombersUsers, setNoneMembersUsers] = useState<any[]>([]);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember>({
        name: '',
        email: '',
        id: '',
    });
    const [loading, setLoading] = useState(true);

    const fetchNonMembers = async () => {
        setLoading(true);
        try {
            const { members, error } = await getNoneMembers(teamId);
            if (error) {
                console.error(error);
                return;
            }
            setNoneMembersUsers(members);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    const clearSelectedTeamMember = () => {
        setSelectedTeamMember({
            name: '',
            email: '',
            id: '',
        })
    }

    useEffect(() => {
        fetchNonMembers();
    }, [teamId]);

    const handleSubmit = async () => {

        try {
            let response;

            if (selectedEmail) {
                // Add existing user to the team
                response = await addTeamMember(teamId, selectedTeamMember.id);
            } else {
                // Invite new user
                response = await inviteUser(name, email, teamId);
            }
    
            const { error, status } = response;
            
            if (error) {
                console.error(error);
                return;
            }
    
            if (status === 200) {
                setName('');
                setEmail('');
                setSelectedEmail('');
                clearSelectedTeamMember();
                fetchNonMembers();
            }
        } catch (error) {
            console.error(error);
        } finally {
            closeModal();
        }
    };
    

    const handleClose = () => {
        clearSelectedTeamMember();
        setName('');
        setEmail('');
        setSelectedEmail('');
        closeModal();
    };

    const handleSelectChange = (e: SelectChangeEvent<TeamMember>) => {
        const user = e.target.value as TeamMember;
        setSelectedTeamMember(user);
        setSelectedEmail(user.email);
        setName(user.name);  // Set the name input to the selected user's name
        setEmail('');  // Clear the email input when a user is selected
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);  // Update the email input when the user types
        setSelectedEmail('');  // Clear any selection in the Select dropdown
    };

    return (
        <>
            {open && (
                <Modal open={open} onClose={handleClose} sx={{ overflow: 'scroll', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ width: 400, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Add New Member
                        </Typography>
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={selectedEmail ? true : false}
                            />
                            
                            {/* Render either the Select or TextField based on whether an email is selected */}
                            {selectedEmail ? (
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={selectedEmail}
                                    disabled
                                />
                            ) : (
                                <>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel id="selectedEmail-select-label">Select Email</InputLabel>
                                        <Select
                                            labelId="selectedEmail-select-label"
                                            name="selectedEmail"
                                            value={selectedTeamMember}
                                            onChange={handleSelectChange}
                                            label="Select Email"
                                        >
                                            {noneMombersUsers.map((user, index) => (
                                                <MenuItem key={index} value={user}>
                                                    {user.name} - {user.email}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="Or enter new email"
                                        variant="outlined"  
                                        fullWidth
                                        margin="normal"
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                </>
                            )}
                            
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
                                    Add Member
                                </Button>
                            </Box>
                    </Box>
                </Modal>
            )}
        </>
    );
}

export default NewMemberForm;
