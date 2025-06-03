// /src/components/FriendRequests.js

import { useEffect, useState } from 'react';
import API from '../api/api';
import {
    Typography,
    Divider,
    List
} from '@mui/material';
import FriendCard from './FriendCard';
import PageLayout from '../components/PageLayout';
import { FRIENDS } from '../api/endpoints'; 

const FriendRequests = ({ refresherKey, refresher }) => {
    const [friendRequests, setFriendRequests] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const friendReqs = await API.get(FRIENDS.requests);
                setFriendRequests(friendReqs.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refresherKey]);

    return (
        <PageLayout title="Friend Requests">
            <Divider sx={{ mb: 4 }} />
            {friendRequests?.length === 0 ? (
                <Typography>No pending requests</Typography>
            ) : (
                <List>
                    {friendRequests?.map(requ => (
                        <FriendCard key={requ._id} refresher={refresher} friendId={requ.sender._id} />
                    ))}
                </List>
            )}
        </PageLayout>
    );
};

export default FriendRequests;