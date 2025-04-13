import React, { useState } from 'react';
import LoginForm from '../misc/LoginForm';
import PasswordReset from '../misc/PasswordReset';
import { Box } from '@mui/material';

const LoginPage: React.FC = () => {
    const [passwordReset, setPasswordReset] = useState(false);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            { passwordReset ? (
                <PasswordReset setPasswordReset={setPasswordReset} />
            ) : (
                <LoginForm setPasswordReset={setPasswordReset} />
            )}
        </Box>
    );
};

export default LoginPage;