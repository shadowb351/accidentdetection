const EmergencyDispatchService = require('../services/emergencyDispatchService');

// Handle emergency trigger
exports.handleEmergencyTrigger = async (req, res) => {
    try {
        const { triggerId } = req.params;
        
        const trigger = await EmergencyDispatchService.getEmergencyTrigger(triggerId);
        
        res.status(200).json(trigger);
    } catch (error) {
        console.error('Error fetching emergency trigger:', error);
        res.status(500).json({ error: 'Failed to fetch trigger' });
    }
};

// Cancel false alarm
exports.cancelEmergency = async (req, res) => {
    try {
        const { triggerId } = req.params;
        
        const result = await EmergencyDispatchService.cancelEmergencyTrigger(triggerId);
        
        res.status(200).json({
            message: 'Emergency cancelled',
            ...result
        });
    } catch (error) {
        console.error('Error cancelling emergency:', error);
        res.status(500).json({ error: 'Failed to cancel emergency' });
    }
};