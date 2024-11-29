import React from 'react';
import LoginForm from '../misc/LoginForm';

const LoginPage: React.FC = () => {

    return (
        <div className="login-page light-gray-bg">
            <div className="login-form-container">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;