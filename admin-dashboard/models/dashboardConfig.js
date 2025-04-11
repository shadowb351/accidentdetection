const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['alerts', 'map', 'resources', 'analytics', 'logs']
    },
    position: {
        type: String,
        required: true,
        enum: ['top', 'main', 'sidebar', 'bottom']
    },
    size: {
        type: String,
        required: true,
        enum: ['small', 'medium', 'large']
    },
    config: mongoose.Schema.Types.Mixed
});

const dashboardConfigSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
        unique: true
    },
    layout: {
        type: String,
        enum: ['standard', 'compact', 'expanded'],
        default: 'standard'
    },
    widgets: [widgetSchema],
    notificationPreferences: {
        emergency: Boolean,
        system: Boolean,
        updates: Boolean
    },
    mapStyle: {
        type: String,
        default: 'streets'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DashboardConfig', dashboardConfigSchema);