const twilio = require('twilio');
const axios = require('axios');
const User = require('../models/user');

// Initialize Twilio client
const twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = {
    sendAmbulanceAlert: async (ambulance, alertMessage) => {
        try {
            // In a real implementation, this would use the ambulance's communication system
            await axios.post(ambulance.notificationEndpoint, {
                message: alertMessage,
                priority: 'high'
            });
            
            console.log(`Alert sent to ambulance ${ambulance._id}`);
        } catch (error) {
            console.error(`Failed to notify ambulance ${ambulance._id}:`, error);
        }
    },
    
    sendHospitalAlert: async (hospital, alertMessage) => {
        try {
            // Send to hospital's emergency system
            await axios.post(hospital.emergencyApiEndpoint, {
                alert: alertMessage,
                bedRequest: 1
            });
            
            console.log(`Alert sent to hospital ${hospital._id}`);
        } catch (error) {
            console.error(`Failed to notify hospital ${hospital._id}:`, error);
        }
    },
    
    sendPoliceAlert: async (station, alertMessage) => {
        try {
            // Send to police dispatch system
            await axios.post(station.dispatchEndpoint, {
                emergency: alertMessage,
                priority: 'high'
            });
            
            console.log(`Alert sent to police station ${station._id}`);
        } catch (error) {
            console.error(`Failed to notify police station ${station._id}:`, error);
        }
    },
    
    sendContactAlert: async (contact, alertMessage) => {
        try {
            // Send SMS via Twilio
            if (contact.phone) {
                await twilioClient.messages.create({
                    body: `EMERGENCY ALERT: ${alertMessage.summary}\nLocation: ${alertMessage.locationUrl}`,
                    to: contact.phone,
                    from: process.env.TWILIO_PHONE_NUMBER
                });
            }
            
            // Send push notification if registered
            if (contact.pushToken) {
                await axios.post('https://exp.host/--/api/v2/push/send', {
                    to: contact.pushToken,
                    title: 'Emergency Alert',
                    body: alertMessage.summary,
                    data: { alertId: alertMessage.alertId }
                });
            }
            
            console.log(`Alert sent to emergency contact ${contact.name}`);
        } catch (error) {
            console.error(`Failed to notify emergency contact ${contact.name}:`, error);
        }
    }
};