const EmergencyAccessService = require('../services/emergencyAttachmentService');
const QRService = require('../services/qrService');

// Access profile via QR/NFC
exports.accessProfile = async (req, res) => {
    try {
        const { token } = req.params;
        
        // Verify token and get user ID
        const userId = await QRService.verifyAccessToken(token);
        if (!userId) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        
        // Get emergency-relevant profile data
        const profile = await EmergencyAccessService.getEmergencyProfile(userId);
        
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error accessing emergency profile:', error);
        res.status(500).json({ error: 'Failed to access profile' });
    }
};

// Log emergency access
exports.logAccess = async (req, res) => {
    try {
        const { userId } = req.params;
        const { accessedBy, accessMethod, location } = req.body;
        
        await EmergencyAccessService.logProfileAccess(
            userId,
            accessedBy,
            accessMethod,
            location
        );
        
        res.status(200).json({ message: 'Access logged successfully' });
    } catch (error) {
        console.error('Error logging access:', error);
        res.status(500).json({ error: 'Failed to log access' });
    }
};