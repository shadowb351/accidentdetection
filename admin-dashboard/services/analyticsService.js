const Emergency = require('../models/emergency');
const Ambulance = require('../models/ambulance');
const Hospital = require('../models/hospital');
const User = require('../models/user');
const AdminUtils = require('../utils/adminUtils');

module.exports = {
    getSystemAnalytics: async (timeRange = '24h') => {
        try {
            const timeFilter = AdminUtils.getTimeFilter(timeRange);
            
            const [
                emergencies,
                ambulances,
                hospitals,
                users,
                responseTimes
            ] = await Promise.all([
                this.getEmergencyStats(timeFilter),
                this.getAmbulanceStats(),
                this.getHospitalStats(),
                this.getUserStats(timeFilter),
                this.getResponseTimeStats(timeFilter)
            ]);
            
            return {
                emergencies,
                ambulances,
                hospitals,
                users,
                responseTimes,
                timeRange,
                generatedAt: new Date()
            };
        } catch (error) {
            console.error('Error in analytics service:', error);
            throw error;
        }
    },
    
    getEmergencyStats: async (timeFilter) => {
        const emergencies = await Emergency.aggregate([
            { $match: timeFilter },
            { $group: {
                _id: null,
                total: { $sum: 1 },
                critical: { $sum: { $cond: [{ $eq: ["$priority", "critical"] }, 1, 0] } },
                averageResponseTime: { $avg: "$responseTime" }
            }},
            { $project: { _id: 0 } }
        ]);
        
        const byType = await Emergency.aggregate([
            { $match: timeFilter },
            { $group: {
                _id: "$type",
                count: { $sum: 1 }
            }}
        ]);
        
        return {
            total: emergencies[0]?.total || 0,
            critical: emergencies[0]?.critical || 0,
            averageResponseTime: emergencies[0]?.averageResponseTime || 0,
            byType: byType.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {})
        };
    },
    
    getAmbulanceStats: async () => {
        const stats = await Ambulance.aggregate([
            { $group: {
                _id: "$status",
                count: { $sum: 1 }
            }}
        ]);
        
        return stats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});
    },
    
    getHospitalStats: async () => {
        const stats = await Hospital.aggregate([
            { $group: {
                _id: "$status",
                count: { $sum: 1 }
            }}
        ]);
        
        return stats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});
    },
    
    getUserStats: async (timeFilter) => {
        const stats = await User.aggregate([
            { $match: timeFilter },
            { $group: {
                _id: null,
                total: { $sum: 1 },
                active: { $sum: { $cond: ["$isActive", 1, 0] } }
            }},
            { $project: { _id: 0 } }
        ]);
        
        return {
            total: stats[0]?.total || 0,
            active: stats[0]?.active || 0
        };
    },
    
    getResponseTimeStats: async (timeFilter) => {
        const stats = await Emergency.aggregate([
            { $match: { ...timeFilter, responseTime: { $exists: true } } },
            { $group: {
                _id: null,
                avg: { $avg: "$responseTime" },
                min: { $min: "$responseTime" },
                max: { $max: "$responseTime" }
            }},
            { $project: { _id: 0 } }
        ]);
        
        return stats[0] || {};
    }
};