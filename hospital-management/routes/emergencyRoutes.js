const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

// Auto-assign hospital to emergency
router.post('/assign-hospital', hospitalController.autoAssignHospital);

module.exports = router;