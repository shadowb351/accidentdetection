const Ambulance = require('../models/ambulance');
const Hospital = require('../models/hospital');
const PoliceStation = require('../models/policeStation');
const { calculateDistance } = require('../utils/geoUtils');

// Maximum distance in kilometers
const MAX_DISTANCE = 10; 

module.exports = {
    findNearestAmbulances: async (location) => {
        const ambulances = await Ambulance.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: location.coordinates
                    },
                    $maxDistance: MAX_DISTANCE * 1000 // Convert to meters
                }
            },
            available: true
        }).limit(3); // Get top 3 nearest
        
        return ambulances;
    },
    
    findNearestHospitals: async (location) => {
        const hospitals = await Hospital.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: location.coordinates
                    },
                    $maxDistance: MAX_DISTANCE * 1000
                }
            },
            emergencyCapacity: { $gt: 0 }
        }).limit(2); // Get top 2 nearest
        
        return hospitals;
    },
    
    findNearestPoliceStations: async (location) => {
        const stations = await PoliceStation.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: location.coordinates
                    },
                    $maxDistance: MAX_DISTANCE * 1000
                }
            }
        }).limit(1); // Get nearest station
        
        return stations;
    }
};