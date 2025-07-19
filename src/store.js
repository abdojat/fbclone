// src/store.js


import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import messageReducer from './hooks/messageSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        messages: messageReducer,
    },
});