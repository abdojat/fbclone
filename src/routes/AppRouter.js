// /src/routes/AppRouter.js

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Friends from '../pages/Friends';
import Posts from '../pages/Posts';
import Navigation from '../components/Navigation'; 
import ChangePassword from '../pages/ChangePassword';
import GoogleCallback from '../pages/GoogleCallback';
import { Container } from '@mui/material'; 

const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navigation />
                <Container sx={{ mt: 4 }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/auth/google/callback" element={<GoogleCallback />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/profile/:userId" element={<Profile />} />
                            <Route path="/friends" element={<Friends />} />
                            <Route path="/posts" element={<Posts />} />
                            <Route path="/change-password" element={<ChangePassword />} />
                        </Route>
                    </Routes>
                </Container>
            </AuthProvider>
        </BrowserRouter>
    );
};
export default AppRouter;