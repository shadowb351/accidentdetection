const mongoose = require('mongoose');

const voiceCommandSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    audioLog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AudioLog',
        required: true
    },
    transcript: String,
    keywords: [String],
    isEmergency: {
        type: Boolean,
        required: true
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1
    },
    processedAt: {
        type: Date,
        default: Date.now
    }
});

voiceCommandSchema.index({ user: 1 });
voiceCommandSchema.index({ isEmergency: 1 });
voiceCommandSchema.index({ processedAt: -1 });

module.exports = mongoose.model('VoiceCommand', voiceCommandSchema);