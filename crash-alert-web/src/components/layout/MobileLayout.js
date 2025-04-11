import React, { useState } from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
  Home as HomeIcon,
  Emergency as EmergencyIcon,
  Map as MapIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MobileLayout = ({ children }) => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const routes = ['/', '/emergency', '/map', '/profile', '/settings'];

  return (
    <Box sx={{ pb: 7 }}>
      {children}
      
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(routes[newValue]);
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Emergency" icon={<EmergencyIcon />} />
          <BottomNavigationAction label="Map" icon={<MapIcon />} />
          <BottomNavigationAction label="Profile" icon={<ProfileIcon />} />
          <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default MobileLayout;