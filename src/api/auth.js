// /src/api/auth.js

import API from './api';

export const register = (userData) => API.post('/users/register', userData);
export const login = (credentials) => API.post('/users/login', credentials);
export const getMe = () => API.get('/users/me');
export const logout = () => API.post('/users/logout');