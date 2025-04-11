const express = require('express');
const router = express.Router();
const accidentController = require('../controllers/accidentDetection');

// Process sensor data from mobile app
router.post('/detect', accidentController.processSensorData);

// Cancel emergency countdown
router.post('/cancel', accidentController.cancelEmergency);

module.exports = router;