const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

// Get all ambulances
router.get('/ambulances', resourceController.getAllAmbulances);

// Get all hospitals
router.get('/hospitals', resourceController.getAllHospitals);

// Update resource status
router.put('/:resourceId', resourceController.updateResourceStatus);

module.exports = router;