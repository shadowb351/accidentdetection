const express = require('express');
const router = express.Router();
const policeController = require('../controllers/policeController');

// Get active emergencies
router.get('/:stationId/emergencies', policeController.getActiveEmergencies);

// Track ambulance
router.get('/track-ambulance/:ambulanceId', policeController.trackAmbulance);

// Get police dashboard
router.get('/:stationId/dashboard', policeController.getDashboard);

module.exports = router;