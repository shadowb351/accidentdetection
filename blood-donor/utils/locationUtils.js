module.exports = {
    calculateDistance: (point1, point2) => {
        // Haversine formula implementation
        const [lon1, lat1] = point1;
        const [lon2, lat2] = point2;
        
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },
    
    getTravelTime: (distanceKm, urgency) => {
        // Simple estimation - would use routing API in production
        const baseSpeed = 30; // km/h average
        const urgencyFactor = {
            routine: 1,
            urgent: 1.5,
            critical: 2
        };
        
        return (distanceKm / (baseSpeed * urgencyFactor[urgency])) * 60; // in minutes
    }
};