// src/context/SocketContext.js

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socketRef = useRef();
    if (!socketRef.current) {
        socketRef.current = io('https://fbcloneapi-e7tl.onrender.com', {
            auth: { token },
            transports: ['websocket'],
        });
    }
    const socket = socketRef.current;

    useEffect(() => {
        if (user?._id) {
            socket.emit('join', user._id);
            socket.emit('getOnlineUsers');
        }
    }, [user, socket]);

    useEffect(() => {
        socket.on('onlineUsers', (users) => {
            setOnlineUsers(users);
        });
        return () => {
            socket.off('onlineUsers');
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
