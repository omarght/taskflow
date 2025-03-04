import React from 'react';
import SignupForm from '../misc/SignupForm';

const LoginPage: React.FC = () => {

    return (
        <div className="login-page light-gray-bg">
            <div className="login-form-container">
                <SignupForm />
            </div>
        </div>
    );
};

export default LoginPage;