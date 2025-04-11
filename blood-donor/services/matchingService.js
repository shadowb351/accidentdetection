const Donor = require('../models/donor');
const LocationUtils = require('../utils/locationUtils');
const BloodUtils = require('../utils/bloodUtils');

module.exports = {
    findMatchingDonors: async (hospitalId, bloodGroup, unitsNeeded, urgency) => {
        try {
            const hospital = await Hospital.findById(hospitalId);
            if (!hospital) throw new Error('Hospital not found');
            
            // Determine search radius based on urgency
            const searchRadius = this.getSearchRadius(urgency);
            
            // Find eligible donors with matching blood group
            const compatibleGroups = BloodUtils.getCompatibleBloodGroups(bloodGroup);
            
            const donors = await Donor.find({
                bloodGroup: { $in: compatibleGroups },
                eligible: true,
                availability: true,
                verificationStatus: 'verified',
                location: {
                    $nearSphere: {
                        $geometry: hospital.location,
                        $maxDistance: searchRadius
                    }
                },
                $or: [
                    { lastDonationDate: { $exists: false } },
                    { lastDonationDate: { $lt: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000) } } // 8 weeks
                ]
            })
            .limit(unitsNeeded * 3) // Find more donors than needed
            .sort({ totalDonations: 1 }); // Prefer new donors
            
            return donors;
        } catch (error) {
            console.error('Error matching donors:', error);
            throw error;
        }
    },
    
    getSearchRadius: (urgency) => {
        // Return radius in meters
        switch (urgency) {
            case 'critical':
                return 20000; // 20km
            case 'urgent':
                return 10000; // 10km
            default:
                return 5000; // 5km
        }
    },
    
    verifyDonorCompatibility: (donorBloodGroup, patientBloodGroup) => {
        return BloodUtils.isCompatible(donorBloodGroup, patientBloodGroup);
    }
};