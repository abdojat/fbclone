// /src/components/FriendRequests.js

import { useEffect, useState } from 'react';
import FriendRequest from './FriendRequest';
import API from '../api/api';
import {
    Typography,
    Box,
    Divider,
    List
} from '@mui/material';

const FriendRequests = ({ refresherKey, refresher }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const friendReqs = await API.get('/friends/requests');
                setFriendRequests(friendReqs.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refresherKey]);

    const handleRequestResponse = async (requestId, action, targetUserId) => {
        try {
            await API.post(`/friends/action`, { requestId, action, targetUserId });
            setFriendRequests(friendRequests.filter(req => req._id !== requestId));
            refresher();
        } catch (error) {
            console.error('Error responding to request:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Friend Requests
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {friendRequests?.length === 0 ? (
                <Typography>No pending requests</Typography>
            ) : (
                <List>
                    {friendRequests?.map(requ => (
                        <FriendRequest key={requ._id} request={requ} onAction={handleRequestResponse} />
                    ))}
                </List>
            )}
        </Box>
    );
};

export default FriendRequests;