const AlertManagementService = require('../services/alertManagementService');

// Get all active alerts
exports.getAllAlerts = async (req, res) => {
    try {
        const { status, severity, timeRange } = req.query;
        
        const alerts = await AlertManagementService.getAllAlerts({
            status,
            severity,
            timeRange
        });
        
        res.status(200).json(alerts);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
};

// Get alert details
exports.getAlertDetails = async (req, res) => {
    try {
        const { alertId } = req.params;
        
        const alert = await AlertManagementService.getAlertDetails(alertId);
        
        res.status(200).json(alert);
    } catch (error) {
        console.error('Error fetching alert details:', error);
        res.status(500).json({ error: 'Failed to fetch alert' });
    }
};

// Update alert status
exports.updateAlertStatus = async (req, res) => {
    try {
        const { alertId } = req.params;
        const { status, notes } = req.body;
        
        const updatedAlert = await AlertManagementService.updateAlertStatus(
            alertId,
            status,
            notes
        );
        
        res.status(200).json({
            message: 'Alert status updated',
            alert: updatedAlert
        });
    } catch (error) {
        console.error('Error updating alert status:', error);
        res.status(500).json({ error: 'Failed to update alert' });
    }
};