const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodRequest',
        required: true
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    method: {
        type: String,
        enum: ['pickup', 'hospital'],
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'donor_en_route', 'pickup_scheduled', 'in_progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    scheduledAt: {
        type: Date,
        required: true
    },
    startedAt: Date,
    completedAt: Date,
    collectedUnits: {
        type: Number,
        min: 1,
        max: 2
    },
    notes: String
});

module.exports = mongoose.model('Donation', donationSchema);