const ResourceManagementService = require('../services/resourceManagementService');

// Get all ambulances
exports.getAllAmbulances = async (req, res) => {
    try {
        const { status } = req.query;
        
        const ambulances = await ResourceManagementService.getAllAmbulances(status);
        
        res.status(200).json(ambulances);
    } catch (error) {
        console.error('Error fetching ambulances:', error);
        res.status(500).json({ error: 'Failed to fetch ambulances' });
    }
};

// Get all hospitals
exports.getAllHospitals = async (req, res) => {
    try {
        const { status } = req.query;
        
        const hospitals = await ResourceManagementService.getAllHospitals(status);
        
        res.status(200).json(hospitals);
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ error: 'Failed to fetch hospitals' });
    }
};

// Update resource status
exports.updateResourceStatus = async (req, res) => {
    try {
        const { resourceId } = req.params;
        const { type, status } = req.body;
        
        const updatedResource = await ResourceManagementService.updateResourceStatus(
            resourceId,
            type,
            status
        );
        
        res.status(200).json({
            message: 'Resource status updated',
            resource: updatedResource
        });
    } catch (error) {
        console.error('Error updating resource status:', error);
        res.status(500).json({ error: 'Failed to update resource' });
    }
};