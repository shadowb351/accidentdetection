const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// Get all alerts
router.get('/', alertController.getAllAlerts);

// Get alert details
router.get('/:alertId', alertController.getAlertDetails);

// Update alert status
router.put('/:alertId/status', alertController.updateAlertStatus);

module.exports = router;