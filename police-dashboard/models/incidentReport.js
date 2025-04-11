const mongoose = require('mongoose');

const incidentReportSchema = new mongoose.Schema({
    emergency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emergency',
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
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PoliceStation.officers',
        required: true
    },
    initialObservations: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['reported', 'under_investigation', 'evidence_collection', 'completed', 'closed'],
        default: 'reported'
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    partiesInvolved: [{
        name: String,
        role: String,
        statement: String,
        injuries: String
    }],
    evidence: [{
        type: String, // URLs to photos/docs
        description: String
    }],
    investigationLogs: [{
        status: String,
        notes: String,
        updatedAt: {
            type: Date,
            default: Date.now
        },
        updatedBy: mongoose.Schema.Types.ObjectId
    }],
    finalReport: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

incidentReportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('IncidentReport', incidentReportSchema);