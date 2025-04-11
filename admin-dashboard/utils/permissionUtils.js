module.exports = {
    validateResourceAccess: (admin, resourceType, action) => {
        const permissionMatrix = {
            superadmin: {
                ambulance: ['create', 'read', 'update', 'delete'],
                hospital: ['create', 'read', 'update', 'delete'],
                user: ['create', 'read', 'update', 'delete'],
                alert: ['create', 'read', 'update', 'delete']
            },
            admin: {
                ambulance: ['read', 'update'],
                hospital: ['read', 'update'],
                user: ['read'],
                alert: ['read', 'update']
            },
            operator: {
                ambulance: ['read'],
                hospital: ['read'],
                user: [],
                alert: ['read', 'update']
            }
        };
        
        return permissionMatrix[admin.role]?.[resourceType]?.includes(action) || false;
    },
    
    checkOwnership: (admin, resource) => {
        // Implementation would check if admin owns or manages the resource
        // For example, regional admins might only manage resources in their region
        return true; // Simplified for example
    }
};