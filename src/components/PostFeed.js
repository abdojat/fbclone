// /src/components/PostFeed.js

import { useState, useEffect } from 'react';
import API from '../api/api';
import { Box, CircularProgress, Typography } from '@mui/material';
import PostCard from './PostCard';

const PostFeed = ({ friendsOnly, userPostsById }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        let url = '/posts'; // Default: all posts
        if (friendsOnly) url = '/posts/friends/feed';
        else if (userPostsById) url = `/posts/user/${userPostsById}`;

        setLoading(true);
        try {
            const { data } = await API.get(url);
            // Some endpoints return `{ success, data: [...] }`, some just array. Normalize:
            const postList = Array.isArray(data) ? data : (data.data || []);
            setPosts(postList);
        } catch (err) {
            console.error('Failed to load posts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line
    }, [friendsOnly, userPostsById]);


    const handlePostUpdate = (updatedPost, deletedId) => {
        if (deletedId) {
            setPosts(posts => posts.filter(p => p._id !== deletedId));
        } else if (updatedPost) {
            setPosts(posts => posts.map(p => p._id === updatedPost._id ? updatedPost : p));
        }
    };



    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {posts.length === 0 ? (
                <Typography sx={{ textAlign: 'center', my: 4 }}>
                    No posts available
                </Typography>
            ) : (
                posts.map((post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                        onUpdate={(p, deletedId) => handlePostUpdate(p, deletedId)}
                    />
                ))
            )}
        </Box>
    );
};

export default PostFeed;