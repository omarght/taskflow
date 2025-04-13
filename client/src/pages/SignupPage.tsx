import React from 'react';
import SignupForm from '../misc/SignupForm';
import { Box } from '@mui/material';

const LoginPage: React.FC = () => {

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <SignupForm />
        </Box>
    );
};

export default LoginPage;