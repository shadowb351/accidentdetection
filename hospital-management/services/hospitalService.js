const Hospital = require('../models/hospital');
const Emergency = require('../models/emergency');
const Patient = require('../models/patient');
const DashboardUtils = require('../utils/dashboardUtils');

module.exports = {
    getHospitalDashboard: async (hospitalId) => {
        try {
            const hospital = await Hospital.findById(hospitalId)
                .populate('resources')
                .populate('currentEmergencies');
            
            if (!hospital) throw new Error('Hospital not found');
            
            // Get active emergencies
            const activeEmergencies = await Emergency.find({
                assignedHospital: hospitalId,
                status: { $in: ['en_route', 'arrived', 'in_treatment'] }
            }).populate('ambulance patient');
            
            // Get resource utilization
            const resourceUtilization = await DashboardUtils.calculateResourceUtilization(hospitalId);
            
            // Get recent admissions
            const recentAdmissions = await Patient.find({
                admissionHospital: hospitalId,
                dischargeTime: null
            }).sort({ admissionTime: -1 }).limit(5);
            
            return {
                hospitalInfo: {
                    name: hospital.name,
                    location: hospital.location,
                    contact: hospital.contact
                },
                resources: hospital.resources,
                activeEmergencies,
                resourceUtilization,
                recentAdmissions,
                stats: await DashboardUtils.getHospitalStats(hospitalId)
            };
        } catch (error) {
            console.error('Error in hospital dashboard service:', error);
            throw error;
        }
    },
    
    receiveEmergencyAlert: async (hospitalId, emergencyDetails) => {
        try {
            const hospital = await Hospital.findById(hospitalId);
            if (!hospital) throw new Error('Hospital not found');
            
            // Check capacity
            const hasCapacity = await this.checkHospitalCapacity(hospitalId, emergencyDetails.patientCondition);
            
            return {
                hospitalId,
                canAccept: hasCapacity,
                estimatedPrepTime: 5 // minutes
            };
        } catch (error) {
            console.error('Error processing emergency alert:', error);
            throw error;
        }
    },
    
    checkHospitalCapacity: async (hospitalId, patientCondition) => {
        // Implementation would check specific resources based on patient needs
        return true; // Simplified for example
    }
};