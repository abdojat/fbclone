// src/context/SocketContext.js

import { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const socket = io('https://fbcloneapi-e7tl.onrender.com', {
        auth: { token },
        transports: ['websocket'],
    });

    useEffect(() => {
        if (user?._id) {
            socket.emit('join', user._id);
        }
    }, [user, socket]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
