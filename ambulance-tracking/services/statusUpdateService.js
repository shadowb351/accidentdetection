const Ambulance = require('../models/ambulance');
const AmbulanceStatus = require('../models/ambulanceStatus');
const { emitAmbulanceUpdate } = require('../sockets/ambulanceSocket');

const STATUS_FLOW = {
    dispatched: ['reached'],
    reached: ['picked'],
    picked: ['en_route'],
    en_route: ['arrived'],
    arrived: []
};

module.exports = {
    updateAmbulanceStatus: async (ambulanceId, newStatus, currentLocation = null) => {
        try {
            const ambulance = await Ambulance.findById(ambulanceId);
            if (!ambulance) throw new Error('Ambulance not found');
            
            // Validate status transition
            if (!STATUS_FLOW[ambulance.status].includes(newStatus)) {
                throw new Error(`Invalid status transition from ${ambulance.status} to ${newStatus}`);
            }
            
            // Update ambulance
            ambulance.status = newStatus;
            if (currentLocation) {
                ambulance.currentLocation = currentLocation;
            }
            await ambulance.save();
            
            // Create status record
            const statusRecord = new AmbulanceStatus({
                ambulance: ambulanceId,
                status: newStatus,
                location: currentLocation || ambulance.currentLocation,
                timestamp: new Date()
            });
            await statusRecord.save();
            
            // Broadcast update
            emitAmbulanceUpdate(ambulanceId, {
                status: newStatus,
                position: currentLocation || ambulance.currentLocation,
                updatedAt: new Date()
            });
            
            return ambulance;
        } catch (error) {
            console.error('Error updating ambulance status:', error);
            throw error;
        }
    }
};