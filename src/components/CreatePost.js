// /src/components/CreatePost.js

import { useRef, useState } from 'react';
import API from '../api/api';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress
} from '@mui/material';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedContent = content.trim();
        if (!trimmedContent) {
            setError({
                field: 'content',
                message: 'Post content cannot be empty'
            });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('content', trimmedContent);

            let uploadedUrls = [];

            for (let img of images) {
                const formData = new FormData();
                formData.append('image', img);

                const res = await API.post('/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                uploadedUrls.push(res.data.imageUrl);
            }
            console.log(uploadedUrls);
            const response = await API.post('/posts',
                {
                    content: trimmedContent,
                    imageUrls: uploadedUrls
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Post creation failed');
            }

            setContent('');
            setImages([]);
            setPreviews([]);

            if (onPostCreated) onPostCreated();

        } catch (err) {
            console.error('Full error details:', {
                message: err.message,
                response: err.response?.data,
                config: err.config
            });

            setError({
                field: err.response?.data?.field || 'general',
                message: err.response?.data?.message || 'Failed to create post'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        );

        setImages(prev => [...prev, ...files]);
        setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        console.log(files);
        setImages(files);
        setPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const dropInputRef = useRef(null);

    const handleClickDropArea = () => {
        dropInputRef.current?.click();
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            {error && (
                <Typography
                    color="error"
                    sx={{
                        mb: 2,
                        borderLeft: error.field === 'content' ? '3px solid red' : 'none',
                        pl: error.field === 'content' ? 2 : 0
                    }}
                >
                    {error.message}
                </Typography>
            )}

            <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ mb: 2 }}
                required
            />

            {previews.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', mb: 2 }}>
                    {previews.map((src, index) => (
                        <img key={index} src={src} alt={`Preview ${index}`} style={{ maxHeight: 200, borderRadius: 8 }} />
                    ))}
                </Box>
            )}
            <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                sx={{
                    border: '2px dashed gray',
                    borderRadius: '8px',
                    padding: 2,
                    textAlign: 'center',
                    mb: 2,
                    cursor: 'pointer',
                    backgroundColor: '#f9f9f9'
                }}
                onClick={handleClickDropArea}
            >
                <Typography variant="body2" color="textSecondary">
                    Drag and drop images here, or click to select
                </Typography>
                <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                    ref={(input) => input && (dropInputRef.current = input)}
                />
            </Box>
            <Button
                type="submit"
                variant="contained"
                disabled={!content.trim() || loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Post'}
            </Button>
        </Box>
    );
};

export default CreatePost;