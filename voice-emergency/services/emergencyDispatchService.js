const EmergencyTrigger = require('../models/emergencyTrigger');
const User = require('../models/user');
const { sendEmergencyAlert } = require('./alertService');

module.exports = {
    triggerVoiceEmergency: async (userId, keywords) => {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');
            
            // Create emergency trigger
            const trigger = new EmergencyTrigger({
                user: userId,
                triggerType: 'voice',
                keywords,
                status: 'active',
                triggeredAt: new Date(),
                location: user.lastKnownLocation
            });
            await trigger.save();
            
            // Send emergency alert
            await sendEmergencyAlert({
                userId,
                triggerId: trigger._id,
                type: 'voice_emergency',
                keywords,
                location: user.lastKnownLocation
            });
            
            return trigger;
        } catch (error) {
            console.error('Error triggering voice emergency:', error);
            throw error;
        }
    },
    
    getEmergencyTrigger: async (triggerId) => {
        try {
            return await EmergencyTrigger.findById(triggerId)
                .populate('user');
        } catch (error) {
            console.error('Error fetching emergency trigger:', error);
            throw error;
        }
    },
    
    cancelEmergencyTrigger: async (triggerId) => {
        try {
            const trigger = await EmergencyTrigger.findByIdAndUpdate(
                triggerId,
                { 
                    status: 'cancelled',
                    cancelledAt: new Date() 
                },
                { new: true }
            );
            
            // Notify emergency services about cancellation
            await this.notifyCancellation(trigger);
            
            return {
                triggerId: trigger._id,
                status: trigger.status,
                cancelledAt: trigger.cancelledAt
            };
        } catch (error) {
            console.error('Error cancelling emergency:', error);
            throw error;
        }
    },
    
    notifyCancellation: async (trigger) => {
        // Implementation would notify emergency services
        // that this was a false alarm
    },
    
    startVoiceMonitoring: (userId) => {
        // Implementation would start continuous voice monitoring
        // in the background (via mobile SDK integration)
    }
};