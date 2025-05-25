// /src/components/FriendRequset.js


import { useEffect, useState } from 'react';
import API from '../api/api'
import {
    Box,
    Avatar,
    Button,
    ListItem,
    ListItemAvatar,
    ListItemText,
    CircularProgress,
} from '@mui/material';


const FriendRequest = ({ request, onAction }) => {
    const [senderPictureUrl, setSenderPictureUrl] = useState('');
    const [loadingAction, setLoadingAction] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await API.get(`/users/${request.sender._id}/picture`);
            setSenderPictureUrl(response.data.picturePath);
        }
        fetchData();
    }, [request]);

    return (
        <ListItem key={request._id}>
            <ListItemAvatar>
                <Avatar src={senderPictureUrl} />
            </ListItemAvatar>
            <ListItemText
                primary={request.sender.username}
                secondary={`Sent ${new Date(request.createdAt).toLocaleDateString()}`}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    variant="contained"
                    color="success"
                    disabled={loadingAction}
                    onClick={async () => {
                        setLoadingAction(true);
                        await onAction(request._id, 'accept', request.sender._id);
                        setLoadingAction(false);
                    }}
                >
                    {loadingAction ? <CircularProgress size={20} /> : 'Accept'}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    disabled={loadingAction}
                    onClick={async () => {
                        setLoadingAction(true);
                        await onAction(request._id, 'reject', request.sender._id);
                        setLoadingAction(false);
                    }}
                >
                    {loadingAction ? <CircularProgress size={20} /> : 'reject'}
                </Button>
            </Box>
            <Button
                size="small"
                variant="outlined"
                component="a"
                href={`/profile/${request.sender._id}`}
                sx={{ ml: 1 }}
            >
                View Profile
            </Button>
        </ListItem>
    );
};

export default FriendRequest;