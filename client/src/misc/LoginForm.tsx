import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface LoginFormProps {
    setPasswordReset: (value: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setPasswordReset }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await login(email, password);
            
            if (response.status === 200) {
                // Redirect to dashboard or home page
                navigate('/');
            } else {
                setError(response.error?.message || 'Login failed. Please try again.');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit} 
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
            <Typography sx={{ color: theme.palette.primary.main }} variant="h5" textAlign="center" mb={3}>
                Login
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

            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
            />

            <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
            >
                Login
            </Button>

            <Typography variant="body2" textAlign="center" mt={2}>
                <Link to="#" onClick={() => setPasswordReset(true)}>Forgot password?</Link>
            </Typography>

            <Typography variant="body2" textAlign="center" mt={2}>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </Typography>
        </Box>
    );
};

export default LoginForm;
