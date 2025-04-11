const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: {
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
    contact: {
        phone: String,
        email: String,
        emergencyContact: String
    },
    resources: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    },
    currentEmergencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emergency'
    }],
    specialties: [String],
    capacity: {
        generalBeds: Number,
        icuBeds: Number,
        operatingRooms: Number
    },
    status: {
        type: String,
        enum: ['operational', 'overcrowded', 'closed'],
        default: 'operational'
    }
});

hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);