import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PasswordResetProps {
    setPasswordReset: (value: boolean) => void;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ setPasswordReset }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { requestPasswordReset } = useAuth(); 
    
    const handleRequestLinkClick = async () => {
        const { success, error } = await requestPasswordReset(email);
        if (success) {
            setPasswordReset(false);
        } else {
            setError(error || 'Failed to send reset link. Please try again.');
        }
    };

    return (
        <Box 
            sx={{ 
                maxWidth: 400, 
                mx: 'auto', 
                mt: 5, 
                p: 3, 
                boxShadow: 3, 
                borderRadius: 2, 
                bgcolor: 'background.paper' 
            }}
        >
            <Typography variant="h5" textAlign="center" mb={3}>
                Password Reset
            </Typography>

            {error && (
                <Typography 
                    variant="body2" 
                    color="error" 
                    textAlign="center" 
                    mb={2}
                >
                    {error}
                </Typography>
            )}

            <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
            />

            <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={handleRequestLinkClick}
            >
                Send Reset Link
            </Button>

            <Typography variant="body2" textAlign="center" mt={2}>
                <Link to="#" onClick={() => setPasswordReset(false)}>Back To Login</Link>
            </Typography>

            <Typography variant="body2" textAlign="center" mt={2}>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </Typography>
        </Box>
    );
};

export default PasswordReset;
