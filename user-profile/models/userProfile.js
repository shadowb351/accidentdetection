const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    dateOfBirth: Date,
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']
    },
    height: Number,
    weight: Number,
    medicalConditions: [String],
    allergies: [{
        name: String,
        severity: {
            type: String,
            enum: ['mild', 'moderate', 'severe']
        }
    }],
    medications: [{
        name: String,
        dosage: String,
        frequency: String
    }],
    emergencyContacts: [{
        name: String,
        relationship: String,
        phone: String,
        email: String,
        isPrimary: Boolean
    }],
    insuranceInfo: {
        provider: String,
        policyNumber: String,
        groupNumber: String
    },
    additionalNotes: String,
    organDonor: Boolean,
    advanceDirective: {
        hasDirective: Boolean,
        documentUrl: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

module.exports = mongoose.model('UserProfile', userProfileSchema);