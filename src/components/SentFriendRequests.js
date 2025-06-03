// /src/components/SentFriendRequests.js

import { useEffect, useState } from 'react';
import API from '../api/api';
import {
    Typography,
    Box,
    Divider,
    List
} from '@mui/material';
import FriendCard from './FriendCard';
import { FRIENDS } from '../api/endpoints'; 
import PageLayout from './PageLayout';

const SentFriendRequests = ({ refresher, refresherKey }) => {
    const [sentFriendRequests, setSentFrinedRequests] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await API.get(FRIENDS.sentRequests);
                setSentFrinedRequests(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refresherKey]);

    return (
        <PageLayout title="Sent Friend Requests">
            <Divider sx={{ mb: 3 }} />
            {sentFriendRequests?.length === 0 ? (
                <Typography>No pending requests</Typography>
            ) : (
                <List>
                    {sentFriendRequests?.map(requ => (
                        <FriendCard key={requ._id} friendId={requ.recipient._id} refresher={refresher} />
                    ))}
                </List>
            )}
        </PageLayout>
    );
};

export default SentFriendRequests;