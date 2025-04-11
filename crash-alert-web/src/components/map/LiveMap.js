import React, { useEffect, useState, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMap } from '../../contexts/MapContext';

const LiveMap = ({ emergencies, ambulances, hospitals }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const { setMapInstance } = useMap();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // Default style
      center: [0, 0],
      zoom: 2
    });
    
    setMapInstance(map.current);
    
    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    if (!map.current) return;
    
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    
    const newMarkers = [];
    
    // Add emergency markers
    emergencies.forEach(emergency => {
      const marker = new maplibregl.Marker({ color: '#FF0000' })
        .setLngLat(emergency.location.coordinates)
        .setPopup(new maplibregl.Popup().setHTML(
          `<h3>Emergency</h3>
          <p>Status: ${emergency.status}</p>
          <p>Reported: ${new Date(emergency.reportedAt).toLocaleString()}</p>`
        ))
        .addTo(map.current);
      
      newMarkers.push(marker);
    });
    
    // Add ambulance markers
    ambulances.forEach(ambulance => {
      const marker = new maplibregl.Marker({ color: '#0066FF' })
        .setLngLat(ambulance.currentLocation.coordinates)
        .setPopup(new maplibregl.Popup().setHTML(
          `<h3>Ambulance ${ambulance.vehicleNumber}</h3>
          <p>Status: ${ambulance.status}</p>`
        ))
        .addTo(map.current);
      
      newMarkers.push(marker);
    });
    
    // Add hospital markers
    hospitals.forEach(hospital => {
      const marker = new maplibregl.Marker({ color: '#00AA00' })
        .setLngLat(hospital.location.coordinates)
        .setPopup(new maplibregl.Popup().setHTML(
          `<h3>${hospital.name}</h3>
          <p>Beds available: ${hospital.availableBeds}</p>`
        ))
        .addTo(map.current);
      
      newMarkers.push(marker);
    });
    
    setMarkers(newMarkers);
    
    // Fit bounds to show all markers if any exist
    if (emergencies.length + ambulances.length + hospitals.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      
      [...emergencies, ...ambulances, ...hospitals].forEach(item => {
        bounds.extend(item.location.coordinates);
      });
      
      map.current.fitBounds(bounds, { padding: 100 });
    }
  }, [emergencies, ambulances, hospitals]);

  return (
    <div 
      ref={mapContainer} 
      className="live-map"
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default LiveMap;