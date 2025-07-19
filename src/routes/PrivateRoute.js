// /src/routes/PrivateRoute.js

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from "@mui/material";

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh' // Full viewport height
        }}>
            <CircularProgress size={60} />
        </Box>;
    }
    return user ? <Outlet /> : <Navigate to="/login" />;
    
};

export default PrivateRoute;