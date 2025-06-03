// /src/App.js


import AppRouter from './routes/AppRouter';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ pt: { xs: 7, sm: 8 }, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppRouter />
      </Box>

    </ThemeProvider>
  );
}

export default App;