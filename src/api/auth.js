// /src/api/auth.js

import API from './api';

import { AUTH } from './endpoints';

export const register = (userData) => API.post(AUTH.register, userData);
export const login = (creds) => API.post(AUTH.login, creds);
export const getMe = () => API.get(AUTH.getMe);
export const logout = () => API.post(AUTH.logout)