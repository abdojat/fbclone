// /src/pages/GoogleCallback.js

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../api/auth';

const GoogleCallback = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            getMe().then(({ data }) => {
                login(data, token);
                navigate('/');
            });
        } else {
            navigate('/login');
        }
    }, [search]);

    return <div>Signing you in…</div>;
};

export default GoogleCallback;
