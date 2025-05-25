// /src/pages/Friends.js

import { useEffect, useState } from 'react';

import {
    Box,
    Container,
    Divider
} from '@mui/material';
import FriendRequests from '../components/FriendRequests';
import FriendSuggesttions from '../components/FriendSuggestions';
import SentFriendRequests from '../components/SentFriendRequests';

const Friends = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => { }, [refreshKey]);

    const handelRefresh = () => {
        setRefreshKey(ref => ref + 1)
    };
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                { /* Your Friends Requests */}
                <FriendRequests refresher={handelRefresh} refresherKey={refreshKey} />
                <Divider sx={{ my: 4 }} />

                {/* Friend Suggestions Section */}
                <FriendSuggesttions refresher={handelRefresh} refresherKey={refreshKey} />
                <Divider sx={{ my: 4 }} />

                {/* Sent Friend Requests*/}
                <SentFriendRequests refresher={handelRefresh} refresherKey={refreshKey} />
            </Box>
        </Container>
    );
};

export default Friends;