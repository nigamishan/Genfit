import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navbar = ({ onLogout, username }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const navItems = [
    { text: 'Profile', path: '/profile', icon: <AccountCircleIcon /> },
    { text: 'Progress', path: '/progress', icon: <AssessmentIcon /> },
    { text: 'Workout Plan', path: '/workout', icon: <EventNoteIcon /> },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="logo"
          onClick={() => navigate('/profile')}
          sx={{ mr: 2 }}
        >
          <FitnessCenterIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GenFit
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {navItems.map((item) => (
            <Button 
              key={item.text} 
              color="inherit" 
              component={RouterLink} 
              to={item.path}
              startIcon={item.icon}
              sx={{ textTransform: 'none', mr: 1 }}
            >
              {item.text}
            </Button>
          ))}
        </Box>
        
        <Typography variant="body1" sx={{ mr: 2, display: { xs: 'none', md: 'block' } }}>
          Hi, {username}
        </Typography>

        <Tooltip title="Logout">
          <IconButton color="inherit" onClick={handleLogoutClick}>
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 