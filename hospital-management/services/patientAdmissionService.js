const Patient = require('../models/patient');
const Emergency = require('../models/emergency');
const Hospital = require('../models/hospital');

module.exports = {
    admitPatient: async (emergencyId, hospitalId) => {
        try {
            const emergency = await Emergency.findById(emergencyId)
                .populate('patient');
            
            if (!emergency) throw new Error('Emergency not found');
            
            // Create or update patient record
            let patient = emergency.patient;
            
            if (!patient) {
                patient = new Patient({
                    name: emergency.patientName,
                    age: emergency.patientAge,
                    bloodGroup: emergency.patientBloodGroup,
                    medicalHistory: emergency.patientMedicalHistory
                });
            }
            
            // Update admission info
            patient.admissionHospital = hospitalId;
            patient.admissionTime = new Date();
            patient.currentCondition = emergency.patientCondition;
            patient.emergencyCase = emergencyId;
            
            await patient.save();
            
            // Update emergency status
            emergency.status = 'in_treatment';
            emergency.patient = patient._id;
            await emergency.save();
            
            // Update hospital's current emergencies
            await Hospital.findByIdAndUpdate(
                hospitalId,
                { $addToSet: { currentEmergencies: emergencyId } }
            );
            
            return patient;
        } catch (error) {
            console.error('Error admitting patient:', error);
            throw error;
        }
    },
    
    updatePatientStatus: async (patientId, updates) => {
        try {
            const patient = await Patient.findByIdAndUpdate(
                patientId,
                { $set: updates },
                { new: true }
            );
            
            // If patient discharged, update emergency and hospital
            if (updates.dischargeTime) {
                await Emergency.updateOne(
                    { patient: patientId },
                    { $set: { status: 'completed' } }
                );
                
                await Hospital.updateOne(
                    { _id: patient.admissionHospital },
                    { $pull: { currentEmergencies: patient.emergencyCase } }
                );
                
                // Free up resources
                // Implementation would depend on your resource tracking
            }
            
            return patient;
        } catch (error) {
            console.error('Error updating patient status:', error);
            throw error;
        }
    }
};