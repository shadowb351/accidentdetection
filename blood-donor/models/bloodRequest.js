const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    unitsNeeded: {
        type: Number,
        min: 1,
        max: 10
    },
    urgency: {
        type: String,
        enum: ['routine', 'urgent', 'critical'],
        default: 'routine'
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'fulfilled', 'expired', 'cancelled'],
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
    potentialDonors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor'
    }],
    donorResponses: [{
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donor'
        },
        response: {
            type: String,
            enum: ['accepted', 'declined']
        },
        respondedAt: {
            type: Date,
            default: Date.now
        }
    }],
    acceptedDonors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor'
    }],
    coordinatedDonations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation'
    }],
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }
});

bloodRequestSchema.index({ location: '2dsphere' });
bloodRequestSchema.index({ status: 1, urgency: 1, bloodGroup: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);