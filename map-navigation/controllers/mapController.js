const MapService = require('../services/mapService');
const MarkerService = require('../services/markerService');

// Get map markers for current view
exports.getMapMarkers = async (req, res) => {
    try {
        const { bbox, zoom } = req.query; // bbox = [minLon, minLat, maxLon, maxLat]
        const { userId } = req.params;
        
        const markers = await MapService.getMarkersInView(bbox, zoom, userId);
        
        res.status(200).json(markers);
    } catch (error) {
        console.error('Error fetching map markers:', error);
        res.status(500).json({ error: 'Failed to fetch markers' });
    }
};

// Get offline map tiles
exports.getOfflineTiles = async (req, res) => {
    try {
        const { bbox, zoomLevels } = req.query;
        
        const tilePackage = await MapService.generateOfflineTilePackage(bbox, zoomLevels);
        
        res.status(200).json({
            message: 'Offline map package generated',
            tiles: tilePackage.tiles,
            expiresAt: tilePackage.expiresAt
        });
    } catch (error) {
        console.error('Error generating offline tiles:', error);
        res.status(500).json({ error: 'Failed to generate offline map' });
    }
};

// Update marker positions
exports.updateMarkerPosition = async (req, res) => {
    try {
        const { markerId } = req.params;
        const { location } = req.body;
        
        const updatedMarker = await MarkerService.updateMarkerPosition(markerId, location);
        
        res.status(200).json(updatedMarker);
    } catch (error) {
        console.error('Error updating marker position:', error);
        res.status(500).json({ error: 'Failed to update marker' });
    }
};