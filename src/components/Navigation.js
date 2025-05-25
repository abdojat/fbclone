// /src/components/Navigation.js


import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Avatar, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                    <Button component={Link} to="/" color="inherit">Home</Button>
                    {user && (
                        <Button component={Link} to="/friends" color="inherit">
                            Friends
                        </Button>
                    )}
                </Box>

                {user && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            component={Link}
                            to={`/profile/${user._id}`}
                            startIcon={<Avatar src={user.picturePath} sx={{ width: 24, height: 24 }} />}
                            color="inherit"
                        >
                            {user.username}
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </Box>
                )}
                {!user && (
                    <>
                        <Button component={Link} to="/login" color="inherit">Login</Button>
                        <Button component={Link} to="/register" color="inherit">Register</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;