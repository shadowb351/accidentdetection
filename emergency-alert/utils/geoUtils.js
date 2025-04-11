module.exports = {
    calculateDistance: (coord1, coord2) => {
        // Haversine formula implementation
        const [lon1, lat1] = coord1;
        const [lon2, lat2] = coord2;
        
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
    
    createLocationUrl: (coordinates) => {
        const [longitude, latitude] = coordinates;
        return `https://www.google.com/maps?q=${latitude},${longitude}`;
    }
};