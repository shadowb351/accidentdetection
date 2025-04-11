const PoliceService = require('../services/policeService');
const TrackingService = require('../services/trackingService');

// Get all active emergencies
exports.getActiveEmergencies = async (req, res) => {
    try {
        const { stationId } = req.params;
        const emergencies = await PoliceService.getActiveEmergencies(stationId);
        
        res.status(200).json(emergencies);
    } catch (error) {
        console.error('Error fetching active emergencies:', error);
        res.status(500).json({ error: 'Failed to fetch emergencies' });
    }
};

// Track ambulance movements
exports.trackAmbulance = async (req, res) => {
    try {
        const { ambulanceId } = req.params;
        const trackingData = await TrackingService.getAmbulanceTrackingData(ambulanceId);
        
        res.status(200).json(trackingData);
    } catch (error) {
        console.error('Error tracking ambulance:', error);
        res.status(500).json({ error: 'Failed to track ambulance' });
    }
};

// Get police dashboard data
exports.getDashboard = async (req, res) => {
    try {
        const { stationId } = req.params;
        const dashboardData = await PoliceService.getPoliceDashboard(stationId);
        
        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error fetching police dashboard:', error);
        res.status(500).json({ error: 'Failed to load dashboard' });
    }
};