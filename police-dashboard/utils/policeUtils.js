const IncidentReport = require('../models/incidentReport');
const Emergency = require('../models/emergency');

module.exports = {
    getRecentIncidents: async (stationId) => {
        try {
            const station = await PoliceStation.findById(stationId);
            if (!station) throw new Error('Police station not found');
            
            return await IncidentReport.find({
                location: {
                    $geoWithin: {
                        $geometry: station.jurisdiction
                    }
                },
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
            })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('emergency', 'status patientCondition');
        } catch (error) {
            console.error('Error getting recent incidents:', error);
            throw error;
        }
    },
    
    getStationStats: async (stationId) => {
        try {
            const station = await PoliceStation.findById(stationId);
            if (!station) throw new Error('Police station not found');
            
            const totalEmergencies = await Emergency.countDocuments({
                location: {
                    $geoWithin: {
                        $geometry: station.jurisdiction
                    }
                },
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
            });
            
            const completedIncidents = await IncidentReport.countDocuments({
                location: {
                    $geoWithin: {
                        $geometry: station.jurisdiction
                    }
                },
                status: 'closed',
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            });
            
            return {
                totalEmergencies,
                completedIncidents,
                responseRate: totalEmergencies > 0 
                    ? Math.round((completedIncidents / totalEmergencies) * 100) 
                    : 0
            };
        } catch (error) {
            console.error('Error getting station stats:', error);
            throw error;
        }
    }
};
