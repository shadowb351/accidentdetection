const UserProfile = require('../models/userProfile');
const User = require('../models/user');
const ValidationUtils = require('../utils/validationUtils');

module.exports = {
    createOrUpdateProfile: async (userId, profileData) => {
        try {
            // Find or create profile
            let profile = await UserProfile.findOne({ user: userId });
            
            if (!profile) {
                profile = new UserProfile({
                    user: userId,
                    ...profileData
                });
            } else {
                Object.assign(profile, profileData);
            }
            
            await profile.save();
            
            // Update user reference
            await User.findByIdAndUpdate(userId, { hasProfile: true });
            
            return profile;
        } catch (error) {
            console.error('Error in profile service:', error);
            throw error;
        }
    },
    
    getUserProfile: async (userId) => {
        try {
            return await UserProfile.findOne({ user: userId })
                .populate('emergencyContacts');
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },
    
    validateMedicalData: (profileData) => {
        const errors = [];
        
        // Blood group validation
        if (profileData.bloodGroup && !ValidationUtils.isValidBloodGroup(profileData.bloodGroup)) {
            errors.push('Invalid blood group');
        }
        
        // Emergency contacts validation
        if (profileData.emergencyContacts) {
            profileData.emergencyContacts.forEach(contact => {
                if (!contact.name || !contact.phone) {
                    errors.push('Emergency contacts must have name and phone');
                }
                if (contact.phone && !ValidationUtils.isValidPhoneNumber(contact.phone)) {
                    errors.push('Invalid phone number format');
                }
            });
        }
        
        return errors;
    },
    
    getEmergencyProfileData: async (userId) => {
        try {
            const profile = await this.getUserProfile(userId);
            if (!profile) return null;
            
            // Return only essential emergency data
            return {
                userId,
                name: profile.name,
                bloodGroup: profile.bloodGroup,
                medicalConditions: profile.medicalConditions,
                allergies: profile.allergies,
                medications: profile.medications,
                emergencyContacts: profile.emergencyContacts,
                insuranceInfo: profile.insuranceInfo
            };
        } catch (error) {
            console.error('Error getting emergency profile:', error);
            throw error;
        }
    }
};