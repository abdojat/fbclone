// /src/pages/ChatsListPage.js


import { useState, useCallback, useEffect } from 'react';
import API from '../api/api';
import { Typography, List, CircularProgress } from '@mui/material';
import ChatCard from '../components/ChatCard';
import { useRecentChatsSocket } from '../hooks/useChatSocket';
import { CHAT } from '../api/endpoints';
import PageLayout from '../components/PageLayout';

const ChatsListPage = () => {
    const [recentChats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchChats = useCallback(async () => {
        setLoading(true);
        try {
            const chatRes = await API.get(CHAT.recent);
            setChats(chatRes.data.data);
        } catch (err) {
            console.error('Failed to fetch chats', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    useRecentChatsSocket(fetchChats);

    if (!Array.isArray(recentChats) && loading) {
        return <CircularProgress sx={{ mt: 4 }} />;
    }
    return (
        <PageLayout title="Your Recent Chats">
            {loading ? (
                <CircularProgress sx={{ mt: 4 }} />
            ) : (
                <List>
                    {recentChats.length === 0 ? (
                        <Typography variant="body1" gutterBottom>
                            No Recent Chats
                        </Typography>
                    ) : (
                        recentChats.map((chat) => <ChatCard key={chat._id} chat={chat} />)
                    )}
                </List>
            )}
        </PageLayout>
    );
};

export default ChatsListPage;
