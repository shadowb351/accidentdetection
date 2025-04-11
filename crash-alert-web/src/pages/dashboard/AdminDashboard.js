import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import LiveMap from '../../components/map/LiveMap';
import AlertList from '../../components/admin/AlertList';
import ResourceStatus from '../../components/admin/ResourceStatus';
import SystemMetrics from '../../components/admin/SystemMetrics';

const AdminDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsRes, ambulancesRes, hospitalsRes] = await Promise.all([
          fetch('/api/admin/alerts'),
          fetch('/api/admin/ambulances'),
          fetch('/api/admin/hospitals')
        ]);
        
        setAlerts(await alertsRes.json());
        setAmbulances(await ambulancesRes.json());
        setHospitals(await hospitalsRes.json());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Emergency Control Center</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} style={{ height: '500px' }}>
            <LiveMap 
              emergencies={alerts} 
              ambulances={ambulances} 
              hospitals={hospitals} 
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <SystemMetrics />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>Active Alerts</Typography>
            <AlertList alerts={alerts} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6" gutterBottom>Resource Status</Typography>
            <ResourceStatus 
              ambulances={ambulances} 
              hospitals={hospitals} 
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;