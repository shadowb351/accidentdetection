const AlertService = require('../services/alertService');
const MatchingService = require('../services/matchingService');

// Request blood donors
exports.requestDonors = async (req, res) => {
    try {
        const { hospitalId, patientId } = req.params;
        const { bloodGroup, unitsNeeded, urgency } = req.body;
        
        // Find matching donors
        const matchingDonors = await MatchingService.findMatchingDonors(
            hospitalId,
            bloodGroup,
            unitsNeeded,
            urgency
        );
        
        // Create blood request record
        const bloodRequest = await AlertService.createBloodRequest(
            hospitalId,
            patientId,
            bloodGroup,
            unitsNeeded,
            urgency,
            matchingDonors
        );
        
        // Send alerts to donors
        await AlertService.notifyDonors(matchingDonors, bloodRequest._id);
        
        res.status(200).json({
            message: 'Blood request initiated',
            requestId: bloodRequest._id,
            donorsNotified: matchingDonors.length
        });
    } catch (error) {
        console.error('Error requesting donors:', error);
        res.status(500).json({ error: 'Failed to request donors' });
    }
};

// Handle donor response
exports.handleDonorResponse = async (req, res) => {
    try {
        const { requestId, donorId } = req.params;
        const { response } = req.body; // 'accepted' or 'declined'
        
        const updatedRequest = await AlertService.recordDonorResponse(
            requestId,
            donorId,
            response
        );
        
        res.status(200).json({
            message: 'Donor response recorded',
            request: updatedRequest
        });
    } catch (error) {
        console.error('Error handling donor response:', error);
        res.status(500).json({ error: 'Failed to record response' });
    }
};

// Coordinate donation
exports.coordinateDonation = async (req, res) => {
    try {
        const { requestId, donorId } = req.params;
        const { method } = req.body; // 'pickup' or 'hospital'
        
        const coordination = await AlertService.coordinateDonation(
            requestId,
            donorId,
            method
        );
        
        res.status(200).json(coordination);
    } catch (error) {
        console.error('Error coordinating donation:', error);
        res.status(500).json({ error: 'Failed to coordinate donation' });
    }
};