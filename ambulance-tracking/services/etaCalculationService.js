const TrafficUtils = require('../utils/trafficUtils');
const Ambulance = require('../models/ambulance');

module.exports = {
    calculate: async (start, end, vehicleType) => {
        try {
            // Get base ETA without traffic
            const baseEta = TrafficUtils.calculateBaseETA(start, end);
            
            // Get traffic factor (0.8-1.5)
            const trafficFactor = await TrafficUtils.getTrafficFactor(start, end);
            
            // Vehicle type modifier
            const vehicleModifier = vehicleType === 'advanced' ? 0.9 : 1.0;
            
            // Calculate final ETA in minutes
            const etaMinutes = Math.ceil((baseEta * trafficFactor * vehicleModifier) / 60);
            
            return {
                eta: etaMinutes,
                units: 'minutes',
                calculatedAt: new Date(),
                trafficCondition: TrafficUtils.getTrafficCondition(trafficFactor)
            };
        } catch (error) {
            console.error('Error in ETA calculation:', error);
            throw error;
        }
    },
    
    recalculateETAs: async () => {
        // Batch process to update ETAs for all active ambulances
        // Would run on a schedule (e.g., every 2 minutes)
    }
};