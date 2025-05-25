// /src/pages/ChangePassword.js


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/Validators';
import API from '../api/api';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress
} from '@mui/material';
import PasswordStrengthBar from 'react-password-strength-bar';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }
        console.log(formData.newPassword.length);
        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { data } = await API.post('/users/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            if (!data.success) {
                throw new Error(data.message || 'Password change failed');
            }

            // Logout user after password change
            logout();
            navigate('/login', {
                state: {
                    message: 'Password changed successfully. Please login again.'
                }
            });

        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Change Password
                </Typography>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        label="Current Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        required
                    />

                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        required
                    />

                    <PasswordStrengthBar
                        password={formData.newPassword}
                        style={{ marginBottom: '16px' }}
                    />

                    <TextField
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Change Password'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ChangePassword;