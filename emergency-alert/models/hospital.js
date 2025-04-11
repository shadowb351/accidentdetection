const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
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
    emergencyCapacity: {
        type: Number,
        required: true
    },
    emergencyApiEndpoint: {
        type: String,
        required: true
    },
    contact: {
        phone: String,
        email: String
    }
});

hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);