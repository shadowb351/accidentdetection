const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Update user profile
router.put('/:userId', profileController.updateProfile);

// Get user profile
router.get('/:userId', profileController.getProfile);

// Generate emergency QR code
router.post('/:userId/qr-code', profileController.generateQRCode);

module.exports = router;