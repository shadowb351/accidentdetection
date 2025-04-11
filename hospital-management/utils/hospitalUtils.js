const Hospital = require('../models/hospital');
const Resource = require('../models/resource');

module.exports = {
    findSuitableHospitals: async (emergencyLocation, patientCondition) => {
        try {
            // Find hospitals within 20km radius
            const maxDistance = 20; // km
            
            // Base query for location
            const locationQuery = {
                location: {
                    $nearSphere: {
                        $geometry: {
                            type: "Point",
                            coordinates: emergencyLocation.coordinates
                        },
                        $maxDistance: maxDistance * 1000 // meters
                    }
                }
            };
            
            // Additional filters based on patient condition
            let resourceQuery = {};
            
            if (patientCondition.severity === 'critical') {
                resourceQuery = { 'icuBeds.available': { $gt: 0 } };
            } else {
                resourceQuery = { 'beds.available': { $gt: 0 } };
            }
            
            // Get hospitals with resources
            const resources = await Resource.find(resourceQuery);
            const hospitalIds = resources.map(r => r.hospital);
            
            // Combine queries
            const finalQuery = {
                ...locationQuery,
                _id: { $in: hospitalIds },
                status: 'operational'
            };
            
            if (patientCondition.specialtyNeeded) {
                finalQuery.specialties = patientCondition.specialtyNeeded;
            }
            
            return await Hospital.find(finalQuery)
                .populate('resources')
                .limit(5); // Return top 5 nearest suitable hospitals
        } catch (error) {
            console.error('Error finding suitable hospitals:', error);
            throw error;
        }
    },
    
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
    }
};