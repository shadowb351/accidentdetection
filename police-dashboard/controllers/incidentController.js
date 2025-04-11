const IncidentService = require('../services/incidentService');

// Create incident report
exports.createIncidentReport = async (req, res) => {
    try {
        const { emergencyId } = req.params;
        const reportData = req.body;
        
        const report = await IncidentService.createIncidentReport(emergencyId, reportData);
        
        res.status(201).json({
            message: 'Incident report created successfully',
            report
        });
    } catch (error) {
        console.error('Error creating incident report:', error);
        res.status(500).json({ error: 'Failed to create report' });
    }
};

// Update investigation status
exports.updateInvestigationStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status, notes } = req.body;
        
        const updatedReport = await IncidentService.updateInvestigationStatus(
            reportId,
            status,
            notes
        );
        
        res.status(200).json({
            message: 'Investigation status updated',
            report: updatedReport
        });
    } catch (error) {
        console.error('Error updating investigation status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
};

// Get incident report
exports.getIncidentReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await IncidentService.getIncidentReport(reportId);
        
        res.status(200).json(report);
    } catch (error) {
        console.error('Error fetching incident report:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
};