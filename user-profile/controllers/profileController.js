const ProfileService = require('../services/profileService');
const QRService = require('../services/qrService');
const EncryptionUtils = require('../utils/encryptionUtils');

// Create or update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profileData = req.body;
        
        // Validate medical data
        const validationErrors = ProfileService.validateMedicalData(profileData);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }
        
        // Encrypt sensitive data
        const encryptedProfile = EncryptionUtils.encryptMedicalData(profileData);
        
        const profile = await ProfileService.createOrUpdateProfile(userId, encryptedProfile);
        
        res.status(200).json({
            message: 'Profile updated successfully',
            profile
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const profile = await ProfileService.getUserProfile(userId);
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        // Decrypt sensitive data for authorized access
        const decryptedProfile = EncryptionUtils.decryptMedicalData(profile.toObject());
        
        res.status(200).json(decryptedProfile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// Generate emergency QR code
exports.generateQRCode = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const profile = await ProfileService.getUserProfile(userId);
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        // Generate QR code with minimal emergency info
        const qrCode = await QRService.generateEmergencyQR(userId, profile);
        
        res.status(200).json({
            message: 'QR code generated successfully',
            qrCodeUrl: qrCode.url,
            expiresAt: qrCode.expiresAt
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
};