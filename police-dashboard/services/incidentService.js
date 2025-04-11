const IncidentReport = require('../models/incidentReport');
const Emergency = require('../models/emergency');

module.exports = {
    createIncidentReport: async (emergencyId, reportData) => {
        try {
            const emergency = await Emergency.findById(emergencyId);
            if (!emergency) throw new Error('Emergency not found');
            
            const report = new IncidentReport({
                emergency: emergencyId,
                location: emergency.location,
                reportedBy: reportData.officerId,
                initialObservations: reportData.observations,
                status: 'under_investigation',
                severity: reportData.severity || 'medium',
                partiesInvolved: reportData.partiesInvolved || []
            });
            
            await report.save();
            
            // Update emergency with report reference
            emergency.incidentReport = report._id;
            await emergency.save();
            
            return report;
        } catch (error) {
            console.error('Error creating incident report:', error);
            throw error;
        }
    },
    
    updateInvestigationStatus: async (reportId, status, notes) => {
        try {
            const report = await IncidentReport.findByIdAndUpdate(
                reportId,
                { 
                    status,
                    $push: { 
                        investigationLogs: {
                            status,
                            notes,
                            updatedAt: new Date()
                        } 
                    } 
                },
                { new: true }
            );
            
            return report;
        } catch (error) {
            console.error('Error updating investigation status:', error);
            throw error;
        }
    },
    
    getIncidentReport: async (reportId) => {
        try {
            return await IncidentReport.findById(reportId)
                .populate('emergency')
                .populate('reportedBy', 'name badgeNumber');
        } catch (error) {
            console.error('Error fetching incident report:', error);
            throw error;
        }
    }
};