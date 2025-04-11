const AlertService = require('./alertService');
const User = require('../models/user');
const { EventEmitter } = require('events');

// Store active countdowns
const activeCountdowns = new Map();
const countdownEmitter = new EventEmitter();

module.exports = {
    // Start emergency countdown
    startCountdown: async (userId, seconds) => {
        const countdownId = `countdown-${Date.now()}`;
        
        // Store countdown
        activeCountdowns.set(countdownId, {
            userId,
            expiresAt: new Date(Date.now() + seconds * 1000),
            timer: setTimeout(async () => {
                // Countdown expired - trigger emergency
                activeCountdowns.delete(countdownId);
                
                // Get user details
                const user = await User.findById(userId);
                if (!user) return;
                
                // Trigger emergency alert
                countdownEmitter.emit('countdownExpired', { userId, countdownId });
                await AlertService.triggerEmergencyAlert(user);
                
            }, seconds * 1000)
        });
        
        return { countdownId, expiresIn: seconds };
    },
    
    // Cancel active countdown
    cancelCountdown: async (userId, countdownId) => {
        const countdown = activeCountdowns.get(countdownId);
        
        if (countdown && countdown.userId === userId) {
            clearTimeout(countdown.timer);
            activeCountdowns.delete(countdownId);
            return true;
        }
        
        return false;
    },
    
    // Event emitter for countdown expiration
    countdownEmitter
};