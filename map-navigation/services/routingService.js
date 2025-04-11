const axios = require('axios');
const Route = require('../models/route');
const config = require('../config');
const GeoUtils = require('../utils/geoUtils');

module.exports = {
    calculateRoute: async (from, to, profile = 'driving') => {
        try {
            // Convert from and to strings to coordinates
            const fromCoords = from.split(',').map(Number);
            const toCoords = to.split(',').map(Number);
            
            // Check cache first
            const cachedRoute = await Route.findOne({
                start: { $near: fromCoords, $maxDistance: 50 },
                end: { $near: toCoords, $maxDistance: 50 },
                profile
            }).sort({ updatedAt: -1 });
            
            if (cachedRoute && (Date.now() - cachedRoute.updatedAt < 15 * 60 * 1000)) {
                return cachedRoute;
            }
            
            // Calculate new route using Mapbox Directions API
            const coordsString = `${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}`;
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordsString}`,
                {
                    params: {
                        access_token: config.MAPBOX_ACCESS_TOKEN,
                        geometries: 'geojson',
                        overview: 'full',
                        steps: true,
                        alternatives: false
                    }
                }
            );
            
            const routeData = response.data.routes[0];
            
            // Create route object
            const route = {
                geometry: routeData.geometry,
                distance: routeData.distance,
                duration: routeData.duration,
                profile,
                start: fromCoords,
                end: toCoords,
                steps: routeData.legs[0].steps.map(step => ({
                    instruction: step.maneuver.instruction,
                    distance: step.distance,
                    duration: step.duration,
                    geometry: step.geometry
                })),
                waypoints: response.data.waypoints
            };
            
            // Save to cache
            const newRoute = new Route(route);
            await newRoute.save();
            
            return route;
        } catch (error) {
            console.error('Error calculating route:', error);
            throw error;
        }
    },
    
    calculateAlternativeRoutes: async (from, to, profile = 'driving') => {
        try {
            const fromCoords = from.split(',').map(Number);
            const toCoords = to.split(',').map(Number);
            
            const coordsString = `${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}`;
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordsString}`,
                {
                    params: {
                        access_token: config.MAPBOX_ACCESS_TOKEN,
                        geometries: 'geojson',
                        overview: 'full',
                        steps: true,
                        alternatives: 2
                    }
                }
            );
            
            return response.data.routes.map((route, index) => ({
                id: `${Date.now()}-${index}`,
                geometry: route.geometry,
                distance: route.distance,
                duration: route.duration,
                profile
            }));
        } catch (error) {
            console.error('Error calculating alternative routes:', error);
            throw error;
        }
    },
    
    getTrafficUpdates: async (routeId) => {
        try {
            // In a real implementation, this would fetch real-time traffic data
            // For demo purposes, we'll return simulated data
            
            return {
                routeId,
                updates: [
                    {
                        location: [/* coordinates */],
                        severity: 'moderate',
                        congestion: 0.7,
                        delay: 120 // seconds
                    }
                ],
                updatedAt: new Date()
            };
        } catch (error) {
            console.error('Error fetching traffic updates:', error);
            throw error;
        }
    },
    
    calculateOfflineRoute: async (from, to, profile) => {
        // Implementation would use pre-downloaded routing data
        // This is more complex and would require offline routing engine
    }
};