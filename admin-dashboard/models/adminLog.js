const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    actionType: {
        type: String,
        required: true,
        enum: [
            'login', 'logout', 'config_change', 
            'alert_update', 'resource_update', 'user_management'
        ]
    },
    description: String,
    ipAddress: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

adminLogSchema.index({ admin: 1 });
adminLogSchema.index({ timestamp: -1 });
adminLogSchema.index({ actionType: 1 });

module.exports = mongoose.model('AdminLog', adminLogSchema);