// /src/components/PageLayout.js
import { Container, Box, Typography } from '@mui/material';

/**
 * Props:
 * - title: string (optional)
 * - children: page content
 * - titleVariant: string (e.g. 'h4', default 'h4')
 */
const PageLayout = ({ title, titleVariant = 'h4', children, sx = {} }) => (
    <Container maxWidth="md" sx={sx}>
        {title && (
            <Box sx={{ my: 4 }}>
                <Typography variant={titleVariant} gutterBottom>
                    {title}
                </Typography>
            </Box>
        )}
        {children}
    </Container>
);

export default PageLayout;
