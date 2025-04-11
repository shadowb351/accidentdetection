module.exports = {
    getTimeFilter: (timeRange) => {
        const now = new Date();
        let startDate;
        
        switch (timeRange) {
            case '24h':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'all':
                return {};
            default:
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        }
        
        return { createdAt: { $gte: startDate } };
    },
    
    checkAdminPermissions: (admin, requiredPermission) => {
        const permissions = {
            superadmin: ['all'],
            admin: ['view', 'manage_alerts', 'manage_resources'],
            operator: ['view', 'manage_alerts']
        };
        
        return permissions[admin.role]?.includes(requiredPermission) || 
               permissions[admin.role]?.includes('all');
    },
    
    formatLocation: (location) => {
        if (!location || !location.coordinates) return 'Unknown';
        
        const [longitude, latitude] = location.coordinates;
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
};