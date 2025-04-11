const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

// Create incident report
router.post('/:emergencyId/report', incidentController.createIncidentReport);

// Update investigation status
router.put('/report/:reportId/status', incidentController.updateInvestigationStatus);

// Get incident report
router.get('/report/:reportId', incidentController.getIncidentReport);

module.exports = router;