const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    instruction: String,
    distance: Number,
    duration: Number,
    geometry: {
        type: {
            type: String,
            enum: ['LineString'],
            required: true
        },
        coordinates: {
            type: [[Number]],
            required: true
        }
    }
});

const routeSchema = new mongoose.Schema({
    geometry: {
        type: {
            type: String,
            enum: ['LineString'],
            required: true
        },
        coordinates: {
            type: [[Number]],
            required: true
        }
    },
    distance: Number,
    duration: Number,
    profile: {
        type: String,
        enum: ['driving', 'walking', 'emergency'],
        required: true
    },
    start: {
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
    end: {
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
    steps: [stepSchema],
    waypoints: [mongoose.Schema.Types.Mixed],
    trafficUpdates: [{
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: [Number]
        },
        severity: String,
        congestion: Number,
        delay: Number,
        timestamp: Date
    }],
    updatedAt: Date
});

routeSchema.index({ start: '2dsphere' });
routeSchema.index({ end: '2dsphere' });

module.exports = mongoose.model('Route', routeSchema);