// /src/index.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AppProviders from './AppProviders';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProviders>
        <App />
      </AppProviders>
    </ThemeProvider>
  </React.StrictMode>
);
