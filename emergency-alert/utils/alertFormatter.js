const { createLocationUrl } = require('./geoUtils');

module.exports = {
    formatEmergencyAlert: (user, location) => {
        const locationUrl = createLocationUrl(location.coordinates);
        
        return {
            alertId: `emergency-${Date.now()}`,
            timestamp: new Date(),
            user: {
                id: user._id,
                name: user.name,
                bloodGroup: user.bloodGroup,
                medicalConditions: user.medicalConditions
            },
            location: {
                coordinates: location.coordinates,
                url: locationUrl
            },
            summary: `Emergency alert for ${user.name} (Blood Group: ${user.bloodGroup}). ` +
                    `Medical conditions: ${user.medicalConditions.join(', ') || 'None'}. ` +
                    `Location: ${locationUrl}`,
            fullDetails: {
                user: user.toObject(),
                location
            }
        };
    }
};