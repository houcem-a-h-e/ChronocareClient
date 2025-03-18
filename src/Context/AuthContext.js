// src/contexts/AuthContext.js
import React, { createContext, useState } from 'react';
import apiRequest from '../Api/apiRequest'; // Adjust the path as necessary

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User state
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state

    const login = async (email, password) => {
        try {
            const response = await apiRequest.post('/auth/login', { email, password });
            setUser(response.data); // Set user data
            setIsAuthenticated(true); // Set authenticated state
            return response.data; // Return user data if needed
        } catch (error) {
            throw error; // Handle error accordingly
        }
    };

    const logout = async () => {
        try {
            await apiRequest.post('/auth/logout');
            setUser(null); // Clear user data
            setIsAuthenticated(false); // Set authenticated state to false
            localStorage.removeItem('token'); // Clear token from local storage
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
