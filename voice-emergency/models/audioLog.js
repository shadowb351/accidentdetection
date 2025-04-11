const mongoose = require('mongoose');

const audioLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    audioData: {
        type: Buffer,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    length: Number, // in seconds
    recordedAt: {
        type: Date,
        default: Date.now
    }
});

audioLogSchema.index({ user: 1 });
audioLogSchema.index({ recordedAt: -1 });

module.exports = mongoose.model('AudioLog', audioLogSchema);