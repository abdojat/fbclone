// /src/components/SentFriendRequests.js

import { useEffect, useState } from 'react';
import API from '../api/api';
import {
    Typography,
    Box,
    Divider,
    List
} from '@mui/material';
import SentFriendRequestCard from './SentFriendRequestCard';

const SentFriendRequests = ({ refresher, refresherKey }) => {
    const [sentFriendRequests, setSentFrinedRequests] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await API.get(`/friends/sentFriendRequests`);
                console.log(response.data);
                setSentFrinedRequests(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refresherKey ]);

    const handleRequestResponse = async (requestId, action, targetUserId) => {
        try {
            await API.post(`/friends/action`, { requestId, action, targetUserId });
            refresher();
        } catch (error) {
            console.error('Error responding to request:', error);
        }
    };
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Sent Friend Requests
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {sentFriendRequests?.length === 0 ? (
                <Typography>No pending requests</Typography>
            ) : (
                <List>
                    {sentFriendRequests?.map(requ => (
                        <SentFriendRequestCard key={requ._id} isOwner={true} friendId={requ.recipient._id} requestResponse={handleRequestResponse} />
                    ))}
                </List>
            )}
        </Box>
    );
};

export default SentFriendRequests;