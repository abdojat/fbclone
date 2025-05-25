// /src/components/UserFriends.js

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import {
    Box,
    Typography,
    Divider,
    List,
} from '@mui/material';
import FriendCard from './FriendCard';

const UserFriends = ({ userId, userinfo, refresher }) => {
    const currentUserId = useAuth().user._id;
    const [user, setUser] = useState(userinfo);
    const [friends, setFriends] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, friendsRes] = await Promise.all([
                    API.get(`/users/${userId}`),
                    API.get(`/friends/${userId}/friends`),
                ]);
                setUser(userRes.data);
                setFriends(friendsRes.data);
                setIsOwner(userId === currentUserId);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [refreshKey]);


    const handleFriendAction = async (targetUserId, action) => {
        try {
            await API.post(`/friends/action`, { action, targetUserId });
            setRefreshKey(ref => ref + 1);
            refresher && refresher();
        } catch (error) {
            console.error('Error performing friend action:', error);
        }
    };


    const handleRequestResponse = async (requestId, action, targetUserId) => {
        try {
            await API.post(`/friends/action`, { requestId, action, targetUserId });
            setRefreshKey(ref => ref + 1);
        } catch (error) {
            console.error('Error responding to request:', error);
        }
    };
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {isOwner ? 'Your Friends' : `${user.firstName}'s Friends`}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {friends.length === 0 ? (
                <Typography>
                    {isOwner ? 'You have no friends yet' : 'This user has no friends yet'}
                </Typography>
            ) : (
                <List>
                    {friends.map(friend => (
                        <FriendCard key={friend._id} friend={friend} isOwner={isOwner} friendAction={handleFriendAction} requestResponse={handleRequestResponse} />
                    ))}
                </List>
            )}
        </Box>
    )
};

export default UserFriends;