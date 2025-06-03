// /src/components/UserFriends.js

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import {
    Typography,
    Divider,
    List,
} from '@mui/material';
import FriendCard from './FriendCard';
import PageLayout from '../components/PageLayout';
import { USERS, FRIENDS } from '../api/endpoints';

const UserFriends = ({ userId, userinfo, refresher, refreshKey }) => {
    const currentUserId = useAuth().user._id;
    const [user, setUser] = useState(userinfo);
    const [friends, setFriends] = useState([]);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, friendsRes] = await Promise.all([
                    API.get(USERS.getUser(userId)),
                    API.get(FRIENDS.friendsList(userId)),
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

    return (
        <PageLayout title={isOwner ? 'Your Friends' : `${user.firstName}’s Friends`}>
            <Divider sx={{ mb: 3 }} />
            {friends.length === 0 ? (
                <Typography>{isOwner ? 'You have no friends yet' : 'This user has no friends yet'}</Typography>
            ) : (
                <List>
                    {friends.map((friend) => (
                        <FriendCard key={friend._id} friendId={friend._id} refresher={refresher} />
                    ))}
                </List>
            )}
        </PageLayout>
    )
};

export default UserFriends;