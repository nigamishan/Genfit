import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // We'll create this for basic global styles
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Example primary color (indigo)
    },
    secondary: {
      main: '#f50057', // Example secondary color (pink)
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
); 