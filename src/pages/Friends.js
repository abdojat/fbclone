// /src/pages/Friends.js

import { useEffect, useState } from 'react';

import {
    Divider
} from '@mui/material';
import FriendRequests from '../components/FriendRequests';
import FriendSuggesttions from '../components/FriendSuggestions';
import SentFriendRequests from '../components/SentFriendRequests';
import LiveSearchBar from '../components/LiveSearchBar';
import PageLayout from '../components/PageLayout';

const Friends = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => { }, [refreshKey]);

    const handelRefresh = () => {
        setRefreshKey(ref => ref + 1)
    };
    return (
        <PageLayout>
            <Divider sx={{ my: 4 }} />
            <LiveSearchBar />
            { /* Your Friends Requests */}
            <FriendRequests refresher={handelRefresh} refresherKey={refreshKey} />
            <Divider sx={{ my: 4 }} />

            {/* Friend Suggestions Section */}
            <FriendSuggesttions refresher={handelRefresh} refresherKey={refreshKey} />
            <Divider sx={{ my: 4 }} />

            {/* Sent Friend Requests*/}
            <SentFriendRequests refresher={handelRefresh} refresherKey={refreshKey} />
        </PageLayout>
    );
};

export default Friends;