const LocationService = require('./locationService');
const RecipientService = require('./recipientService');
const NotificationService = require('./notificationService');
const AlertFormatter = require('../utils/alertFormatter');
const User = require('../models/user');

module.exports = {
    dispatchEmergencyAlerts: async (userId, location) => {
        try {
            // Get user details
            const user = await User.findById(userId)
                .select('name bloodGroup medicalConditions emergencyContacts');
            
            if (!user) {
                throw new Error('User not found');
            }

            // Find nearest recipients
            const nearestAmbulances = await LocationService.findNearestAmbulances(location);
            const nearestHospitals = await LocationService.findNearestHospitals(location);
            const nearestPoliceStations = await LocationService.findNearestPoliceStations(location);
            
            // Format alert message
            const alertMessage = AlertFormatter.formatEmergencyAlert(user, location);
            
            // Dispatch alerts
            const ambulancePromises = nearestAmbulances.map(ambulance => 
                NotificationService.sendAmbulanceAlert(ambulance, alertMessage)
            );
            
            const hospitalPromises = nearestHospitals.map(hospital => 
                NotificationService.sendHospitalAlert(hospital, alertMessage)
            );
            
            const policePromises = nearestPoliceStations.map(station => 
                NotificationService.sendPoliceAlert(station, alertMessage)
            );
            
            // Send to emergency contacts (SMS/push)
            const contactPromises = user.emergencyContacts.map(contact => 
                NotificationService.sendContactAlert(contact, alertMessage)
            );
            
            // Wait for all notifications to complete
            await Promise.all([
                ...ambulancePromises,
                ...hospitalPromises,
                ...policePromises,
                ...contactPromises
            ]);
            
            return {
                success: true,
                recipients: {
                    ambulances: nearestAmbulances.length,
                    hospitals: nearestHospitals.length,
                    policeStations: nearestPoliceStations.length,
                    contacts: user.emergencyContacts.length
                }
            };
        } catch (error) {
            console.error('Error dispatching emergency alerts:', error);
            throw error;
        }
    }
};