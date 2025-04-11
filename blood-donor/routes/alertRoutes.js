const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// Request blood donors
router.post('/request/:hospitalId/:patientId', alertController.requestDonors);

// Handle donor response
router.post('/response/:requestId/:donorId', alertController.handleDonorResponse);

// Coordinate donation
router.post('/coordinate/:requestId/:donorId', alertController.coordinateDonation);

module.exports = router;