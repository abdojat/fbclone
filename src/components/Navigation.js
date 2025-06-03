// /src/components/Navigation.js


import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Avatar, Box, IconButton, Badge } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useCallback, useEffect, useState } from 'react';
import { useRecentChatsSocket } from '../hooks/useChatSocket';
import API from '../api/api';
import { CHAT, NOTIFICATIONS } from '../api/endpoints';
import { useNewNotificationSocket } from '../hooks/useNotificationSocket';

const Navigation = () => {
    const { user, logout } = useAuth();
    const [unreadMessagesCount, setChats] = useState(0);
    const [unreadNotificationCount, setNotifications] = useState(0)
    const navigate = useNavigate();
    const fetchChats = useCallback(async () => {
        try {
            const chatRes = await API.get(CHAT.recent);
            let cnt = 0;
            chatRes.data.data.forEach(element => {
                cnt += element.unreadCount;
            });
            setChats(cnt);
        } catch (err) {
            console.error('Failed to fetch chats', err);
        }
    }, []);


    const fetchNotifications = useCallback(async () => {
        try {
            const notifRes = await API.get(NOTIFICATIONS.all);
            let cnt = 0;
            notifRes.data.forEach(element => {
                cnt += !element.isRead;
            });
            setNotifications(cnt);
        } catch (err) {
            console.error('Failed to fetch Notification', err);
        }
    }, []);


    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    useRecentChatsSocket(fetchChats);
    useNewNotificationSocket(fetchNotifications);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="fixed">
            <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {user && (
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                        <IconButton component={Link} to="/" color="inherit">
                            <HomeIcon fontSize="medium" />
                        </IconButton>
                        <IconButton component={Link} to="/friends" color="inherit">
                            <PeopleIcon fontSize="medium" />
                        </IconButton>
                        <IconButton component={Link} to="/chats" color="inherit">
                            <Badge badgeContent={unreadMessagesCount} color="error">
                                <ChatIcon fontSize="medium" />
                            </Badge>
                        </IconButton>
                        <IconButton color="inherit" component={Link} to="/notifications">
                            <Badge badgeContent={unreadNotificationCount} color="error">
                                {unreadNotificationCount > 0 ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
                            </Badge>
                        </IconButton>
                    </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    {user && (
                        <>
                            <Button
                                component={Link}
                                to={`/profile/${user._id}`}
                                startIcon={<Avatar src={user.picturePath} sx={{ width: 24, height: 24 }} />}
                                color="inherit"
                            >
                                {user.username}
                            </Button>
                            <IconButton color="inherit" onClick={handleLogout} >
                                <ExitToAppIcon fontSize='medium' />
                            </IconButton>
                        </>
                    )}
                    {!user && (
                        <>
                            <Button component={Link} to="/login" color="inherit">Login</Button>
                            <Button component={Link} to="/register" color="inherit">Register</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar >
    );
};

export default Navigation;