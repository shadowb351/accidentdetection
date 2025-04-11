const HospitalService = require('../services/hospitalService');
const ResourceManagementService = require('../services/resourceManagementService');
const AutoAssignmentService = require('../services/autoAssignmentService');

// Update hospital resources
exports.updateResources = async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const { beds, icuBeds, equipment, staff } = req.body;
        
        const updatedResources = await ResourceManagementService.updateHospitalResources(
            hospitalId,
            { beds, icuBeds, equipment, staff }
        );
        
        res.status(200).json({
            message: 'Hospital resources updated successfully',
            resources: updatedResources
        });
    } catch (error) {
        console.error('Error updating hospital resources:', error);
        res.status(500).json({ error: 'Failed to update resources' });
    }
};

// Get hospital dashboard data
exports.getDashboard = async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const dashboardData = await HospitalService.getHospitalDashboard(hospitalId);
        
        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error fetching hospital dashboard:', error);
        res.status(500).json({ error: 'Failed to load dashboard' });
    }
};

// Auto-assign hospital to emergency
exports.autoAssignHospital = async (req, res) => {
    try {
        const { emergencyId, patientCondition } = req.body;
        
        const assignment = await AutoAssignmentService.assignToNearestHospital(
            emergencyId,
            patientCondition
        );
        
        res.status(200).json({
            message: 'Hospital assigned successfully',
            assignment
        });
    } catch (error) {
        console.error('Error auto-assigning hospital:', error);
        res.status(500).json({ error: 'Failed to assign hospital' });
    }
};