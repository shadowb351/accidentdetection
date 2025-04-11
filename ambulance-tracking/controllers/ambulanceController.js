const AmbulanceTrackingService = require('../services/ambulanceTrackingService');
const StatusUpdateService = require('../services/statusUpdateService');

// Assign ambulance to emergency
exports.assignAmbulance = async (req, res) => {
    try {
        const { emergencyId, ambulanceId } = req.body;
        
        const assignment = await AmbulanceTrackingService.assignAmbulanceToEmergency(
            ambulanceId, 
            emergencyId
        );
        
        res.status(200).json({
            message: 'Ambulance assigned successfully',
            assignment
        });
    } catch (error) {
        console.error('Error assigning ambulance:', error);
        res.status(500).json({ error: 'Failed to assign ambulance' });
    }
};

// Update ambulance status
exports.updateStatus = async (req, res) => {
    try {
        const { ambulanceId, status, location } = req.body;
        
        const updatedAmbulance = await StatusUpdateService.updateAmbulanceStatus(
            ambulanceId,
            status,
            location
        );
        
        res.status(200).json({
            message: 'Ambulance status updated',
            ambulance: updatedAmbulance
        });
    } catch (error) {
        console.error('Error updating ambulance status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};

// Get ambulance ETA
exports.getETA = async (req, res) => {
    try {
        const { ambulanceId, destination } = req.query;
        
        const eta = await AmbulanceTrackingService.calculateETA(
            ambulanceId,
            destination
        );
        
        res.status(200).json(eta);
    } catch (error) {
        console.error('Error calculating ETA:', error);
        res.status(500).json({ error: 'Failed to calculate ETA' });
    }
};