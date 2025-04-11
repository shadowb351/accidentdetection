const axios = require('axios');
const { getMapboxAccessToken } = require('../config');
const TrafficUtils = require('../utils/trafficUtils');

module.exports = {
    getRoute: async (start, end) => {
        try {
            const accessToken = getMapboxAccessToken();
            const coordinates = `${start.coordinates[0]},${start.coordinates[1]};${end.coordinates[0]},${end.coordinates[1]}`;
            
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coordinates}`,
                {
                    params: {
                        access_token: accessToken,
                        geometries: 'geojson',
                        overview: 'full',
                        annotations: 'congestion'
                    }
                }
            );
            
            const route = response.data.routes[0];
            
            return {
                geometry: route.geometry,
                distance: route.distance, // meters
                duration: route.duration, // seconds
                congestion: TrafficUtils.analyzeCongestion(route.legs[0].annotation.congestion)
            };
        } catch (error) {
            console.error('Error getting navigation route:', error);
            throw error;
        }
    },
    
    getRouteToHospital: async (currentLocation, emergencyLocation, hospitalId) => {
        // Similar implementation but with hospital as destination
        // Would include additional logic for best hospital selection
    }
};