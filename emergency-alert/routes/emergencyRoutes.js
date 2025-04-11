const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');

// Trigger emergency alert
router.post('/alert', emergencyController.triggerEmergencyAlert);

// Get alert status
router.get('/alert/:alertId', emergencyController.getAlertStatus);

module.exports = router;