// /src/pages/Login.js

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Link
} from '@mui/material';
import FormError from '../components/FormError';


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const { login: authLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login(formData);
            if (!data.user || !data.token) {
                throw new Error('Incomplete login response');
            }
            localStorage.setItem('token', data.token);
            console.log(data.user);
            authLogin(data.user, data.token);

        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{
                mt: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <FormError message={error} />
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                    <Typography variant="body2">
                        Don't have an account?{' '}
                        <Link href="/register" underline="hover">
                            Register
                        </Link>
                    </Typography>
                </form>
            </Box>
        </Container>
    );
};

export default Login;