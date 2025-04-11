const Donor = require('../models/donor');
const BloodUtils = require('../utils/bloodUtils');

module.exports = {
    upsertDonor: async (userId, donorData) => {
        try {
            // Find existing donor or create new
            let donor = await Donor.findOne({ user: userId });
            
            if (!donor) {
                donor = new Donor({
                    user: userId,
                    ...donorData,
                    lastDonationDate: null,
                    verificationStatus: 'pending'
                });
            } else {
                Object.assign(donor, donorData);
                donor.verificationStatus = 'pending'; // Require re-verification after update
            }
            
            await donor.save();
            return donor;
        } catch (error) {
            console.error('Error in donor service:', error);
            throw error;
        }
    },
    
    validateDonorData: (donorData) => {
        const errors = [];
        
        // Blood group validation
        if (!BloodUtils.isValidBloodGroup(donorData.bloodGroup)) {
            errors.push('Invalid blood group');
        }
        
        // Health conditions validation
        if (donorData.healthConditions && !Array.isArray(donorData.healthConditions)) {
            errors.push('Health conditions must be an array');
        }
        
        // Location validation
        if (!donorData.location || !donorData.location.coordinates) {
            errors.push('Valid location required');
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    },
    
    getDonorStatus: async (donorId) => {
        try {
            const donor = await Donor.findById(donorId);
            if (!donor) throw new Error('Donor not found');
            
            return {
                donorId,
                eligible: donor.eligible,
                verificationStatus: donor.verificationStatus,
                lastDonationDate: donor.lastDonationDate,
                totalDonations: donor.totalDonations,
                availability: donor.availability
            };
        } catch (error) {
            console.error('Error getting donor status:', error);
            throw error;
        }
    },
    
    updateDonorAvailability: async (donorId, availability) => {
        try {
            const donor = await Donor.findByIdAndUpdate(
                donorId,
                { availability },
                { new: true }
            );
            
            return donor;
        } catch (error) {
            console.error('Error updating donor availability:', error);
            throw error;
        }
    }
};