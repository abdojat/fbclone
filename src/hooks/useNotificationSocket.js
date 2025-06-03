// /src/hooks/useNotificationSocket.js


import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';



export function useNewNotificationSocket(fetchNotifications) {
    const { socket } = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (!user || !socket)
            return;
        socket.on('newNotification', (notification) => {
            console.log('newNotif:', notification);
            console.log(notification.recipient === user._id);
            if (notification.recipient === user._id) {
                fetchNotifications();
            }
        });
    }, [user, socket, fetchNotifications]);
}