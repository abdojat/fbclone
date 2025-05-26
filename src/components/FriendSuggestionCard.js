// /src/components/FriendSuggestionCard.js

import { useEffect, useState } from 'react';
import API from '../api/api';
import {
    Avatar,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const FriendSuggestionCard = ({ userId, onAction, handleRespond, refresherKey, refresher }) => {
    const currentUserId = useAuth().user._id;
    const [currentUser, setCurrentUser] = useState(useAuth().user);
    const [user, setUser] = useState({});
    const [hasRequestedMe, setHasRequestedMe] = useState(false);
    const [requestId, setRequestId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUserRes = await API.get(`/users/${currentUserId}`);
                await setCurrentUser(currentUserRes.data)

                const userRes = await API.get(`/users/${userId}`);
                setUser(userRes.data);

                const requestsRes = await API.get(`/friends/requests`);
                const matchingRequest = requestsRes.data.find(req => req.sender._id === userId);
                if (matchingRequest) {
                    setHasRequestedMe(true);
                    setRequestId(matchingRequest._id);
                } else {
                    setHasRequestedMe(false);
                    setRequestId(null);
                }
            } catch (error) {
                console.error('Error fetching suggestion info:', error);
            }
        };

        fetchData();
    }, [userId, currentUserId, requestId, refresherKey]);

    const handle = (requestId, action, targetUserId) => {
        handleRespond(requestId, action, targetUserId);
        refresher();
    };

    return (
        <Grid key={user._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Link to={`/profile/${user._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Avatar
                            src={user.picturePath}
                            sx={{
                                width: 80,
                                height: 80,
                                margin: '0 auto 8px'
                            }}
                        />
                        <Typography variant="h6" component="div">
                            {user.username}
                        </Typography>
                    </Link>

                    <Typography variant="body2" color="text.secondary">
                        {user.mutualFriends > 0
                            ? `${user.mutualFriends} mutual friends`
                            : 'New to the network'}
                    </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    {hasRequestedMe ? (
                        <>
                            <Button
                                size="small"
                                variant="contained"
                                color="success"
                                disabled={loading}
                                onClick={async () => {
                                    setLoading(true);
                                    await handle(currentUser?.friendRequests?.filter(f => f.sender === userId)[0]._id, 'accept', currentUser?.friendRequests?.filter(f => f.sender === userId)[0].sender);
                                    setLoading(false);
                                }}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Accept'}
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                color="error"
                                disabled={loading}
                                onClick={async () => {
                                    setLoading(true);
                                    await handle(currentUser?.friendRequests?.filter(f => f.sender === userId)[0]._id, 'reject', currentUser?.friendRequests?.filter(f => f.sender === userId)[0].sender);
                                    setLoading(false);
                                }}
                            >
                                {loading ? <CircularProgress size={20} /> : 'Reject'}
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="small"
                            variant="contained"
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                await onAction(user._id, 'add');
                                setLoading(false);
                            }}
                        >
                            {loading ? <CircularProgress size={20} /> : 'Add Friend'}
                        </Button>
                    )}
                    <Button
                        size="small"
                        variant="outlined"
                        component="a"
                        href={`/profile/${user._id}`}
                        sx={{ ml: 1 }}
                    >
                        View Profile
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default FriendSuggestionCard;
