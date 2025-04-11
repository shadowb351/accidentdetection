const RoutingService = require('../services/routingService');

// Get route between points
exports.getRoute = async (req, res) => {
    try {
        const { from, to, profile } = req.query; // profile = driving, walking, emergency
        
        const route = await RoutingService.calculateRoute(from, to, profile);
        
        res.status(200).json(route);
    } catch (error) {
        console.error('Error calculating route:', error);
        res.status(500).json({ error: 'Failed to calculate route' });
    }
};

// Get alternative routes
exports.getAlternativeRoutes = async (req, res) => {
    try {
        const { from, to, profile } = req.query;
        
        const alternatives = await RoutingService.calculateAlternativeRoutes(from, to, profile);
        
        res.status(200).json(alternatives);
    } catch (error) {
        console.error('Error calculating alternative routes:', error);
        res.status(500).json({ error: 'Failed to calculate alternatives' });
    }
};

// Get real-time traffic updates
exports.getTrafficUpdates = async (req, res) => {
    try {
        const { routeId } = req.params;
        
        const updates = await RoutingService.getTrafficUpdates(routeId);
        
        res.status(200).json(updates);
    } catch (error) {
        console.error('Error fetching traffic updates:', error);
        res.status(500).json({ error: 'Failed to get traffic updates' });
    }
};