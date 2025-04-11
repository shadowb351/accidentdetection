const ProfileService = require('./profileService');
const EmergencyAccess = require('../models/emergencyAccess');
const EmergencyAlert = require('../models/emergencyAlert');

module.exports = {
    getEmergencyProfile: async (userId) => {
        try {
            const profile = await ProfileService.getEmergencyProfileData(userId);
            if (!profile) return null;
            
            // Add timestamp
            profile.lastAccessed = new Date();
            
            return profile;
        } catch (error) {
            console.error('Error in emergency attachment service:', error);
            throw error;
        }
    },
    
    attachToEmergencyAlert: async (userId, alertId) => {
        try {
            const profile = await ProfileService.getEmergencyProfileData(userId);
            if (!profile) return null;
            
            // Update emergency alert with profile data
            await EmergencyAlert.findByIdAndUpdate(alertId, {
                userProfile: profile
            });
            
            return profile;
        } catch (error) {
            console.error('Error attaching profile to alert:', error);
            throw error;
        }
    },
    
    logProfileAccess: async (userId, accessedBy, accessMethod, location) => {
        try {
            const accessRecord = new EmergencyAccess({
                user: userId,
                accessedBy,
                accessMethod,
                location,
                accessType: 'emergency_access'
            });
            
            await accessRecord.save();
            return accessRecord;
        } catch (error) {
            console.error('Error logging profile access:', error);
            throw error;
        }
    }
};