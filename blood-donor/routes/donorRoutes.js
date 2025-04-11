const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

// Register/update donor profile
router.put('/:userId', donorController.registerDonor);

// Verify donor eligibility
router.get('/:donorId/verify', donorController.verifyDonor);

// Get donor status
router.get('/:donorId/status', donorController.getDonorStatus);

module.exports = router;