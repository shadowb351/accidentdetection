const Ambulance = require('../models/ambulance');
const Hospital = require('../models/hospital');
const User = require('../models/user');

module.exports = {
    getAllAmbulances: async (status) => {
        try {
            const filter = status ? { status } : {};
            
            return await Ambulance.find(filter)
                .sort({ status: 1, lastUpdated: -1 })
                .limit(100);
        } catch (error) {
            console.error('Error fetching ambulances:', error);
            throw error;
        }
    },
    
    getAllHospitals: async (status) => {
        try {
            const filter = status ? { status } : {};
            
            return await Hospital.find(filter)
                .sort({ name: 1 })
                .limit(100);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
            throw error;
        }
    },
    
    updateResourceStatus: async (resourceId, type, status) => {
        try {
            let resource;
            
            switch (type) {
                case 'ambulance':
                    resource = await Ambulance.findByIdAndUpdate(
                        resourceId,
                        { status },
                        { new: true }
                    );
                    break;
                    
                case 'hospital':
                    resource = await Hospital.findByIdAndUpdate(
                        resourceId,
                        { status },
                        { new: true }
                    );
                    break;
                    
                case 'user':
                    resource = await User.findByIdAndUpdate(
                        resourceId,
                        { isActive: status === 'active' },
                        { new: true }
                    );
                    break;
                    
                default:
                    throw new Error('Invalid resource type');
            }
            
            if (!resource) throw new Error('Resource not found');
            
            return resource;
        } catch (error) {
            console.error('Error updating resource status:', error);
            throw error;
        }
    },
    
    getResourceLocations: async () => {
        try {
            const [ambulances, hospitals] = await Promise.all([
                Ambulance.find({ location: { $exists: true } }),
                Hospital.find({ location: { $exists: true } })
            ]);
            
            return {
                ambulances: ambulances.map(a => ({
                    id: a._id,
                    type: 'ambulance',
                    location: a.location,
                    status: a.status
                })),
                hospitals: hospitals.map(h => ({
                    id: h._id,
                    type: 'hospital',
                    location: h.location,
                    status: h.status
                }))
            };
        } catch (error) {
            console.error('Error fetching resource locations:', error);
            throw error;
        }
    }
};