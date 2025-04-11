const mongoose = require('mongoose');

const locationLogSchema = new mongoose.Schema({
    markerId: {
        type: String,
        required: true
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
    timestamp: {
        type: Date,
        default: Date.now
    }
});

locationLogSchema.index({ markerId: 1 });
locationLogSchema.index({ location: '2dsphere' });
locationLogSchema.index({ timestamp: 1 });

module.exports = mongoose.model('LocationLog', locationLogSchema);