import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const ResetPasswordPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const { resetPassword } = useAuth();

  // Make sure token exists
  if (!token) {
    return <div>No reset token provided.</div>;
  }

  const handleSubmit = async () => {
    console.log('here11')
    try {
        console.log('here22')
        const response = await resetPassword(password, confirmPassword, token);
        console.log(response);

        if (response.success) {
            // Redirect to login page
            window.location.href = '/login';
        } else {        
            console.log(response.error);
            setError(response.error || 'Failed to reset password. Please try again.');
        }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="login-page light-gray-bg">
            <div className="login-form-container">
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
                Reset Password
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
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
            />

            <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                onClick={handleSubmit}
            >
                Reset Password
            </Button>
        </Box>
        </div></div>
  );
};

export default ResetPasswordPage;