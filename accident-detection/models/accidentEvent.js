const mongoose = require('mongoose');

const accidentEventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    detectedAt: {
        type: Date,
        default: Date.now
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
    sensorData: {
        accelerometer: {
            x: Number,
            y: Number,
            z: Number
        },
        gyroscope: {
            x: Number,
            y: Number,
            z: Number
        },
        microphone: {
            intensity: Number,
            frequencyProfile: [Number]
        }
    },
    status: {
        type: String,
        enum: ['detected', 'cancelled', 'alerted'],
        default: 'detected'
    },
    alertSentAt: Date
});

// Create geospatial index for location
accidentEventSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('AccidentEvent', accidentEventSchema);