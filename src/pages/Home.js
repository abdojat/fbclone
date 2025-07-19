// /src/pages/Home.js

import { useState } from 'react';
import { Container, Box } from '@mui/material';
import CreatePost from '../components/CreatePost';
import Posts from './Posts';

const Home = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <CreatePost onPostCreated={() => setRefreshKey(prev => prev + 1)} />
                <Posts key={refreshKey} />
            </Box>
        </Container>
    );
};

export default Home; 