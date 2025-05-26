// /src/components/SentFriendRequestCard.js

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import {
    Box,
    Avatar,
    Button,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Chip
} from '@mui/material';
import { Link } from 'react-router-dom';

const SentFriendRequestCard = ({ friendId, requestResponse }) => {
    const currentUserId = useAuth().user._id;
    const [currentUser, setCurrentUser] = useState(useAuth().user);
    const [friend, setFriend] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await API.get(`/users/${currentUserId}`);
                setCurrentUser(userRes.data);

                const friendRes = await API.get(`/users/${friendId}`);
                setFriend(friendRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentUserId, friendId]);

    const getRequestId = () => {
        return currentUser?.sentFriendRequests?.find(f => f.recipient === friend._id)?._id;
    };

    return (
        <ListItem key={friendId} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Link
                    to={`/profile/${friend._id}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: 'inherit',
                    }}
                >
                    <ListItemAvatar>
                        <Avatar src={friend.picturePath} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={friend.username}
                        secondary={`${friend.firstName} ${friend.lastName}`}
                    />
                </Link>
            </Box>


            <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                    label="Request Sent"
                    color="warning"
                    variant="outlined"
                />
                <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={async () => {
                        const requestId = getRequestId();
                        if (requestId) {
                            await requestResponse(requestId, 'cancel', friend._id);
                        }
                    }}
                >
                    Cancel
                </Button>
            </Box>
            <Button
                size="small"
                variant="outlined"
                component="a"
                href={`/profile/${friend._id}`}
                sx={{ ml: 1 }}
            >
                View Profile
            </Button>
        </ListItem>
    );
};

export default SentFriendRequestCard;
