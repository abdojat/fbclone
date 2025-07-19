// /src/pages/ChatPage.js


import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, List, ListItem, CircularProgress, Divider } from '@mui/material';
import ChatInput from '../components/ChatInput';
import API from '../api/api';
import { useChatPageSocket } from '../hooks/useChatSocket';
import { useAuth } from '../context/AuthContext';
import { USERS, CHAT } from '../api/endpoints';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages, addMessage, markMessagesRead, setLoading } from '../hooks/messageSlice';
import { useSocket } from '../context/SocketContext';
import { Avatar, Badge } from '@mui/material';
import { formatChatDate } from '../utils/dateUtils';
import io from 'socket.io-client';

const ChatPage = () => {
    const { userId: recipient } = useParams();
    const { user } = useAuth();
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.messages.list);
    const loading = useSelector((state) => state.messages.loading);
    const [recipientName, setRecipientName] = useState('');
    const messagesEndRef = useRef(null);
    const { socket, onlineUsers } = useSocket();
    const isRecipientOnline = onlineUsers.includes(recipient);
    const [isTyping, setIsTyping] = useState(false);

    const fetchInitialMessages = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const recipientRes = await API.get(USERS.getUser(recipient));
            setRecipientName(recipientRes.data.username);
            const { data } = await API.get(CHAT.room(recipient));
            dispatch(setMessages(data.data || []));
        } catch (err) {
            console.error('Failed to load messages:', err);
        } finally {
            dispatch(setLoading(false));
        }
    }, [recipient, dispatch]);

    const handleNewMessage = (msg) => {
        dispatch(addMessage(msg));
    };
    const handleReadReceipt = () => {
        dispatch(markMessagesRead(recipient));
    };

    useChatPageSocket({
        recipientId: recipient,
        onNewMessage: handleNewMessage,
        onReadReceipt: handleReadReceipt,
        fetchInitialMessages,
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const handleTyping = ({ sender }) => {
            if (sender === recipient) setIsTyping(true);
        };
        const handleStopTyping = ({ sender }) => {
            if (sender === recipient) setIsTyping(false);
        };
        if (socket) {
            socket.on('typing', handleTyping);
            socket.on('stopTyping', handleStopTyping);
        }
        return () => {
            if (socket) {
                socket.off('typing', handleTyping);
                socket.off('stopTyping', handleStopTyping);
            }
        };
    }, [socket, recipient]);
    
    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

    return (
        <Box sx={{ p: 2, height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" gutterBottom>
                        {recipientName}
                    </Typography>
                    <Badge
                        overlap="circular"
                        variant="dot"
                        color="success"
                        invisible={!isRecipientOnline}
                        sx={{ ml: 1 }}
                    >
                        <Avatar sx={{ width: 24, height: 24 }} />
                    </Badge>
                    <Typography variant="caption" color={isRecipientOnline ? 'green' : 'gray'}>
                        {isRecipientOnline ? 'Online' : 'Offline'}
                    </Typography>
                </Box>
                {isTyping && (
                    <Typography variant="caption" color="primary" sx={{ ml: 0.5 }}>
                        {recipientName} is typing...
                    </Typography>
                )}
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                <List>
                    {messages.map((msg) => (
                        <ListItem
                            key={msg._id || `${msg.sender}-${msg.timestamp}`}
                            sx={{
                                display: 'flex',
                                justifyContent: msg.sender === user._id ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: msg.sender === user._id ? '#DCF8C6' : '#F0F0F0',
                                    p: 1,
                                    borderRadius: 2,
                                    maxWidth: '75%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: 1,
                                }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                    {msg.sender === user._id ? 'You' : recipientName}
                                </Typography>
                                <Typography variant="body1" sx={{ wordBreak: 'break-word', mb: 0.5 }}>
                                    {msg.text}
                                </Typography>
                                <Typography variant="caption" sx={{ alignSelf: 'flex-end', fontSize: '0.7rem' }}>
                                    {formatChatDate(msg.timestamp)}
                                    {msg.sender === user._id && msg.read && (
                                        <span style={{ marginLeft: 8, color: 'blue' }}>✓</span>
                                    )}
                                </Typography>
                            </Box>
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>
            <ChatInput recipient={recipient} />
        </Box>
    );
};

export default ChatPage;
