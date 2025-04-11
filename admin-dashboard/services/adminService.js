const DashboardConfig = require('../models/dashboardConfig');
const AdminLog = require('../models/adminLog');
const AlertManagementService = require('./alertManagementService');
const ResourceManagementService = require('./resourceManagementService');

module.exports = {
    getAdminDashboard: async (adminId) => {
        try {
            // Get dashboard configuration
            const config = await DashboardConfig.findOne({ admin: adminId }) || 
                await this.createDefaultConfig(adminId);
            
            // Get active alerts
            const activeAlerts = await AlertManagementService.getAllAlerts({
                status: 'active',
                timeRange: '24h'
            });
            
            // Get resource status
            const ambulances = await ResourceManagementService.getAllAmbulances();
            const hospitals = await ResourceManagementService.getAllHospitals();
            
            // Get system status
            const systemStatus = await this.getSystemStatus();
            
            return {
                config,
                activeAlerts,
                ambulances: ambulances.slice(0, 5), // top 5
                hospitals: hospitals.slice(0, 5),   // top 5
                systemStatus
            };
        } catch (error) {
            console.error('Error in admin service:', error);
            throw error;
        }
    },
    
    createDefaultConfig: async (adminId) => {
        const defaultConfig = new DashboardConfig({
            admin: adminId,
            layout: 'standard',
            widgets: [
                { type: 'alerts', position: 'top', size: 'large' },
                { type: 'map', position: 'main', size: 'large' },
                { type: 'resources', position: 'sidebar', size: 'medium' }
            ],
            notificationPreferences: {
                emergency: true,
                system: true,
                updates: false
            }
        });
        
        await defaultConfig.save();
        return defaultConfig;
    },
    
    updateDashboardConfig: async (adminId, config) => {
        try {
            const updatedConfig = await DashboardConfig.findOneAndUpdate(
                { admin: adminId },
                { $set: config },
                { new: true, upsert: true }
            );
            
            // Log configuration change
            await this.logAdminAction(
                adminId,
                'update_dashboard_config',
                'Dashboard configuration updated'
            );
            
            return updatedConfig;
        } catch (error) {
            console.error('Error updating dashboard config:', error);
            throw error;
        }
    },
    
    getSystemStatus: async () => {
        // Implementation would check various system components
        return {
            api: 'online',
            database: 'online',
            notifications: 'online',
            mapService: 'online',
            lastChecked: new Date()
        };
    },
    
    logAdminAction: async (adminId, actionType, description) => {
        const logEntry = new AdminLog({
            admin: adminId,
            actionType,
            description,
            timestamp: new Date()
        });
        
        await logEntry.save();
    }
};