// /src/components/Chatscard.js


import { useUser } from '../hooks/useUser';
import LoaderWrapper from './LoaderWrapper';
import UserAvatarLink from './UserAvatarLink';
import { useSocket } from '../context/SocketContext';
import { Box, ListItem, CircularProgress, Badge } from '@mui/material';
import { CHAT } from '../api/endpoints';
import { formatChatDate } from '../utils/dateUtils';

const ChatCard = ({ chat }) => {
    const { user: friend, isLoading: friendLoading } = useUser(chat._id);
    const { onlineUsers } = useSocket();
    const isOnline = onlineUsers.includes(chat._id);
    if (friendLoading) return <CircularProgress />;
    return (
        <ListItem key={chat._id}>
            <LoaderWrapper loading={friendLoading}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            color="success"
                            invisible={!isOnline}
                        >
                            <UserAvatarLink
                                user={friend}
                                subtitle={`${friend.firstName} ${friend.lastName}`}
                                sx={{}}
                                linkToUser={false}
                                goto={CHAT.room(chat._id)}
                            />
                        </Badge>
                        {chat.unreadCount > 0 && (
                            <span style={{ background: 'red', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '12px', marginLeft: 8 }}>
                                {chat.unreadCount}
                            </span>
                        )}
                    </Box>
                    {chat.timestamp && (
                        <span style={{ fontSize: '0.8em', color: '#888', marginLeft: 8 }}>
                            {formatChatDate(chat.timestamp)}
                        </span>
                    )}
                </Box>
            </LoaderWrapper>
        </ListItem>

    );
};

export default ChatCard;
