import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    useEffect(() => {
        const ProtectedRoute = async () => {
            try {
                await checkAuth();
            } catch (error) {
                navigate('/login');
            }
        }
        
        ProtectedRoute();
    }, [navigate]);

    return (
        <div>
            <h1>Profile Page</h1>
            <p>Welcome to your profile!</p>
        </div>
    );
};

export default Profile;