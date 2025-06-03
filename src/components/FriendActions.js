// /src/components/FriendActions.js
import { Box, Button, Chip, CircularProgress } from '@mui/material';
import { useState } from 'react';

/**
 * Renders appropriate buttons or chips depending on:
 * - isOwner (view only)
 * - isFriend
 * - outgoingRequest (request was already sent by current user)
 * - incomingRequest (current user has received a request from targetUser)
 * - otherwise (no relation yet)
 */

const FriendActions = ({
    currentUserId,
    targetUserId,
    incomingRequest,
    outgoingRequest,
    isFriend,
    isYou,
    onAction,
}) => {
    const [loading, setLoading] = useState(false);

    // 1) If it’s the user’s own profile
    if (isYou) {
        return (
            <Box sx={{ ml: 'auto' }}>
                <Chip label="You!" color="success" variant="outlined" />
            </Box>
        );
    }

    // 2) Already friends
    if (isFriend) {
        return (
            <Box sx={{ ml: 'auto' }}>
                <Chip
                    label="Remove"
                    color="error"
                    onClick={async () => {
                        setLoading(true);
                        await onAction(null, 'remove', targetUserId);
                        setLoading(false);
                    }}
                />
                <Chip label="Friends" color="success" variant="outlined" />
            </Box>
        );
    }

    // 3) Outgoing request was sent by current user
    if (outgoingRequest) {
        return (
            <Box sx={{ ml: 'auto' }}>
                <Chip label="Request Sent" color="warning" variant="outlined" />
                <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true);
                        await onAction(outgoingRequest._id, 'cancel', outgoingRequest.recipient);
                        setLoading(false);
                    }}
                >
                    {loading ? <CircularProgress size={16} /> : 'Cancel'}
                </Button>
            </Box>
        );
    }

    // 4) Incoming request from target user
    if (incomingRequest) {
        console.log(incomingRequest);
        return (
            <Box sx={{ ml: 'auto' }}>
                <Button
                    variant="contained"
                    color="success"
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true);
                        await onAction(incomingRequest._id, 'accept', targetUserId);
                        setLoading(false);
                    }}
                >
                    {loading ? <CircularProgress size={16} /> : 'Accept'}
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    disabled={loading}
                    onClick={async () => {
                        setLoading(true);
                        await onAction(incomingRequest._id, 'reject', targetUserId);
                        setLoading(false);
                    }}
                >
                    {loading ? <CircularProgress size={16} /> : 'Reject'}
                </Button>
            </Box>
        );
    }

    // 5) No existing relationship → show “Add Friend”
    return (
        <Box sx={{ ml: 'auto' }}>
            <Button
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={async () => {
                    setLoading(true);
                    await onAction(null, 'add', targetUserId);
                    setLoading(false);
                }}
            >
                {loading ? <CircularProgress size={16} /> : 'Add Friend'}
            </Button>
        </Box>
    );
};

export default FriendActions;
