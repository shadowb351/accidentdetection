const express = require('express');
const router = express.Router();
const emergencyTriggerController = require('../controllers/emergencyTriggerController');

// Get emergency trigger details
router.get('/:triggerId', emergencyTriggerController.handleEmergencyTrigger);

// Cancel emergency
router.post('/:triggerId/cancel', emergencyTriggerController.cancelEmergency);

module.exports = router;