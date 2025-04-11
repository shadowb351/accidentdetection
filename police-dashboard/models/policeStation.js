const mongoose = require('mongoose');

const policeStationSchema = new mongoose.Schema({
    name: {
        type: String,
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
    jurisdiction: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true
        },
        coordinates: {
            type: [[[Number]]], // Array of arrays of arrays
            required: true
        }
    },
    jurisdictionRadius: {
        type: Number, // meters
        required: true
    },
    contact: {
        phone: String,
        email: String,
        emergencyContact: String
    },
    officers: [{
        name: String,
        badgeNumber: String,
        rank: String,
        contact: String
    }],
    activePatrols: [{
        officerId: mongoose.Schema.Types.ObjectId,
        location: {
            type: {
                type: String,
                enum: ['Point']
            },
            coordinates: [Number]
        },
        status: String
    }]
});

policeStationSchema.index({ location: '2dsphere' });
policeStationSchema.index({ jurisdiction: '2dsphere' });

module.exports = mongoose.model('PoliceStation', policeStationSchema);