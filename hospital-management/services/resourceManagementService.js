const Hospital = require('../models/hospital');
const Resource = require('../models/resource');

module.exports = {
    updateHospitalResources: async (hospitalId, updates) => {
        try {
            const hospital = await Hospital.findById(hospitalId);
            if (!hospital) throw new Error('Hospital not found');
            
            // Find or create resource record
            let resource = await Resource.findOne({ hospital: hospitalId });
            
            if (!resource) {
                resource = new Resource({
                    hospital: hospitalId,
                    ...updates
                });
            } else {
                Object.assign(resource, updates);
            }
            
            await resource.save();
            
            // Update hospital's resource reference
            if (!hospital.resources) {
                hospital.resources = resource._id;
                await hospital.save();
            }
            
            return resource;
        } catch (error) {
            console.error('Error updating hospital resources:', error);
            throw error;
        }
    },
    
    allocateResourcesForEmergency: async (hospitalId, emergencyId, patientCondition) => {
        try {
            const resource = await Resource.findOne({ hospital: hospitalId });
            if (!resource) throw new Error('Hospital resources not found');
            
            // Based on patient condition, allocate specific resources
            let allocated = false;
            
            switch (patientCondition.severity) {
                case 'critical':
                    if (resource.icuBeds.available > 0) {
                        resource.icuBeds.available -= 1;
                        resource.icuBeds.allocated += 1;
                        allocated = true;
                    }
                    break;
                case 'serious':
                    if (resource.beds.available > 0) {
                        resource.beds.available -= 1;
                        resource.beds.allocated += 1;
                        allocated = true;
                    }
                    break;
                default:
                    if (resource.beds.available > 0) {
                        resource.beds.available -= 1;
                        resource.beds.allocated += 1;
                        allocated = true;
                    }
            }
            
            if (allocated) {
                await resource.save();
                return { success: true, resource };
            }
            
            return { success: false, message: 'Insufficient resources' };
        } catch (error) {
            console.error('Error allocating resources:', error);
            throw error;
        }
    }
};