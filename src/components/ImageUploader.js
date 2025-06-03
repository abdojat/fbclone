// /src/components/ImageUploader.js
import { useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Props:
 * - onImagesSelected: callback(images: File[]) called whenever the user picks/drops files
 * - onUploadImages: async function(images: File[]) that uploads them and returns array of URLs
 * - maxPreviewHeight (optional)
 */
const ImageUploader = ({ onImagesSelected, maxPreviewHeight = 200 }) => {
    const [previews, setPreviews] = useState([]);
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        setImages((prev) => [...prev, ...files]);
        setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
        onImagesSelected?.(images);
    };
    const handleDragOver = (e) => e.preventDefault();

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setPreviews(files.map((f) => URL.createObjectURL(f)));
        onImagesSelected?.(images);
    };

    const handleClickDropArea = () => {
        fileInputRef.current?.click();
    };


    return (
        <>
            {/* Drop area */}
            <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleClickDropArea}
                sx={{
                    border: '2px dashed gray',
                    borderRadius: '8px',
                    textAlign: 'center',
                    p: 2,
                    backgroundColor: '#f9f9f9',
                    mb: 2,
                    cursor: 'pointer',
                }}
            >
                <Typography variant="body2" color="textSecondary">
                    Drag & drop images here, or click to select
                </Typography>
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </Box>

            {/* Previews */}
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', mb: 2 }}>
                {previews.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`Preview ${idx}`}
                        style={{ maxHeight: maxPreviewHeight, borderRadius: 8 }}
                    />
                ))}
            </Box>
        </>
    );
};

export default ImageUploader;
