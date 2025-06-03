// /src/AppProviders.js
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { store } from './store';

/**
 * Wrap this at the root of the app. Ensures every page sees Redux, Auth, Socket, and Router.
 */
const AppProviders = ({ children }) => (
    <Provider store={store}>
        <BrowserRouter>
            <AuthProvider>
                <SocketProvider>{children}</SocketProvider>
            </AuthProvider>
        </BrowserRouter>
    </Provider>
);

export default AppProviders;
