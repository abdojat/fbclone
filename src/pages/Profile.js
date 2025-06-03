// /src/pages/Profile.js

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Avatar,
    Button,
    TextField,
    Divider,
    IconButton,
    CircularProgress,
    Tabs,
    Tab,
} from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import API from '../api/api';
import CreatePost from '../components/CreatePost';
import { useAuth } from '../context/AuthContext';
import UserFriends from '../components/UserFriends';
import SavedPosts from '../components/SavedPosts';
import PostFeed from '../components/PostFeed';
import { CHAT, USERS, POSTS, FRIENDS, UPLOAD } from '../api/endpoints';


const Profile = () => {
    const currentUserId = useAuth().user._id;
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [posts, setPosts] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
    const [image, setImage] = useState(null);
    const [isFriend, setIsFriend] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [requestReceived, setRequestReceived] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [userRes, postsRes] = await Promise.all([
                    API.get(USERS.getUser(userId)),
                    API.get(POSTS.userPosts(userId)),
                ]);
                setUser(userRes.data);
                setEditedData(userRes.data);
                setPosts(postsRes.data);
                setIsOwner(userId === currentUserId);
            } catch (error) {
                console.error('Error fetching data:', error);
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId, currentUserId, navigate, refreshKey]);

    useEffect(() => {
        const fetchFriendStatus = async () => {
            try {
                if (userId !== currentUserId) {
                    const myData = await API.get(USERS.getUser(currentUserId));
                    const friends = myData.data.friends;
                    const sentRequests = myData.data.sentFriendRequests.map(r => r.recipient);
                    const receivedRequests = myData.data.friendRequests.map(r => r.sender);
                    setIsFriend(friends.some(f => f.toString() === userId));
                    setRequestSent(sentRequests.some(r => r.toString() === userId));
                    setRequestReceived(receivedRequests.some(r => r.toString() === userId));

                }
            } catch (error) {
                console.error('Error checking friend status:', error);
            }
        };

        fetchFriendStatus();
    }, [userId, currentUserId]);

    const refresher = () => {
        setRefreshKey(refreshKey => refreshKey + 1);
    };
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            if (image) {
                formData.append('image', image);
                const imageRes = await API.post(UPLOAD.image, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const imageUrl = imageRes.data.imageUrl;
                editedData.picturePath = imageUrl;
            }
            const res = await API.put(USERS.getUser(userId), editedData);
            setUser(res.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleFriendAction = async (action) => {
        try {
            setActionLoading(true);
            await API.post(FRIENDS.action, { action, targetUserId: userId });
            if (action === 'remove') setIsFriend(false);
            if (action === 'cancel') setRequestSent(false);
            if (action === 'add') setRequestSent(true);
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRespondToRequest = async (action) => {
        try {
            setActionLoading(true);
            const me = await API.get(USERS.getUser(currentUserId));
            const request = me.data.friendRequests.find(r => r.sender === userId);
            await API.post(FRIENDS.action, {
                action,
                targetUserId: userId,
                requestId: request._id
            });
            if (action === 'accept') setIsFriend(true);
            setRequestReceived(false);
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleStartChat = () => {
        navigate(CHAT.room(user._id));
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box p={4}>
                <Typography variant="h6">User not found</Typography>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4">
                    {isEditing ? (
                        <TextField
                            name="username"
                            value={editedData.username || ''}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    ) : (
                        user.username
                    )}
                </Typography>
                {isOwner && (
                    <IconButton onClick={isEditing ? handleSave : handleEditToggle} disabled={isLoading}>
                        {isLoading ? <CircularProgress size={20} /> : isEditing ? <SaveIcon /> : <EditIcon />}
                    </IconButton>
                )}
                {!isOwner && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleStartChat}
                        sx={{ mt: 2 }}
                    >
                        Message
                    </Button>)
                }
            </Box>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
                <Box flex={1} display="flex" flexDirection="column" alignItems="center">
                    <Avatar
                        src={user.picturePath}
                        sx={{ width: 150, height: 150, mb: 2 }}
                    />
                    {!isOwner && (
                        <Box>
                            {isFriend ? (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleFriendAction('remove')}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <CircularProgress size={20} /> : 'Remove Friend'}
                                </Button>
                            ) : requestSent ? (
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    onClick={() => handleFriendAction('cancel')}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <CircularProgress size={20} /> : 'Cancel Request'}
                                </Button>
                            ) : requestReceived ? (
                                <>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleRespondToRequest('accept')}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? <CircularProgress size={20} /> : 'Accept Request'}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRespondToRequest('reject')}
                                        disabled={actionLoading}
                                        sx={{ ml: 1 }}
                                    >
                                        {actionLoading ? <CircularProgress size={20} /> : 'Reject'}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={() => handleFriendAction('add')}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <CircularProgress size={20} /> : 'Add Friend'}
                                </Button>
                            )}
                        </Box>
                    )}

                    {isEditing && (
                        <Button
                            component="label"
                            startIcon={<AddPhotoAlternate />}
                            disabled={isLoading}
                        >
                            Add Photo
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                    )}
                </Box>

                <Box flex={2}>
                    <Box mb={4}>
                        <Typography variant="h6" gutterBottom>Basic Information</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                            <div>
                                <Typography variant="subtitle2">First Name</Typography>
                                {isEditing ? (
                                    <TextField
                                        name="firstName"
                                        value={editedData.firstName || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                ) : (
                                    <Typography>{user.firstName}</Typography>
                                )}
                            </div>
                            <div>
                                <Typography variant="subtitle2">Last Name</Typography>
                                {isEditing ? (
                                    <TextField
                                        name="lastName"
                                        value={editedData.lastName || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                ) : (
                                    <Typography>{user.lastName}</Typography>
                                )}
                            </div>
                            <div>
                                <Typography variant="subtitle2">Email</Typography>
                                {isEditing ? (
                                    <TextField
                                        name="email"
                                        type="email"
                                        value={editedData.email || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                ) : (
                                    <Typography>{user.email}</Typography>
                                )}
                            </div>
                        </Box>
                    </Box>

                    <Box mb={4}>
                        <Typography variant="h6" gutterBottom>About</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {isEditing ? (
                            <TextField
                                name="bio"
                                label="Bio"
                                multiline
                                rows={4}
                                value={editedData.bio || ''}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        ) : (
                            <Typography>
                                {user.bio || 'No bio yet'}
                            </Typography>
                        )}
                    </Box>

                    {isOwner && !isEditing && (
                        <Box>
                            <Typography variant="h6" gutterBottom>Account Actions</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => navigate('/change-password')}
                            >
                                Change Password
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            <Box mt={4}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                    <Tab label="Posts" />
                    <Tab label="Friends" />
                    {isOwner && <Tab label="Saved" />}
                </Tabs>

                {tabValue === 0 && (
                    <Box>
                        {isOwner && !isEditing && (<CreatePost onPostCreated={() => setRefreshKey(prev => prev + 1)} />)}
                        <Typography variant="h5" gutterBottom>
                            {isOwner ? 'Your Posts' : `${user.firstName}'s Posts`}
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {posts.length === 0 ? (
                            <Typography>
                                {isOwner ? 'You have no posts yet' : 'This user has no posts yet'}
                            </Typography>
                        ) : (
                            <PostFeed userPostsById={userId} />
                        )}
                    </Box>
                )}

                {tabValue === 1 && (
                    <UserFriends userId={userId} userinfo={user} refresher={refresher} />
                )}

                {tabValue === 2 && isOwner && (
                    <SavedPosts />
                )}
            </Box>
        </Box>
    );
};

export default Profile;
