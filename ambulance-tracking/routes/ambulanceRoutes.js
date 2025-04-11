const express = require('express');
const router = express.Router();
const ambulanceController = require('../controllers/ambulanceController');

// Assign ambulance to emergency
router.post('/assign', ambulanceController.assignAmbulance);

// Update ambulance status
router.post('/status', ambulanceController.updateStatus);

// Get ambulance ETA
router.get('/eta', ambulanceController.getETA);

module.exports = router;