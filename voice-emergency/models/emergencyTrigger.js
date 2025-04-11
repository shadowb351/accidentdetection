const mongoose = require('mongoose');

const emergencyTriggerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    triggerType: {
        type: String,
        enum: ['voice', 'manual', 'automatic'],
        required: true
    },
    keywords: [String],
    status: {
        type: String,
        enum: ['active', 'responded', 'cancelled', 'completed'],
        default: 'active'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    triggeredAt: {
        type: Date,
        default: Date.now
    },
    respondedAt: Date,
    cancelledAt: Date,
    completedAt: Date,
    responderNotes: String
});

emergencyTriggerSchema.index({ user: 1 });
emergencyTriggerSchema.index({ status: 1 });
emergencyTriggerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('EmergencyTrigger', emergencyTriggerSchema);