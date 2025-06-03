// src/api/endpoints.js


export const USERS = {
    // Get a user’s full data
    getUser: (userId) => `/users/${userId}`,
    // Get only a user’s profile picture
    getUserPicture: (userId) => `/users/${userId}/picture`,
    // Search users by query
    searchUsers: (q) => `/users/search?q=${encodeURIComponent(q)}`,
    // Get saved posts of the current user
    savedPosts: '/users/saved-posts',
    // Save / Unsave a post
    savePost: (postId) => `/users/save-post/${postId}`,
    unsavePost: (postId) => `/users/unsave-post/${postId}`,
    // Change password endpoint
    changePassword: '/users/change-password',
    // “Me” endpoint if you need it
    getMe: '/users/me',
};

export const FRIENDS = {
    // Get list of incoming requests
    requests: '/friends/requests',
    // Get list of outgoing (sent) requests
    sentRequests: '/friends/sentFriendRequests',
    // Perform “add / remove / accept / reject / cancel” actions
    action: '/friends/action',
    // Get friend suggestions
    suggestions: '/friends/suggestions',
    // Get all friends of a given user
    friendsList: (userId) => `/friends/${userId}/friends`,
};

export const POSTS = {
    // Fetch all posts
    all: '/posts',
    // Fetch feed for friends
    friendsFeed: '/posts/friends/feed',
    // Fetch posts by a specific user
    userPosts: (userId) => `/posts/user/${userId}`,
    // Like / Unlike a post
    like: (postId) => `/posts/${postId}/like`,
    unlike: (postId) => `/posts/${postId}/unlike`,
    // Comments on a post
    comments: (postId) => `/posts/${postId}/comments`,
    post: (postId) => `/posts/${postId}`,
};

export const UPLOAD = {
    // Single endpoint for image uploads
    image: '/upload/image',
};

export const CHAT = {
    // Get recent chats
    recent: '/chat/recent',
    // Open a one-to-one chat “room” (messages)
    room: (recipientId) => `/chat/${recipientId}`,
};

export const AUTH = {
    register: '/users/register',
    login: '/users/login',
    logout: '/users/logout',
    getMe: '/users/me'
};


export const NOTIFICATIONS = {
    all: '/notification',
    markAllRead: '/notification/mark-all-read',
    markSingleAsRead: (notifId) => `/notification/${notifId}/mark-read`
};
