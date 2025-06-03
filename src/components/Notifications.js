// /src/components/Notifications.js


import { useCallback, useEffect, useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    Typography,
    Button,
    Container
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from 'react-router-dom';
import { CHAT, NOTIFICATIONS } from '../api/endpoints';
import { useNewNotificationSocket } from '../hooks/useNotificationSocket';
import API from '../api/api';

const notificationIcon = (type) => {
    switch (type) {
        case 'message': return <ChatIcon />;
        case 'like': return <FavoriteIcon />;
        case 'comment': return <CommentIcon />;
        case 'friendRequest': return <PersonAddIcon />;
        default: return <NotificationsNoneIcon />;
    }
};

const notificationLink = (notification) => {
    switch (notification.type) {
        case 'message': return CHAT.room(notification.sender._id);
        case 'like': return `/post/${notification.postId._id}`;
        case 'comment': return `/post/${notification.postId._id}`;
        case 'friendRequest': return `/profile/${notification.sender._id}`;
        case 'friendRejected': return `/profile/${notification.sender._id}`;
        case 'friendAccepted': return `/profile/${notification.sender._id}`;
        case 'canceled': return `/profile/${notification.sender._id}`;
        case 'friendRemoved': return `/profile/${notification.sender._id}`;
        default: return '';
    }
}

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const notifRes = await API.get(NOTIFICATIONS.all);
            setNotifications(notifRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch chats', err);
        }
    }, []);


    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useNewNotificationSocket(fetchNotifications);

    const handleMarkAllRead = async () => {
        try {
            setLoading(true);
            await API.patch(NOTIFICATIONS.markAllRead);
            notifications.forEach(notif => ({ ...notif, isRead: true }));
            setLoading(false);
        } catch (err) {
            console.error('Failed to mark all read', err);
        }
    };

    const handleNotificationClick = async (notifId) => {
        try {
            setLoading(true);
            await API.patch(NOTIFICATIONS.markSingleAsRead(notifId));
            const notif = notifications.find(noti => noti._id === notifId);
            notif.isRead = true;
            setLoading(false);
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }


    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, my: 4 }}>
                <Typography variant="h4">Notifications</Typography>
                <Button onClick={handleMarkAllRead} variant="outlined" size="small" disabled={notifications.length === 0 || loading}>
                    Mark all as read
                </Button>
            </Box>
            {notifications.length === 0 ? <Typography sx={{ p: 4 }}>No notifications.</Typography> :
                <List>
                    {notifications.map((notif) => (
                        <Link
                            to={notificationLink(notif)}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            onClick={() => handleNotificationClick(notif._id)}
                        >
                            <ListItem
                                key={notif._id}
                                sx={{
                                    backgroundColor: notif.isRead ? 'transparent' : 'rgba(0, 0, 255, 0.1)',
                                    mb: 1,
                                    borderRadius: 1,
                                }}
                                alignItems="flex-start"
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        {notificationIcon(notif.type)}
                                    </Avatar>
                                </ListItemAvatar>
                                <Box>
                                    <Typography variant="body1">
                                        <strong>{notif.sender.username}</strong>&nbsp;
                                        {notif.type === 'message' && 'sent you a message.'}
                                        {notif.type === 'like' && 'liked your post.'}
                                        {notif.type === 'comment' && 'commented on your post.'}
                                        {notif.type === 'friendRequest' && 'sent you a friend request.'}
                                        {notif.type === 'friendRejected' && 'rejected your friend request.'}
                                        {notif.type === 'friendAccepted' && 'accepted your a friend request.'}
                                        {notif.type === 'canceled' && 'canceled their friend request.'}
                                        {notif.type === 'friendRemoved' && 'removed you as a friend.'}
                                    </Typography>
                                    {notif.content && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            {notif.sender.username} {notif.type === 'message' ? 'sent you: ' : 'commented: '}  {notif.content}
                                        </Typography>
                                    )}
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                            </ListItem>
                        </Link>
                    ))}
                </List>
            }
        </Container>
    );
};

export default Notifications;
