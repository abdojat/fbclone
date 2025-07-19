// /src/components/ChatInput.js

import { useState, useRef } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { addMessage } from '../hooks/messageSlice';

const ChatInput = ({ recipient }) => {
    const { socket } = useSocket();
    const { user } = useAuth();
    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const typingTimeout = useRef(null);
    const isTyping = useRef(false);

    const handleSend = () => {
        if (!text.trim()) return;
        const message = {
            sender: user._id,
            recipient,
            text: text.trim(),
            timestamp: Date.now()
        };
        socket.emit('sendMessage', message);
        dispatch(addMessage(message));
        setText('');
        if (isTyping.current) {
            socket.emit('stopTyping', { sender: user._id, recipient });
            isTyping.current = false;
        }
    };

    const handleTyping = (e) => {
        setText(e.target.value);
        if (!isTyping.current && e.target.value) {
            console.log('typing');
            socket.emit('typing', { sender: user._id, recipient });
            isTyping.current = true;
        }
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            if (isTyping.current) {
                socket.emit('stopTyping', { sender: user._id, recipient });
                isTyping.current = false;
            }
        }, 1000);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
                fullWidth
                placeholder="Type a message"
                value={text}
                onChange={handleTyping}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSend();
                }}
            />
            <IconButton onClick={handleSend} color="primary">
                <Send />
            </IconButton>
        </Box>
    );
};

export default ChatInput;