import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        list: [],
        loading: false,
        recentChats: [],
    },
    reducers: {
        setMessages: (state, action) => {
            state.list = action.payload;
        },
        addMessage: (state, action) => {
            state.list.push(action.payload);
        },
        markMessagesRead: (state, action) => {
            // action.payload: recipientId
            state.list = state.list.map(m =>
                String(m.recipient) === String(action.payload) && !m.read
                    ? { ...m, read: true }
                    : m
            );
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearMessages: (state) => {
            state.list = [];
        },
        setRecentChats: (state, action) => {
            state.recentChats = action.payload;
        },
    },
});

export const { setMessages, addMessage, markMessagesRead, setLoading, clearMessages, setRecentChats } = messageSlice.actions;

// Selector for unread messages count
export const selectUnreadMessagesCount = (state) => {
    return state.messages.recentChats.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0);
};

export default messageSlice.reducer; 