const QRCode = require('qrcode');
const crypto = require('crypto');
const EmergencyAccess = require('../models/emergencyAccess');
const config = require('../config');

module.exports = {
    generateEmergencyQR: async (userId, profile) => {
        try {
            // Create access token
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + config.QR_EXPIRY_HOURS * 60 * 60 * 1000);
            
            // Store access record
            const accessRecord = new EmergencyAccess({
                user: userId,
                token,
                expiresAt,
                accessType: 'qr_code'
            });
            await accessRecord.save();
            
            // Generate QR code data
            const qrData = JSON.stringify({
                userId,
                token,
                name: profile.name,
                bloodGroup: profile.bloodGroup
            });
            
            // Generate QR code image
            const qrCodeUrl = await QRCode.toDataURL(qrData);
            
            return {
                url: qrCodeUrl,
                token,
                expiresAt
            };
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    },
    
    verifyAccessToken: async (token) => {
        try {
            const accessRecord = await EmergencyAccess.findOne({
                token,
                expiresAt: { $gt: new Date() }
            });
            
            if (!accessRecord) return null;
            
            // Update last accessed time
            accessRecord.lastAccessed = new Date();
            await accessRecord.save();
            
            return accessRecord.user;
        } catch (error) {
            console.error('Error verifying access token:', error);
            throw error;
        }
    },
    
    generateNFCTagData: async (userId) => {
        // Similar to QR but formatted for NFC
        // Implementation would depend on specific NFC requirements
    }
};