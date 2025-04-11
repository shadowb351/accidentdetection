const Hospital = require('../models/hospital');
const Emergency = require('../models/emergency');
const HospitalUtils = require('../utils/hospitalUtils');

module.exports = {
    assignToNearestHospital: async (emergencyId, patientCondition) => {
        try {
            const emergency = await Emergency.findById(emergencyId);
            if (!emergency) throw new Error('Emergency not found');
            
            // Find nearest hospitals with capacity
            const suitableHospitals = await HospitalUtils.findSuitableHospitals(
                emergency.location,
                patientCondition
            );
            
            if (suitableHospitals.length === 0) {
                throw new Error('No suitable hospitals available');
            }
            
            // Assign to the nearest suitable hospital
            const assignedHospital = suitableHospitals[0];
            
            // Update emergency record
            emergency.assignedHospital = assignedHospital._id;
            emergency.hospitalAssignmentTime = new Date();
            await emergency.save();
            
            // Allocate resources
            await this.allocateHospitalResources(assignedHospital._id, emergencyId, patientCondition);
            
            return {
                emergencyId,
                hospitalId: assignedHospital._id,
                hospitalName: assignedHospital.name,
                distance: HospitalUtils.calculateDistance(
                    emergency.location.coordinates,
                    assignedHospital.location.coordinates
                ),
                estimatedArrivalTime: new Date(Date.now() + 15 * 60000) // 15 mins default
            };
        } catch (error) {
            console.error('Error in auto-assignment:', error);
            throw error;
        }
    },
    
    allocateHospitalResources: async (hospitalId, emergencyId, patientCondition) => {
        // Implementation would reserve beds/resources
        // and prepare hospital for incoming patient
    }
};