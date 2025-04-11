const mongoose = require('mongoose');

const emergencyAccessSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: String,
    accessedBy: {
        type: String,
        enum: ['first_responder', 'hospital_staff', 'self', 'system']
    },
    accessMethod: {
        type: String,
        enum: ['qr_code', 'nfc_tag', 'manual_entry', 'auto_attach']
    },
    accessType: {
        type: String,
        enum: ['qr_code', 'emergency_access']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: [Number]
    },
    expiresAt: Date,
    lastAccessed: Date,
    associatedAlert: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmergencyAlert'
    }
});

emergencyAccessSchema.index({ token: 1 });
emergencyAccessSchema.index({ user: 1 });
emergencyAccessSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('EmergencyAccess', emergencyAccessSchema);