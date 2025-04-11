const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    dispatchedTo: {
        ambulances: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ambulance'
        }],
        hospitals: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hospital'
        }],
        policeStations: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PoliceStation'
        }],
        contacts: [{
            name: String,
            phone: String,
            notified: Boolean
        }]
    },
    status: {
        type: String,
        enum: ['dispatched', 'acknowledged', 'responded', 'completed'],
        default: 'dispatched'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

emergencyAlertSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('EmergencyAlert', emergencyAlertSchema);