const crypto = require('crypto');
const config = require('../config');

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(config.ENCRYPTION_SECRET, 'salt', 32);
const iv = crypto.randomBytes(16);

module.exports = {
    encryptMedicalData: (profileData) => {
        try {
            // Clone object to avoid mutation
            const encryptedProfile = { ...profileData };
            
            // Fields to encrypt
            const sensitiveFields = [
                'insuranceInfo',
                'emergencyContacts',
                'additionalNotes',
                'advanceDirective'
            ];
            
            sensitiveFields.forEach(field => {
                if (encryptedProfile[field]) {
                    const cipher = crypto.createCipheriv(algorithm, key, iv);
                    let encrypted = cipher.update(JSON.stringify(encryptedProfile[field]), 'utf8', 'hex');
                    encrypted += cipher.final('hex');
                    encryptedProfile[field] = encrypted;
                }
            });
            
            // Store IV for decryption
            encryptedProfile.encryptionIV = iv.toString('hex');
            
            return encryptedProfile;
        } catch (error) {
            console.error('Error encrypting medical data:', error);
            throw error;
        }
    },
    
    decryptMedicalData: (encryptedProfile) => {
        try {
            if (!encryptedProfile.encryptionIV) return encryptedProfile;
            
            // Clone object to avoid mutation
            const decryptedProfile = { ...encryptedProfile };
            const decipherIv = Buffer.from(decryptedProfile.encryptionIV, 'hex');
            
            // Fields to decrypt
            const sensitiveFields = [
                'insuranceInfo',
                'emergencyContacts',
                'additionalNotes',
                'advanceDirective'
            ];
            
            sensitiveFields.forEach(field => {
                if (decryptedProfile[field] && typeof decryptedProfile[field] === 'string') {
                    const decipher = crypto.createDecipheriv(algorithm, key, decipherIv);
                    let decrypted = decipher.update(decryptedProfile[field], 'hex', 'utf8');
                    decrypted += decipher.final('utf8');
                    decryptedProfile[field] = JSON.parse(decrypted);
                }
            });
            
            // Remove encryption metadata
            delete decryptedProfile.encryptionIV;
            
            return decryptedProfile;
        } catch (error) {
            console.error('Error decrypting medical data:', error);
            throw error;
        }
    }
};