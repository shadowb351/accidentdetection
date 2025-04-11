const Ambulance = require('../models/ambulance');
const AmbulanceAssignment = require('../models/ambulanceAssignment');
const NavigationService = require('./navigationService');
const ETACalculationService = require('./etaCalculationService');
const { emitAmbulanceUpdate } = require('../sockets/ambulanceSocket');

module.exports = {
    assignAmbulanceToEmergency: async (ambulanceId, emergencyId) => {
        try {
            // Get ambulance details
            const ambulance = await Ambulance.findById(ambulanceId);
            if (!ambulance) throw new Error('Ambulance not found');
            
            // Create new assignment
            const assignment = new AmbulanceAssignment({
                ambulance: ambulanceId,
                emergency: emergencyId,
                status: 'dispatched',
                dispatchedAt: new Date()
            });
            
            await assignment.save();
            
            // Update ambulance status
            ambulance.currentAssignment = assignment._id;
            ambulance.status = 'dispatched';
            await ambulance.save();
            
            // Notify ambulance driver via WebSocket
            emitAmbulanceUpdate(ambulanceId, {
                assignment,
                route: await NavigationService.getRoute(
                    ambulance.currentLocation,
                    assignment.emergencyLocation
                )
            });
            
            return assignment;
        } catch (error) {
            console.error('Error in ambulance assignment:', error);
            throw error;
        }
    },
    
    calculateETA: async (ambulanceId, destination) => {
        try {
            const ambulance = await Ambulance.findById(ambulanceId);
            if (!ambulance) throw new Error('Ambulance not found');
            
            return await ETACalculationService.calculate(
                ambulance.currentLocation,
                destination,
                ambulance.vehicleType
            );
        } catch (error) {
            console.error('Error calculating ETA:', error);
            throw error;
        }
    },
    
    trackAmbulancePosition: async (ambulanceId, newPosition) => {
        try {
            const ambulance = await Ambulance.findByIdAndUpdate(
                ambulanceId,
                { 
                    currentLocation: newPosition,
                    lastUpdated: new Date() 
                },
                { new: true }
            );
            
            if (ambulance.currentAssignment) {
                const assignment = await AmbulanceAssignment.findById(ambulance.currentAssignment)
                    .populate('emergency');
                
                // Recalculate ETA
                const eta = await ETACalculationService.calculate(
                    newPosition,
                    assignment.emergency.location,
                    ambulance.vehicleType
                );
                
                // Broadcast update to all interested parties
                emitAmbulanceUpdate(ambulanceId, {
                    position: newPosition,
                    eta,
                    status: ambulance.status
                });
            }
            
            return ambulance;
        } catch (error) {
            console.error('Error tracking ambulance position:', error);
            throw error;
        }
    }
};