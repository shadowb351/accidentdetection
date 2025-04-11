const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    patientName: String,
    patientAge: Number,
    patientBloodGroup: String,
    patientMedicalHistory: [String],
    patientCondition: {
        type: String,
        enum: ['critical', 'serious', 'stable', 'minor'],
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
    assignedHospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
    ambulance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ambulance'
    },
    status: {
        type: String,
        enum: ['reported', 'dispatched', 'en_route', 'arrived', 'in_treatment', 'completed'],
        default: 'reported'
    },
    reportedAt: {
        type: Date,
        default: Date.now
    },
    hospitalAssignmentTime: Date,
    treatmentStartTime: Date,
    completionTime: Date,
    priority: {
        type: Number,
        min: 1,
        max: 5
    }
});

emergencySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Emergency', emergencySchema);