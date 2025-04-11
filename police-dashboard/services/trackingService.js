const Ambulance = require('../models/ambulance');
const Emergency = require('../models/emergency');
const { calculateETA } = require('../utils/mapUtils');

module.exports = {
    getAmbulanceTrackingData: async (ambulanceId) => {
        try {
            const ambulance = await Ambulance.findById(ambulanceId)
                .populate('currentAssignment');
            
            if (!ambulance) throw new Error('Ambulance not found');
            
            if (!ambulance.currentAssignment) {
                return {
                    ambulanceId,
                    status: 'available',
                    message: 'Ambulance not currently assigned'
                };
            }
            
            const emergency = await Emergency.findById(ambulance.currentAssignment.emergency);
            
            return {
                ambulanceId,
                vehicleNumber: ambulance.vehicleNumber,
                currentLocation: ambulance.currentLocation,
                status: ambulance.status,
                emergency: {
                    id: emergency._id,
                    location: emergency.location,
                    patientCondition: emergency.patientCondition
                },
                assignedHospital: ambulance.currentAssignment.hospital
                    ? {
                        id: ambulance.currentAssignment.hospital,
                        location: ambulance.currentAssignment.hospitalLocation
                    }
                    : null,
                route: ambulance.currentAssignment.routeToEmergency,
                eta: await calculateETA(
                    ambulance.currentLocation.coordinates,
                    emergency.location.coordinates
                ),
                lastUpdated: ambulance.lastUpdated
            };
        } catch (error) {
            console.error('Error in tracking service:', error);
            throw error;
        }
    },
    
    trackAllAmbulances: async (stationId) => {
        // Implementation would track all ambulances in the station's jurisdiction
    }
};