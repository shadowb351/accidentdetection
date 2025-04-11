const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get dashboard overview
router.get('/:adminId/overview', adminController.getDashboardOverview);

// Get system analytics
router.get('/analytics', adminController.getSystemAnalytics);

// Update dashboard configuration
router.put('/:adminId/config', adminController.updateDashboardConfig);

module.exports = router;