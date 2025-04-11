const express = require('express');
const router = express.Router();
const emergencyAccessController = require('../controllers/emergencyAccessController');

// Access profile via QR/NFC
router.get('/access/:token', emergencyAccessController.accessProfile);

// Log emergency access
router.post('/:userId/log-access', emergencyAccessController.logAccess);

module.exports = router;