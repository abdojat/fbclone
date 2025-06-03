// /src/routes/AppRouter.js

import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import Friends from '../pages/Friends';
import Posts from '../pages/Posts';
import Navigation from '../components/Navigation';
import ChangePassword from '../pages/ChangePassword';
import { Container } from '@mui/material';
import ChatPage from '../pages/ChatPage';
import ChatsListPage from '../pages/ChatListPage';
import Notifications from '../components/Notifications';
import PostPage from '../pages/PostPage';

const AppRouter = () => {
    return (
        <Container>
            <Navigation />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat/:userId" element={<ChatPage />} />
                <Route path="/chats" element={<ChatsListPage />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/post/:postId" element={<PostPage />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                </Route>
            </Routes>
        </Container>
    );
};
export default AppRouter;