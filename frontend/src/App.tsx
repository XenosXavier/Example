import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TodoList from './components/TodoList';

// 建立 Material-UI 主題
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TodoList />
    </ThemeProvider>
  );
};

export default App;
