// /src/pages/ChatPage.js


import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, List, ListItem, CircularProgress, Divider } from '@mui/material';
import ChatInput from '../components/ChatInput';
import API from '../api/api';
import { useChatPageSocket } from '../hooks/useChatSocket';
import { useAuth } from '../context/AuthContext';
import { USERS, CHAT } from '../api/endpoints'; 


const ChatPage = () => {
    const { userId: recipient } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recipientName, setRecipientName] = useState('');
    const messagesEndRef = useRef(null);

    const fetchInitialMessages = useCallback(async () => {
        setLoading(true);
        try {
            const recipientRes = await API.get(USERS.getUser(recipient));
            setRecipientName(recipientRes.data.username);
            const { data } = await API.get(CHAT.room(recipient));
            setMessages(data.data || []);
        } catch (err) {
            console.error('Failed to load messages:', err);
        } finally {
            setLoading(false);
        }
    }, [recipient]);

    const handleNewMessage = (msg) => {
        setMessages((prev) => [...prev, msg]);
    };
    const handleReadReceipt = () => {
        setMessages((prev) =>
            prev.map((m) =>
                String(m.recipient) === String(recipient) && !m.read ? { ...m, read: true } : m
            )
        );
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

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;

    return (
        <Box sx={{ p: 2, height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>
                {recipientName}
            </Typography>
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
                            {/* … bubble styling … */}
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
                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
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
            <ChatInput
                recipient={recipient}
                onSend={(msg) => setMessages((prev) => [...prev, msg])}
            />
        </Box>
    );
};

export default ChatPage;
