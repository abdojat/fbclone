// /src/components/PostCard.js

import { useState } from 'react';
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
    IconButton,
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    Comment,
    Send,
    Bookmark,
    BookmarkBorder
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import LoaderWrapper from './LoaderWrapper';
import { useConfirm } from '../hooks/useConfirm';
import { USERS, POSTS } from '../api/endpoints';
import { formatDateTime } from '../utils/dateUtils';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PostCard = ({ post, onUpdate, onUnsave }) => {
    const { addSavedPost, removeSavedPost, setUser } = useAuth();
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(post.likes.some(liker => liker._id === user._id));
    const [commentText, setCommentText] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const { user: authorPictureUser, isLoading } = useUser(post.author._id);
    const { askConfirm, ConfirmDialogElement } = useConfirm();
    const authorImageUrl = authorPictureUser?.picturePath;

    const isSaved = user?.savedPosts?.includes(post._id);
    const handleLike = async () => {
        try {
            const endpoint = isLiked ? POSTS.unlike(post._id) : POSTS.like(post._id);
            const { data } = await API.post(endpoint);
            onUpdate(data.data, null);
            setIsLiked(!isLiked);
        } catch (err) {
            console.error('Like error:', err);
        }
    };
    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            const { data } = await API.post(POSTS.comments(post._id), {
                text: commentText
            });
            onUpdate(data.data);
            setCommentText('');
            setIsCommenting(false);
        } catch (err) {
            console.error('Comment error:', err);
        }
    };

    const handleEdit = async () => {
        const newContent = prompt('Edit your post:', post.content);
        if (newContent !== null && newContent.trim() !== post.content) {
            await API.put(POSTS.post(post._id), { content: newContent }).then((res) => {
                onUpdate(res.data);
            });
        }
    };

    const handleDelete = async () => {
        const confirmed = await askConfirm({
            title: 'Delete this post?',
            content: 'Are you sure you want to delete this post? This cannot be undone.',
        });
        if (confirmed) {
            try {
                await API.delete(POSTS.post(post._id));
                onUpdate(null, post._id);
            } catch {
                alert('Failed to delete post');
            }
        }
    };
    const refreshUser = async () => {
        const { data } = await getMe();
        setUser(data);
    };
    const handleSaveToggle = async () => {
        try {
            if (isSaved) {
                await API.post(USERS.unsavePost(post._id));
                removeSavedPost(post._id);
                if (typeof onUnsave === "function") onUnsave();
            } else {
                await API.post(USERS.savePost(post._id));
                addSavedPost(post._id);
            }
            refreshUser();

        } catch (err) {
            console.log(err);
            alert('Failed to save/unsave post');
        }
    };

    return (
        <>
            {ConfirmDialogElement}
            <Card sx={{ mb: 3 }}>
                <LoaderWrapper loading={isLoading}>
                    <CardContent>
                        {/* Author Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Link to={`/profile/${post.author._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                                <Avatar src={authorImageUrl} alt={post.author?.username} />
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="subtitle1" >
                                        {post.author?.username}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDateTime(post.createdAt)}
                                    </Typography>
                                </Box>
                            </Link>
                            {user?._id === post.author?._id && (
                                <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                                    <IconButton color="primary" size="small" onClick={handleEdit}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton color="error" size="small" onClick={handleDelete}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Box>
                            )}
                            {user?._id !== post.author?._id && (
                                <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                                    <IconButton
                                        onClick={handleSaveToggle}
                                    >
                                        {isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
                                    </IconButton>
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
                                                    {formatDateTime(comment.createdAt)}
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
                </LoaderWrapper>
            </Card>
        </>
    );
};

export default PostCard;