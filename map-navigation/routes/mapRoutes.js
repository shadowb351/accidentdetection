const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

// Get map markers
router.get('/:userId/markers', mapController.getMapMarkers);

// Get offline map tiles
router.get('/offline-tiles', mapController.getOfflineTiles);

// Update marker position
router.put('/markers/:markerId', mapController.updateMarkerPosition);

module.exports = router;