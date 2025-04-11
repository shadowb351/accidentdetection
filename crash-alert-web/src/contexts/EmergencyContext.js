import React, { createContext, useContext, useState } from 'react';

const EmergencyContext = createContext();

export function EmergencyProvider({ children }) {
  const [emergency, setEmergency] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);

  const detectAccident = async () => {
    try {
      // Get current location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const emergencyData = {
        location: {
          coordinates: [position.coords.longitude, position.coords.latitude],
          type: 'Point'
        },
        timestamp: new Date()
      };
      
      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emergencyData)
      });
      
      const result = await response.json();
      setEmergency(result);
      return result;
    } catch (error) {
      console.error('Error triggering emergency:', error);
      throw error;
    }
  };

  const cancelEmergency = async () => {
    if (!emergency) return;
    
    try {
      await fetch(`/api/emergency/${emergency.id}/cancel`, {
        method: 'POST'
      });
      setEmergency(null);
    } catch (error) {
      console.error('Error cancelling emergency:', error);
    }
  };

  const fetchActiveAlerts = async () => {
    try {
      const response = await fetch('/api/alerts');
      const data = await response.json();
      setActiveAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  return (
    <EmergencyContext.Provider
      value={{
        emergency,
        activeAlerts,
        detectAccident,
        cancelEmergency,
        fetchActiveAlerts
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  return useContext(EmergencyContext);
}