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
            console.log(" the response is ",response.data)
            setUser(response.data); // Set user data
            setIsAuthenticated(true); // Set authenticated state
            return response.data; // Return user data if needed
        } catch (error) {
            console.log("the error is ",error)
            throw error; // Handle error accordingly
        }
    };

    const logout = async () => {
        try {
            await apiRequest.post('/auth/logout');
            localStorage.removeItem('token'); // Clear token from local storage
            setUser(null); // Clear user data
            setIsAuthenticated(false); // Set authenticated state to false
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
