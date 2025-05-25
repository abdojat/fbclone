// /src/components/PostCard.js

import { useEffect, useState } from 'react';
import API from '../api/api';
import { getMe } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    CardActions,
    Button,
    Box,
    TextField,
    Divider,
    IconButton
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    Comment,
    Send,
    Bookmark,
    BookmarkBorder
} from '@mui/icons-material';


const PostCard = ({ post, onUpdate, onUnsave }) => {
    const { addSavedPost, removeSavedPost, setUser } = useAuth();
    const { user } = useAuth();
    const [commentText, setCommentText] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [authorImageUrl, setAuthorImageUrl] = useState('');
    const isSaved = user?.savedPosts?.includes(post._id);
    useEffect(() => {
        const fetchData = async () => {
            const response = await API.get(`/users/${post.author._id}/picture`);
            setAuthorImageUrl(response.data.picturePath);
        }
        fetchData();
    }, [post]);
    (async function () {

    })();
    const isLiked = post.likes?.includes(user?._id);

    const handleLike = async () => {
        try {
            const endpoint = isLiked ? `/posts/${post._id}/unlike` : `/posts/${post._id}/like`;
            const { data } = await API.post(endpoint);
            onUpdate(data.data);
        } catch (err) {
            console.error('Like error:', err);
        }
    };
    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            const { data } = await API.post(`/posts/${post._id}/comments`, {
                text: commentText
            });
            onUpdate(data.data);
            setCommentText('');
            setIsCommenting(false);
        } catch (err) {
            console.error('Comment error:', err);
        }
    };

    const handleEdit = () => {
        // Optionally open a modal or inline edit, for now use prompt
        const newContent = prompt('Edit your post:', post.content);
        if (newContent !== null && newContent.trim() !== post.content) {
            API.put(`/posts/${post._id}`, { content: newContent })
                .then(res => onUpdate(res.data))
                .catch(err => alert('Failed to update post'));
        }
    };

    const handleDelete = () => {
        if (window.confirm('Delete this post?')) {
            API.delete(`/posts/${post._id}`)
                .then(() => onUpdate(null, post._id)) // You should filter this post in the parent list
                .catch(err => alert('Failed to delete post'));
        }
    };

    const refreshUser = async () => {
        const { data } = await getMe();
        setUser(data);
    };
    const handleSaveToggle = async () => {
        try {
            if (isSaved) {
                await API.post(`/users/unsave-post/${post._id}`);
                removeSavedPost(post._id);
                if (typeof onUnsave === "function") onUnsave();
            } else {
                await API.post(`/users/save-post/${post._id}`);
                addSavedPost(post._id);
            }
            refreshUser();

        } catch (err) {
            console.log(err);
            alert('Failed to save/unsave post');
        }
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                {/* Author Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={authorImageUrl} alt={post.author?.username} />
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1">
                            {post.author?.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {new Date(post.createdAt).toLocaleString()}
                        </Typography>
                    </Box>
                    {user?._id === post.author?._id && (
                        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                            <Button color="primary" size="small" onClick={handleEdit}>
                                Edit
                            </Button>
                            <Button color="error" size="small" onClick={handleDelete}>
                                Delete
                            </Button>
                        </Box>
                    )}
                    {user?._id !== post.author?._id && (
                        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                            <Button
                                startIcon={isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
                                onClick={handleSaveToggle}
                            >
                                {isSaved ? 'Saved' : 'Save'}
                            </Button>
                        </Box>
                    )}

                </Box>

                {/* Post Content */}
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {post.content}
                </Typography>

                {/* Post Image */}
                {post.imageUrls?.length > 0 && (
                    <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, mt: 2 }}>
                        {post.imageUrls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Post ${index + 1}`}
                                style={{ maxHeight: 300, borderRadius: 8 }}
                            />
                        ))}
                    </Box>
                )}


            </CardContent>

            {/* Like/Comment Actions */}
            <CardActions>
                <Button
                    startIcon={isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                    onClick={handleLike}
                >
                    {post.likes?.length || 0}
                </Button>
                <Button
                    startIcon={<Comment />}
                    onClick={() => setIsCommenting(!isCommenting)}
                >
                    {post.comments?.length || 0}
                </Button>
            </CardActions>

            {/* Comments Section */}
            {
                isCommenting && (
                    <Box sx={{ p: 2 }}>
                        {/* Existing Comments */}
                        {post.comments?.map((comment) => (
                            <Box key={comment._id || comment._id} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar
                                        src={comment.author?.profilePicture}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            mr: 1.5
                                        }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            {comment.author?.username || 'Unknown user'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" sx={{ ml: 4.5 }}>
                                    {comment.text}
                                </Typography>
                                <Divider sx={{ my: 1.5 }} />
                            </Box>
                        ))}

                        {/* Add Comment Form */}
                        <Box sx={{ display: 'flex', mt: 2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <IconButton
                                color="primary"
                                onClick={handleAddComment}
                                disabled={!commentText.trim()}
                            >
                                <Send />
                            </IconButton>
                        </Box>
                    </Box>
                )
            }
        </Card>
    );
};

export default PostCard;