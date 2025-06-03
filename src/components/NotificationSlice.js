// /src/components/NotificationSlice.js


import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        list: []
    },
    reducers: {
        addNotification: (state, action) => {
            state.list.unshift(action.payload);
        },
        markAllRead: (state) => {
            state.list.forEach(n => n.isRead = true);
        },
        setNotifications: (state, action) => {
            state.list = action.payload;
        },
        markSingleRead: (state, action) => {
            const notif = state.list.find(n => n._id === action.payload);
            if (notif) notif.isRead = true;
        },
    }
});

export const { addNotification, markAllRead, setNotifications, markSingleRead } = notificationSlice.actions;
export default notificationSlice.reducer;
