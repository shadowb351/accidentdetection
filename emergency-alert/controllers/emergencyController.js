const AlertDispatchService = require('../services/alertDispatchService');
const EmergencyAlert = require('../models/emergencyAlert');

exports.triggerEmergencyAlert = async (req, res) => {
    try {
        const { userId, location } = req.body;
        
        if (!userId || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Dispatch emergency alerts
        const alertResult = await AlertDispatchService.dispatchEmergencyAlerts(userId, location);
        
        // Create alert record
        const alert = new EmergencyAlert({
            userId,
            location,
            dispatchedTo: alertResult.recipients,
            status: 'dispatched'
        });
        await alert.save();

        res.status(200).json({
            message: 'Emergency alerts dispatched successfully',
            alertId: alert._id,
            recipients: alertResult.recipients
        });
    } catch (error) {
        console.error('Error triggering emergency alert:', error);
        res.status(500).json({ error: 'Failed to dispatch emergency alerts' });
    }
};

exports.getAlertStatus = async (req, res) => {
    try {
        const { alertId } = req.params;
        const alert = await EmergencyAlert.findById(alertId)
            .populate('userId', 'name bloodGroup medicalConditions emergencyContacts');
        
        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }
        
        res.status(200).json(alert);
    } catch (error) {
        console.error('Error fetching alert status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};