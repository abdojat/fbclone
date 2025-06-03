// /src/hooks/useChatSocket.js


import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for ChatsListPage: subscribes to 'receiveMessage' → calls fetchChats
 */
export function useRecentChatsSocket(fetchChats) {
    const { socket } = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (!socket || !user) return;
        socket.on('receiveMessage', (msg) => {
            if (msg.sender === user._id || msg.recipient === user._id) {
                fetchChats();
            }
        });
        return () => {
            socket.off('receiveMessage');
        };
    }, [socket, user, fetchChats]);
}

/**
 * Hook for ChatPage (one-to-one chat):
 * - Joins the room on mount
 * - Listens for 'receiveMessage' and 'readReceipt'
 * - Calls callbacks to update local state
 */

export function useChatPageSocket({
    recipientId,
    onNewMessage,
    onReadReceipt,
    fetchInitialMessages,
}) {
    const { socket } = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (!socket || !user) return;

        socket.emit('join', user._id);

        fetchInitialMessages().then(() => {
            // Immediately mark existing unread messages as read
            socket.emit('markAsRead', {
                sender: recipientId,
                recipient: user._id
            });
        });

        // Listen for new incoming messages
        socket.on('receiveMessage', (msg) => {
            if (msg.sender === recipientId || msg.recipient === recipientId) {
                onNewMessage(msg);
                if (msg.sender === recipientId) {
                    socket.emit('markAsRead', {
                        sender: recipientId,
                        recipient: user._id
                    });
                }
            }
        });

        // Listen for read receipts
        socket.on('readReceipt', (data) => {
            const from = data.recipient;
            const to = data.sender;
            if (String(from) === String(recipientId) && String(to) === String(user._id)) {
                onReadReceipt();
            }
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('readReceipt');
        };
    }, [socket, user, recipientId]);
}
