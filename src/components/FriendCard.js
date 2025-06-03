// /src/components/FriendCard.js


import { useAuth } from '../context/AuthContext';
import UserAvatarLink from './UserAvatarLink';
import {
    ListItem,
    CircularProgress
} from '@mui/material';
import { useUser } from '../hooks/useUser';
import FriendActions from './FriendActions';
import API from '../api/api';
import LoaderWrapper from './LoaderWrapper';
import { FRIENDS } from '../api/endpoints';
const FriendCard = ({ friendId, refresher }) => {
    const currentUserId = useAuth().user._id;
    const { user: currentUser, isLoading: loadingCurrent } = useUser(currentUserId);
    const { user: friend, isLoading: loadingFriend } = useUser(friendId);

    const isFriend = currentUser?.friends?.includes(friend?._id);

    const incomingReq = currentUser?.friendRequests?.find(req => req.sender === friend?._id);
    const outgoingReq = currentUser?.sentFriendRequests?.find(req => req.recipient === friend?._id);
    const isYou = currentUser?._id === friend?._id;

    const handleAction = async (requestId, action, targetUserId) => {
        await API.post(FRIENDS.action, { action, requestId, targetUserId });
        refresher();
    };
    if (loadingCurrent || loadingFriend) return <CircularProgress />

    return (
        <ListItem key={friend._id} sx={{ p: 2 }}>
            <LoaderWrapper loading={loadingCurrent || loadingFriend}>

                <UserAvatarLink user={friend} subtitle={`${friend.firstName} ${friend.lastName}`} />
                <FriendActions
                    currentUserId={currentUserId}
                    targetUserId={friend._id}
                    isYou={isYou}
                    isFriend={isFriend}
                    incomingRequest={incomingReq}
                    outgoingRequest={outgoingReq}
                    onAction={handleAction}
                />
            </LoaderWrapper>
        </ListItem>
    );
};

export default FriendCard;