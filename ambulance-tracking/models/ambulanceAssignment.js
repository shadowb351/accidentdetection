const mongoose = require('mongoose');

const ambulanceAssignmentSchema = new mongoose.Schema({
    ambulance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ambulance',
        required: true
    },
    emergency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emergency',
        required: true
    },
    emergencyLocation: {
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
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
    hospitalLocation: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: [Number]
    },
    status: {
        type: String,
        enum: ['dispatched', 'reached', 'picked', 'en_route', 'arrived', 'completed'],
        default: 'dispatched'
    },
    dispatchedAt: Date,
    reachedAt: Date,
    pickedAt: Date,
    arrivedAt: Date,
    estimatedTimes: {
        toEmergency: Number, // minutes
        toHospital: Number   // minutes
    },
    routeToEmergency: {
        geometry: mongoose.Schema.Types.Mixed,
        distance: Number,
        duration: Number
    },
    routeToHospital: {
        geometry: mongoose.Schema.Types.Mixed,
        distance: Number,
        duration: Number
    }
});

ambulanceAssignmentSchema.index({ emergencyLocation: '2dsphere' });
ambulanceAssignmentSchema.index({ hospitalLocation: '2dsphere' });

module.exports = mongoose.model('AmbulanceAssignment', ambulanceAssignmentSchema);