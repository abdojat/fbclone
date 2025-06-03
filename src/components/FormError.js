// /src/components/FormError.js
import { Typography, Box } from '@mui/material';

const FormError = ({ message, field }) => {
    if (!message) return null;
    return (
        <Box
            sx={{
                mb: 2,
                borderLeft: field === 'content' ? '3px solid red' : 'none',
                pl: field === 'content' ? 2 : 0,
            }}
        >
            <Typography color="error">{message}</Typography>
        </Box>
    );
};
export default FormError;
