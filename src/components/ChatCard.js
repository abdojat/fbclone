// /src/components/Chatscard.js


import { useUser } from '../hooks/useUser';
import LoaderWrapper from './LoaderWrapper';
import UserAvatarLink from './UserAvatarLink';
import { Box, ListItem, CircularProgress } from '@mui/material';
import { CHAT } from '../api/endpoints';

const ChatCard = ({ chat }) => {
    const { user: friend, isLoading: friendLoading } = useUser(chat._id);
    if (friendLoading) return <CircularProgress />;
    return (
        <ListItem key={chat._id}>
            <LoaderWrapper loading={friendLoading}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <UserAvatarLink
                        user={friend}
                        subtitle={`${friend.firstName} ${friend.lastName}`}
                        sx={{}}
                        linkToUser={false}
                        goto={CHAT.room(chat._id)}
                    />
                    {chat.unreadCount > 0 && (
                        <span style={{ background: 'red', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '12px' }}>
                            {chat.unreadCount}
                        </span>
                    )}
                </Box>
            </LoaderWrapper>
        </ListItem>

    );
};

export default ChatCard;
