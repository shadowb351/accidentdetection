import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

const BloodDonorSystem = () => {
  const { user } = useAuth();
  const [donors, setDonors] = useState([]);
  const [requestStatus, setRequestStatus] = useState(null);

  const findDonors = async () => {
    try {
      const response = await fetch(`/api/blood-donors?bloodGroup=${user.bloodGroup}`);
      const data = await response.json();
      setDonors(data);
    } catch (error) {
      console.error('Error finding donors:', error);
    }
  };

  const requestDonation = async (donorId) => {
    try {
      setRequestStatus('sending');
      await fetch('/api/blood-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorId,
          requesterId: user.id,
          bloodGroup: user.bloodGroup
        })
      });
      setRequestStatus('sent');
    } catch (error) {
      console.error('Error requesting donation:', error);
      setRequestStatus('error');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Blood Donor System</Typography>
        
        {user.bloodGroup ? (
          <>
            <Button 
              variant="contained" 
              onClick={findDonors}
              disabled={requestStatus === 'sending'}
            >
              Find Matching Donors
            </Button>
            
            {donors.length > 0 && (
              <List>
                {donors.map(donor => (
                  <ListItem key={donor.id}>
                    <ListItemText
                      primary={donor.name}
                      secondary={`Distance: ${donor.distance.toFixed(1)} km`}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => requestDonation(donor.id)}
                    >
                      Request Donation
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
            
            {requestStatus === 'sent' && (
              <Typography color="success">
                Donation request sent successfully!
              </Typography>
            )}
          </>
        ) : (
          <Typography color="error">
            Please set your blood group in your emergency profile first.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default BloodDonorSystem;