// /src/components/SavedPosts.js


import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Divider,
} from '@mui/material';
import API from '../api/api';
import PostCard from '../components/PostCard';


const SavedPosts = () => {
    const [savedPosts, setSavedPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const savedRes = await API.get('/users/saved-posts');
                setSavedPosts(savedRes.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Your Saved Posts
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {savedPosts.length === 0 ? (
                <Typography>You have no saved posts yet.</Typography>
            ) : (
                savedPosts.map(post => (
                    <PostCard
                        key={post._id}
                        post={post}
                        onUpdate={(updated) => {
                            if (updated === null) setSavedPosts(s => s.filter(p => p._id !== post._id));
                            else setSavedPosts(s => s.map(p => p._id === updated._id ? updated : p));
                        }}
                        onUnsave={() => setSavedPosts(s => s.filter(p => p._id !== post._id))}
                    />
                ))
            )}
        </Box>
    );
};


export default SavedPosts;