import React, { createContext, useContext, useState } from 'react';

const MapContext = createContext();

export function MapProvider({ children }) {
  const [mapInstance, setMapInstance] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            coordinates: [position.coords.longitude, position.coords.latitude],
            type: 'Point'
          };
          setCurrentLocation(location);
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true }
      );
    });
  };

  const calculateRoute = async (from, to, profile = 'driving') => {
    try {
      const response = await fetch(
        `/api/navigation/route?from=${from.join(',')}&to=${to.join(',')}&profile=${profile}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error calculating route:', error);
      throw error;
    }
  };

  return (
    <MapContext.Provider
      value={{
        mapInstance,
        setMapInstance,
        currentLocation,
        getCurrentLocation,
        calculateRoute,
        offlineMode,
        setOfflineMode
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  return useContext(MapContext);
}