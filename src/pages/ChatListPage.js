// /src/pages/ChatsListPage.js


import { useCallback, useEffect } from 'react';
import API from '../api/api';
import { Typography, List, CircularProgress } from '@mui/material';
import ChatCard from '../components/ChatCard';
import { useRecentChatsSocket } from '../hooks/useChatSocket';
import { CHAT } from '../api/endpoints';
import PageLayout from '../components/PageLayout';
import { useSelector, useDispatch } from 'react-redux';
import { setRecentChats, setLoading } from '../hooks/messageSlice';

const ChatsListPage = () => {
    const dispatch = useDispatch();
    const recentChats = useSelector((state) => state.messages.recentChats);
    const loading = useSelector((state) => state.messages.loading);

    const fetchChats = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const chatRes = await API.get(CHAT.recent);
            console.log(chatRes.data.data);
            dispatch(setRecentChats(chatRes.data.data));
        } catch (err) {
            console.error('Failed to fetch chats', err);
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

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
