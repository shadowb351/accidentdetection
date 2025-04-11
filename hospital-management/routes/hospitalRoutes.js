const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

// Update hospital resources
router.put('/:hospitalId/resources', hospitalController.updateResources);

// Get hospital dashboard
router.get('/:hospitalId/dashboard', hospitalController.getDashboard);

module.exports = router;