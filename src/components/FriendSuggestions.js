// /src/components/FriendSuggestions.js

import { useState, useEffect } from 'react';
import API from '../api/api';
import {
    Box,
    Typography,
    Grid,
} from '@mui/material';
import FriendSuggestionCard from './FriendSuggestionCard';


const FriendSuggesttions = ({ refresher, refresherKey }) => {
    const [suggestions, setSuggestions] = useState([]);
    const fetchData = async () => {
        try {
            const suggestionsRes = await API.get('/friends/suggestions');
            setSuggestions(suggestionsRes.data);
        } catch (error) {
            console.error('Error fetching friends data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refresherKey]);

    const handleAddFriend = async (targetUserId, action) => {
        try {
            await API.post(`/friends/action`, { action, targetUserId });
            refresher();
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const handleRequestResponse = async (requestId, action, targetUserId) => {
        try {
            await API.post(`/friends/action`, { requestId, action, targetUserId });
            refresher();
        } catch (error) {
            console.error('Error responding to request:', error);
        }
    };
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Friend Suggestions</Typography>
            {suggestions.length === 0 ? (
                <Typography>No suggestions available</Typography>
            ) : (
                <Grid container spacing={3}>
                    {suggestions.map(user => (
                        <Grid key={user._id}>
                            <FriendSuggestionCard key={user._id} userId={user._id} onAction={handleAddFriend} handleRespond={handleRequestResponse} refresher={refresher} refresherKey={refresherKey}/>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};


export default FriendSuggesttions;