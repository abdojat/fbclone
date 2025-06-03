import { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress
} from '@mui/material';
import API from '../api/api';
import ImageUploader from './ImageUploader';
import FormError from './FormError';
import { UPLOAD, POSTS } from '../api/endpoints';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);        // array of File
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Called whenever ImageUploader has new image Files
    const handleImagesSelected = (files) => {
        setImages(files);
    };

    // Called when user clicks “Upload Selected Images” in ImageUploader
    // Returns array of uploaded URLs
    const handleUploadImages = async (imageFiles) => {
        const uploadedUrls = [];
        for (let imgFile of imageFiles) {
            const formData = new FormData();
            formData.append('image', imgFile);
            const res = await API.post(UPLOAD.image, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            uploadedUrls.push(res.data.imageUrl);
        }
        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setError({ field: 'content', message: 'Post content cannot be empty' });
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // 1) Upload images (if any)
            let imageUrls = [];
            if (images.length > 0) {
                imageUrls = await handleUploadImages(images);
            }

            // 2) Create post
            const response = await API.post(
                POSTS.all,
                { content: content.trim(), imageUrls },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (!response.data.success) {
                throw new Error(response.data.message || 'Post creation failed');
            }

            // 3) Reset
            setContent('');
            setImages([]);
            onPostCreated?.();
        } catch (err) {
            console.error(err);
            setError({
                field: err.response?.data?.field || 'general',
                message: err.response?.data?.message || 'Failed to create post',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <FormError message={error?.message} field={error?.field} />

            <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                sx={{ mb: 2 }}
            />

            <ImageUploader
                onImagesSelected={handleImagesSelected}
                onUploadImages={handleUploadImages}
                maxPreviewHeight={200}
            />

            <Button type="submit" variant="contained" disabled={!content.trim() || loading}>
                {loading ? <CircularProgress size={24} /> : 'Post'}
            </Button>
        </Box>
    );
};

export default CreatePost;
