const AdminService = require('../services/adminService');
const AnalyticsService = require('../services/analyticsService');

// Get dashboard overview
exports.getDashboardOverview = async (req, res) => {
    try {
        const { adminId } = req.params;
        
        const overview = await AdminService.getAdminDashboard(adminId);
        
        res.status(200).json(overview);
    } catch (error) {
        console.error('Error fetching dashboard overview:', error);
        res.status(500).json({ error: 'Failed to load dashboard' });
    }
};

// Get system analytics
exports.getSystemAnalytics = async (req, res) => {
    try {
        const { timeRange } = req.query; // 24h, 7d, 30d, all
        
        const analytics = await AnalyticsService.getSystemAnalytics(timeRange);
        
        res.status(200).json(analytics);
    } catch (error) {
        console.error('Error fetching system analytics:', error);
        res.status(500).json({ error: 'Failed to load analytics' });
    }
};

// Update dashboard configuration
exports.updateDashboardConfig = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { config } = req.body;
        
        const updatedConfig = await AdminService.updateDashboardConfig(adminId, config);
        
        res.status(200).json({
            message: 'Dashboard configuration updated',
            config: updatedConfig
        });
    } catch (error) {
        console.error('Error updating dashboard config:', error);
        res.status(500).json({ error: 'Failed to update config' });
    }
};