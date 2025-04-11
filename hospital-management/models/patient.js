const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: Number,
    bloodGroup: String,
    medicalHistory: [String],
    currentCondition: {
        type: String,
        enum: ['critical', 'serious', 'stable', 'improving']
    },
    admissionHospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
    emergencyCase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emergency'
    },
    admissionTime: Date,
    dischargeTime: Date,
    assignedDoctor: String,
    treatmentPlan: [String],
    vitalSigns: [{
        timestamp: Date,
        bloodPressure: String,
        heartRate: Number,
        oxygenLevel: Number,
        temperature: Number
    }]
});

module.exports = mongoose.model('Patient', patientSchema);