const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');

// Process voice input
router.post('/:userId/process', voiceController.processVoiceInput);

// Get voice command history
router.get('/:userId/history', voiceController.getVoiceHistory);

module.exports = router;