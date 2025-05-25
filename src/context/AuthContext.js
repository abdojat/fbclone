// /src/context/AuthContext.js

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { getMe } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const { data } = await getMe();
                setUser(data);
            } catch (error) {
                console.error('Auth error:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('_id');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('_id', userData._id);
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        navigate('/');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('_id');
        delete API.defaults.headers.common['Authorization'];
        setUser(null);
        navigate('/login');
    };

    const addSavedPost = (postId) => {
        setUser(prev => ({
            ...prev,
            savedPosts: [...(prev.savedPosts || []), postId]
        }));
    };

    const removeSavedPost = (postId) => {
        setUser(prev => ({
            ...prev,
            savedPosts: (prev.savedPosts || []).filter(id => id !== postId)
        }));
    };


    return (
        <AuthContext.Provider value={{ user, loading, login, logout, addSavedPost, removeSavedPost ,setUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);