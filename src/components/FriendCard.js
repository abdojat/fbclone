// /src/components/FriendCard.js

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
    Chip,
    CircularProgress
} from '@mui/material';


const FriendCard = ({ friend, isOwner, friendAction, requestResponse, onChanged }) => {
    const currentUserId = useAuth().user._id;
    const [currentUser, setCurrentUser] = useState(useAuth().user);
    const [refreshKey, setRefreshKey] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await API.get(`/users/${currentUserId}`);
                await setCurrentUser(userRes.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentUserId, refreshKey]);

    return (
        <ListItem key={friend._id} sx={{ p: 2 }}>
            <ListItemAvatar>
                <Avatar src={friend.picturePath} />
            </ListItemAvatar>
            <ListItemText
                primary={friend.username}
                secondary={`${friend.firstName} ${friend.lastName}`}
            />
            {(isOwner || currentUser?.friends?.some(f => f === friend._id)) && (
                <Box sx={{ ml: 'auto' }}>
                    <Chip
                        label="Remove"
                        color="error"
                        onClick={async () => {
                            await friendAction(friend._id, 'remove');
                            setRefreshKey(refreshKey => refreshKey + 1)
                        }}
                    //disabled={isLoadingFriends}
                    />
                </Box>
            )}
            {!isOwner && currentUser._id && (
                <Box sx={{ ml: 'auto' }}>
                    {currentUser?.friends?.includes(friend._id) ? (
                        <Chip
                            label="Friends"
                            color="success"
                            variant="outlined"
                        />
                    ) : currentUser?.sentFriendRequests?.some(f => f.recipient === friend._id) ? (
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
                                disabled={actionLoading}
                                onClick={async () => {
                                    setActionLoading(true);
                                    await requestResponse(currentUser?.sentFriendRequests?.filter(f => f.recipient === friend._id)[0]._id, 'cancel', currentUser?.sentFriendRequests?.filter(f => f.recipient === friend._id)[0].recipient)
                                    setRefreshKey(refreshKey => refreshKey + 1);
                                    setActionLoading(false);
                                }}
                                
                            >
                                {actionLoading ? <CircularProgress size={20} /> : 'Cancel'}
                            </Button>
                        </Box>
                    ) : currentUser?.friendRequests?.some(f => f.sender === friend._id) ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                size="small"
                                color="success"
                                disabled={actionLoading}
                                onClick={async () => {
                                    setActionLoading(true);
                                    await requestResponse(currentUser?.friendRequests?.filter(f => f.sender === friend._id)[0]._id, 'accept', currentUser?.friendRequests?.filter(f => f.sender === friend._id)[0].sender)
                                    setRefreshKey(ref => ref + 1);
                                    setActionLoading(false);
                                }}
                            // disabled={isLoadingFriends}
                            >
                                {actionLoading ? <CircularProgress size={20} /> : 'Accept'}
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                disabled={actionLoading}
                                color="error"
                                onClick={async () => {
                                    setActionLoading(true);
                                    await requestResponse(currentUser?.friendRequests?.filter(f => f.sender === friend._id)[0]._id, 'reject', currentUser?.friendRequests?.filter(f => f.sender === friend._id)[0].sender)
                                    setRefreshKey(ref => ref + 1);
                                    setActionLoading(false);
                                }
                                }
                            >
                                {actionLoading ? <CircularProgress size={20} /> : 'Reject'}
                            </Button>
                        </Box>
                    ) : currentUser._id === friend._id ?
                        (<Chip
                            label="You!"
                            color="success"
                            variant="outlined"
                        />)
                        : (
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={actionLoading}
                                onClick={async () => {
                                    setActionLoading(true);
                                    await friendAction(friend._id, 'add');
                                    setRefreshKey(ref => ref + 1);
                                    setActionLoading(false);
                                }}
                            >
                                {actionLoading ? <CircularProgress size={20} /> : 'Add Friend'}
                            </Button>
                        )}
                </Box>
            )}
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
    )
};

export default FriendCard;