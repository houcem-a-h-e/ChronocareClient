import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    // If user is not authenticated, redirect to login or home
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Otherwise, render the protected component
    return children;
};

export default ProtectedRoute;
