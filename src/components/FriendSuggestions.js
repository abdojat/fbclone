// /src/components/FriendSuggestions.js

import { useState, useEffect } from 'react';
import API from '../api/api';
import {
    Box,
    Typography,
    List,
} from '@mui/material';
import FriendCard from './FriendCard';
import { FRIENDS } from '../api/endpoints';
import PageLayout from './PageLayout';

const FriendSuggesttions = ({ refresher, refresherKey }) => {
    const [suggestions, setSuggestions] = useState([]);
    const fetchData = async () => {
        try {
            const suggestionsRes = await API.get(FRIENDS.suggestions);
            setSuggestions(suggestionsRes.data);
        } catch (error) {
            console.error('Error fetching friends data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refresherKey]);

    return (
        <PageLayout title="Friend Suggestions">
            {
                suggestions.length === 0 ? (
                    <Typography>No suggestions available</Typography>
                ) : (
                    <List container spacing={3}>
                        {suggestions.map(user => (
                            <FriendCard key={user._id} friendId={user._id} refresher={refresher} />
                        ))}
                    </List>
                )
            }
        </PageLayout>
    );
};


export default FriendSuggesttions;