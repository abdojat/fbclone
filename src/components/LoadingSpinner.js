// /src/components/LoadingSpinner.js

import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh' // Full viewport height
    }}>
        <CircularProgress size={60} />
    </Box>
);

export default LoadingSpinner;