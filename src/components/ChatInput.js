// /src/components/ChatInput.js

import { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const ChatInput = ({ recipient, onSend }) => {
    const { socket } = useSocket();
    const { user } = useAuth();
    const [text, setText] = useState('');

    const handleSend = () => {
        if (!text.trim()) return;

        const message = {
            sender: user._id,
            recipient,
            text: text.trim(),
            timestamp: Date.now()
        };
        
        socket.emit('sendMessage', message);
        onSend(message);
        setText('');
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
                fullWidth
                placeholder="Type a message"
                value={text}
                onChange={(e) => setText(e.target.value)}
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