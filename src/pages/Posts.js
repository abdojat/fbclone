// /src/pages/Posts.js

import { useState } from 'react';
import {
    Box,
    Container,
    Tabs,
    Tab,
    Typography
} from '@mui/material';
import PostFeed from '../components/PostFeed';
import { useAuth } from '../context/AuthContext';

const Posts = () => {
    const [tabValue, setTabValue] = useState(0);
    const { user } = useAuth();
    const [userPostsById, setUserPostsById] = useState(user._id);

    const handleTabChange = async (event, newValue) => {
        await setUserPostsById(user._id);
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Feed
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Global Posts" />
                        <Tab label="Friends' Posts" />
                        <Tab label="My Posts" />
                    </Tabs>
                </Box>

                {tabValue === 0 && <PostFeed />}
                {tabValue === 1 && <PostFeed friendsOnly />}
                {tabValue === 2 && <PostFeed userPostsById={userPostsById} />}
            </Box>
        </Container>
    );
};

export default Posts;