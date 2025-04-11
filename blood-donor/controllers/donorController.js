const DonorService = require('../services/donorService');
const VerificationService = require('../services/verificationService');

// Register or update donor profile
exports.registerDonor = async (req, res) => {
    try {
        const { userId } = req.params;
        const donorData = req.body;
        
        // Validate donor data
        const validation = DonorService.validateDonorData(donorData);
        if (!validation.valid) {
            return res.status(400).json({ errors: validation.errors });
        }
        
        // Create or update donor profile
        const donor = await DonorService.upsertDonor(userId, donorData);
        
        res.status(200).json({
            message: 'Donor profile updated successfully',
            donor
        });
    } catch (error) {
        console.error('Error registering donor:', error);
        res.status(500).json({ error: 'Failed to register donor' });
    }
};

// Verify donor eligibility
exports.verifyDonor = async (req, res) => {
    try {
        const { donorId } = req.params;
        
        const verification = await VerificationService.verifyDonorEligibility(donorId);
        
        res.status(200).json(verification);
    } catch (error) {
        console.error('Error verifying donor:', error);
        res.status(500).json({ error: 'Failed to verify donor' });
    }
};

// Get donor status
exports.getDonorStatus = async (req, res) => {
    try {
        const { donorId } = req.params;
        
        const status = await DonorService.getDonorStatus(donorId);
        
        res.status(200).json(status);
    } catch (error) {
        console.error('Error getting donor status:', error);
        res.status(500).json({ error: 'Failed to get donor status' });
    }
};