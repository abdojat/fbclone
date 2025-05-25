// src/store.js


import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Import your reducers

export const store = configureStore({
    reducer: {
        user: userReducer,
        // Add other reducers here
    },
});