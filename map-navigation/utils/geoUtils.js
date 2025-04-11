module.exports = {
    bboxToTileCoords: (bbox, zoom) => {
        // Convert bbox to tile coordinates at given zoom level
        // Implementation using mercator projection
        return {
            minX: this.lonToTile(bbox[0], zoom),
            minY: this.latToTile(bbox[1], zoom),
            maxX: this.lonToTile(bbox[2], zoom),
            maxY: this.latToTile(bbox[3], zoom)
        };
    },
    
    lonToTile: (lon, zoom) => {
        return Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
    },
    
    latToTile: (lat, zoom) => {
        return Math.floor(
            (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI
        ) / 2 * Math.pow(2, zoom));
    },
    
    calculateBoundingBox: (center, radiusKm) => {
        // Calculate bbox around center point with given radius
        const earthRadius = 6371; // km
        const latR = radiusKm / earthRadius;
        const lonR = radiusKm / (earthRadius * Math.cos(Math.PI * center[1] / 180));
        
        return [
            center[0] - lonR * 180 / Math.PI, // minLon
            center[1] - latR * 180 / Math.PI, // minLat
            center[0] + lonR * 180 / Math.PI, // maxLon
            center[1] + latR * 180 / Math.PI  // maxLat
        ];
    }
};