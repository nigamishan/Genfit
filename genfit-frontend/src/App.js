import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Container } from '@mui/material';
import { login } from './api';

// Placeholder for actual pages and components
// We will create these files later
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ProgressPage = React.lazy(() => import('./pages/ProgressPage'));
const WorkoutPage = React.lazy(() => import('./pages/WorkoutPage'));
const Navbar = React.lazy(() => import('./components/Navbar'));

function App() {
  const [auth, setAuth] = useState(null); // Stores { username: 'user', token: 'base64token' }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedAuth = localStorage.getItem('genfitAuth');
    if (storedAuth) {
      try {
        setAuth(JSON.parse(storedAuth));
      } catch (e) {
        localStorage.removeItem('genfitAuth');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = useCallback(async (username, password) => {
    try {
      // Make API call to authenticate
      await login(username, password);
      
      // If successful, create auth data and store it
      const token = btoa(`${username}:${password}`);
      const authData = { username, token };
      localStorage.setItem('genfitAuth', JSON.stringify(authData));
      setAuth(authData);
      navigate(location.state?.from?.pathname || '/profile', { replace: true });
    } catch (error) {
      // Handle login failure
      console.error('Login failed:', error);
      
      // Extract error message from response if available
      let errorMessage = 'Invalid credentials';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response && error.response.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage); // Simple alert for now - could be improved with proper error state
    }
  }, [navigate, location.state]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('genfitAuth');
    setAuth(null);
    navigate('/login');
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // PrivateRoute equivalent
  const PrivateElement = ({ children }) => {
    if (!auth) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  return (
    <React.Suspense fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    }>
      {auth && <Navbar onLogout={handleLogout} username={auth.username} />}
      <Container sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/login" element={auth ? <Navigate to="/profile" /> : <LoginPage onLogin={handleLogin} />} />
          <Route 
            path="/profile" 
            element={<PrivateElement><ProfilePage /></PrivateElement>} 
          />
          <Route 
            path="/progress" 
            element={<PrivateElement><ProgressPage /></PrivateElement>} 
          />
          <Route 
            path="/workout" 
            element={<PrivateElement><WorkoutPage /></PrivateElement>} 
          />
          <Route path="*" element={<Navigate to={auth ? "/profile" : "/login"} />} />
        </Routes>
      </Container>
    </React.Suspense>
  );
}

export default App; 