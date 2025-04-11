const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
    vehicleNumber: {
        type: String,
        required: true,
        unique: true
    },
    vehicleType: {
        type: String,
        enum: ['basic', 'advanced', 'mobile_icu'],
        required: true
    },
    currentLocation: {
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
    status: {
        type: String,
        enum: ['available', 'dispatched', 'reached', 'picked', 'en_route', 'arrived', 'offline'],
        default: 'available'
    },
    currentAssignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AmbulanceAssignment'
    },
    crew: [{
        name: String,
        role: String,
        contact: String
    }],
    lastUpdated: Date,
    capacity: {
        type: Number,
        min: 1,
        max: 4
    }
});

ambulanceSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Ambulance', ambulanceSchema);