const Emergency = require('../models/emergency');
const PoliceStation = require('../models/policeStation');
const PoliceUtils = require('../utils/policeUtils');

module.exports = {
    getActiveEmergencies: async (stationId) => {
        try {
            const station = await PoliceStation.findById(stationId);
            if (!station) throw new Error('Police station not found');
            
            // Get emergencies within station's jurisdiction
            const emergencies = await Emergency.find({
                location: {
                    $nearSphere: {
                        $geometry: station.jurisdiction,
                        $maxDistance: station.jurisdictionRadius
                    }
                },
                status: { $in: ['reported', 'dispatched', 'en_route', 'arrived'] }
            })
            .populate('assignedHospital ambulance')
            .sort({ reportedAt: -1 });
            
            return emergencies.map(emergency => ({
                id: emergency._id,
                location: emergency.location,
                status: emergency.status,
                reportedAt: emergency.reportedAt,
                patientCondition: emergency.patientCondition,
                hospital: emergency.assignedHospital ? {
                    name: emergency.assignedHospital.name,
                    location: emergency.assignedHospital.location
                } : null,
                ambulance: emergency.ambulance ? {
                    vehicleNumber: emergency.ambulance.vehicleNumber,
                    currentLocation: emergency.ambulance.currentLocation
                } : null
            }));
        } catch (error) {
            console.error('Error in police service:', error);
            throw error;
        }
    },
    
    getPoliceDashboard: async (stationId) => {
        try {
            const station = await PoliceStation.findById(stationId);
            if (!station) throw new Error('Police station not found');
            
            const activeEmergencies = await this.getActiveEmergencies(stationId);
            const recentIncidents = await PoliceUtils.getRecentIncidents(stationId);
            const stats = await PoliceUtils.getStationStats(stationId);
            
            return {
                stationInfo: {
                    name: station.name,
                    location: station.location,
                    contact: station.contact
                },
                activeEmergencies,
                recentIncidents,
                stats
            };
        } catch (error) {
            console.error('Error getting police dashboard:', error);
            throw error;
        }
    }
};