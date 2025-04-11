import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import QRCode from 'react-qr-code';

const EmergencyProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    bloodGroup: '',
    medicalConditions: [],
    allergies: [],
    medications: [],
    emergencyContacts: []
  });
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    // Load profile from API
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${user.id}`);
        const data = await response.json();
        setProfile(data);
        setQrValue(JSON.stringify({
          id: user.id,
          name: user.name,
          bloodGroup: data.bloodGroup,
          keyConditions: data.medicalConditions.slice(0, 3)
        }));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadProfile();
  }, [user]);

  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddContact = () => {
    setProfile(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '', relationship: '' }]
    }));
  };

  const handleSave = async () => {
    try {
      await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile)
      });
      alert('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Emergency Profile</Typography>
        
        <Box mb={3}>
          <Typography variant="h6">Medical Information</Typography>
          <TextField
            label="Blood Group"
            value={profile.bloodGroup}
            onChange={(e) => handleChange('bloodGroup', e.target.value)}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="Medical Conditions (comma separated)"
            value={profile.medicalConditions.join(', ')}
            onChange={(e) => handleChange('medicalConditions', e.target.value.split(',').map(s => s.trim()))}
            fullWidth
            margin="normal"
          />
        </Box>
        
        <Box mb={3}>
          <Typography variant="h6">Emergency Contacts</Typography>
          {profile.emergencyContacts.map((contact, index) => (
            <Box key={index} display="flex" gap={2} mb={2}>
              <TextField
                label="Name"
                value={contact.name}
                onChange={(e) => handleChange('emergencyContacts', profile.emergencyContacts.map((c, i) => 
                  i === index ? { ...c, name: e.target.value } : c
                ))}
              />
              <TextField
                label="Phone"
                value={contact.phone}
                onChange={(e) => handleChange('emergencyContacts', profile.emergencyContacts.map((c, i) => 
                  i === index ? { ...c, phone: e.target.value } : c
                ))}
              />
              <TextField
                label="Relationship"
                value={contact.relationship}
                onChange={(e) => handleChange('emergencyContacts', profile.emergencyContacts.map((c, i) => 
                  i === index ? { ...c, relationship: e.target.value } : c
                ))}
              />
            </Box>
          ))}
          <Button onClick={handleAddContact}>Add Contact</Button>
        </Box>
        
        <Box mb={3}>
          <Typography variant="h6">Emergency QR Code</Typography>
          {qrValue && (
            <Box p={2} border={1} display="inline-block">
              <QRCode value={qrValue} size={128} />
            </Box>
          )}
          <Typography variant="caption" display="block">
            First responders can scan this code to access your emergency information
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSave}
        >
          Save Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmergencyProfile;