const mongoose = require('mongoose');

const adminAlertSchema = new mongoose.Schema({
    emergency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emergency',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [
            'new', 'status_change', 'assignment', 
            'resource_update', 'note', 'system'
        ]
    },
    message: {
        type: String,
        required: true
    },
    notes: String,
    read: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

adminAlertSchema.index({ emergency: 1 });
adminAlertSchema.index({ read: 1 });
adminAlertSchema.index({ createdAt: -1 });
adminAlertSchema.index({ priority: 1 });

module.exports = mongoose.model('AdminAlert', adminAlertSchema);