const express = require('express');
const router = express.Router();
const navigationController = require('../controllers/navigationController');

// Get route
router.get('/route', navigationController.getRoute);

// Get alternative routes
router.get('/route/alternatives', navigationController.getAlternativeRoutes);

// Get traffic updates
router.get('/route/:routeId/traffic', navigationController.getTrafficUpdates);

module.exports = router;