const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
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
    dateOfBirth: {
        type: Date,
        required: true
    },
    weight: {
        type: Number,
        min: 40,
        max: 200
    },
    healthConditions: [String],
    lastDonationDate: Date,
    totalDonations: {
        type: Number,
        default: 0
    },
    eligible: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    verificationDate: Date,
    availability: {
        type: Boolean,
        default: true
    },
    activeRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodRequest'
    }],
    requestHistory: [{
        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BloodRequest'
        },
        response: String,
        date: Date
    }],
    donationHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation'
    }]
});

donorSchema.index({ location: '2dsphere' });
donorSchema.index({ bloodGroup: 1, eligible: 1, verificationStatus: 1 });

module.exports = mongoose.model('Donor', donorSchema);