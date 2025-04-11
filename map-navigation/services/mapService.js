const axios = require('axios');
const MapCache = require('../models/mapCache');
const config = require('../config');
const GeoUtils = require('../utils/geoUtils');

module.exports = {
    getMarkersInView: async (bbox, zoom, userId) => {
        try {
            // Convert bbox string to array
            const bboxArray = bbox.split(',').map(Number);
            
            // Get crash sites in view
            const crashSites = await this.getCrashSitesInBounds(bboxArray);
            
            // Get ambulances in view
            const ambulances = await this.getAmbulancesInBounds(bboxArray);
            
            // Get hospitals in view
            const hospitals = await this.getHospitalsInBounds(bboxArray);
            
            // Get user location if available
            const userLocation = await this.getUserLocation(userId);
            
            return {
                crashSites,
                ambulances,
                hospitals,
                userLocation,
                mapConfig: this.getMapConfig(zoom)
            };
        } catch (error) {
            console.error('Error in map service:', error);
            throw error;
        }
    },
    
    getCrashSitesInBounds: async (bbox) => {
        // Implementation would query your database for crash sites in the bounding box
        // This is a simplified example
        return [];
    },
    
    getAmbulancesInBounds: async (bbox) => {
        // Implementation would query your ambulance locations
        // This is a simplified example
        return [];
    },
    
    getHospitalsInBounds: async (bbox) => {
        // Implementation would query your hospital locations
        // This is a simplified example
        return [];
    },
    
    getUserLocation: async (userId) => {
        // Implementation would get the user's current location
        // This is a simplified example
        return null;
    },
    
    getMapConfig: (zoom) => {
        // Return appropriate map style based on zoom level
        if (zoom < 10) {
            return {
                style: 'mapbox://styles/mapbox/streets-v11',
                showLabels: false
            };
        } else {
            return {
                style: 'mapbox://styles/mapbox/streets-v11',
                showLabels: true
            };
        }
    },
    
    generateOfflineTilePackage: async (bbox, zoomLevels) => {
        try {
            const bboxArray = bbox.split(',').map(Number);
            const zooms = zoomLevels.split(',').map(Number);
            
            // Check cache first
            const cachedTiles = await MapCache.findOne({ bbox, zoomLevels });
            if (cachedTiles) {
                return cachedTiles;
            }
            
            // Generate tile package using Mapbox Static Tiles API
            const tilePackage = {
                bbox,
                zoomLevels,
                tiles: [],
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week
            };
            
            // This is simplified - actual implementation would fetch all tiles in the bbox
            // for each zoom level and store them
            const baseUrl = `https://api.mapbox.com/v4/mapbox.streets`;
            
            for (const zoom of zooms) {
                // Calculate tile coordinates for this zoom level
                const tileCoords = GeoUtils.bboxToTileCoords(bboxArray, zoom);
                
                for (let x = tileCoords.minX; x <= tileCoords.maxX; x++) {
                    for (let y = tileCoords.minY; y <= tileCoords.maxY; y++) {
                        const tileUrl = `${baseUrl}/${zoom}/${x}/${y}.vector.pbf?access_token=${config.MAPBOX_ACCESS_TOKEN}`;
                        tilePackage.tiles.push({
                            url: tileUrl,
                            zoom,
                            x,
                            y
                        });
                    }
                }
            }
            
            // Cache the tile package
            const newCache = new MapCache(tilePackage);
            await newCache.save();
            
            return tilePackage;
        } catch (error) {
            console.error('Error generating offline tiles:', error);
            throw error;
        }
    }
};