// /src/components/PostList.js
import { useState, useEffect } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import PostCard from './PostCard';
import PageLayout from '../components/PageLayout';

const PostList = ({ fetchPosts, onUpdatePost, onUnsavePost, emptyMessage = 'No posts available' }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        fetchPosts()
            .then((data) => {
                if (!isMounted) return;
                setPosts(Array.isArray(data) ? data : data.data || []);
            })
            .catch((_) => {
                if (isMounted) setPosts([]);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => {
            isMounted = false;
        };
    }, [fetchPosts]);

    if (loading) {
        return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
    }
    if (!posts || posts.length === 0) {
        return <Typography sx={{ textAlign: 'center', my: 4 }}>{emptyMessage}</Typography>;
    }
    return (
        <PageLayout>
            {posts.map((post) => (
                <PostCard
                    key={post._id}
                    post={post}
                    onUpdate={(updatedPost, deletedId) => {
                        if (deletedId) {
                            setPosts((prev) => prev.filter((p) => p._id !== deletedId));
                        } else if (updatedPost) {
                            setPosts((prev) =>
                                prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
                            );
                        }
                        if (onUpdatePost) onUpdatePost(updatedPost, deletedId);
                    }}
                    onUnsave={(postId) => {
                        setPosts((prev) => prev.filter((p) => p._id !== postId));
                        onUnsavePost && onUnsavePost(postId);
                    }}
                />
            ))}
        </PageLayout>
    );
};

export default PostList;
