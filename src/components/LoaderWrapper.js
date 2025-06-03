// /src/components/LoaderWrapper.js
import { Box, CircularProgress } from '@mui/material';

/**
 * If `loading` is true → render a centered spinner.
 * Otherwise → render children.
 * You can pass `sx` to customize the spinner container.
 */

const LoaderWrapper = ({ loading, children, sx = {} }) => {
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    ...sx,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }
    return <>{children}</>;
};

export default LoaderWrapper;
