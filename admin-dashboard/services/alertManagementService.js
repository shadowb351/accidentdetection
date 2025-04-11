const Emergency = require('../models/emergency');
const AdminAlert = require('../models/adminAlert');
const AdminUtils = require('../utils/adminUtils');

module.exports = {
    getAllAlerts: async ({ status, severity, timeRange }) => {
        try {
            const filter = {};
            
            if (status) filter.status = status;
            if (severity) filter.severity = severity;
            if (timeRange) {
                Object.assign(filter, AdminUtils.getTimeFilter(timeRange));
            }
            
            const alerts = await Emergency.find(filter)
                .sort({ reportedAt: -1 })
                .limit(100)
                .populate('assignedHospital ambulance');
            
            return alerts.map(alert => ({
                id: alert._id,
                type: alert.type,
                status: alert.status,
                priority: alert.priority,
                location: alert.location,
                reportedAt: alert.reportedAt,
                assignedHospital: alert.assignedHospital?.name,
                ambulance: alert.ambulance?.vehicleNumber
            }));
        } catch (error) {
            console.error('Error in alert management service:', error);
            throw error;
        }
    },
    
    getAlertDetails: async (alertId) => {
        try {
            const alert = await Emergency.findById(alertId)
                .populate('assignedHospital ambulance patient');
            
            if (!alert) throw new Error('Alert not found');
            
            // Get related admin alerts (notifications)
            const adminAlerts = await AdminAlert.find({ emergency: alertId })
                .sort({ createdAt: -1 });
            
            return {
                ...alert.toObject(),
                adminAlerts
            };
        } catch (error) {
            console.error('Error fetching alert details:', error);
            throw error;
        }
    },
    
    updateAlertStatus: async (alertId, status, notes) => {
        try {
            const alert = await Emergency.findByIdAndUpdate(
                alertId,
                { status },
                { new: true }
            );
            
            if (!alert) throw new Error('Alert not found');
            
            // Create admin alert for this change
            const adminAlert = new AdminAlert({
                emergency: alertId,
                type: 'status_change',
                message: `Status changed to ${status}`,
                notes,
                createdAt: new Date()
            });
            await adminAlert.save();
            
            return alert;
        } catch (error) {
            console.error('Error updating alert status:', error);
            throw error;
        }
    },
    
    notifyAdminsAboutAlert: async (alertId, message) => {
        // Implementation would notify all active admins
        // about important alert updates
    }
};