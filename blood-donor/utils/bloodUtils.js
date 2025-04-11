module.exports = {
    isValidBloodGroup: (bloodGroup) => {
        const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        return validGroups.includes(bloodGroup);
    },
    
    getCompatibleBloodGroups: (recipientGroup) => {
        const compatibilityMap = {
            'A+': ['A+', 'A-', 'O+', 'O-'],
            'A-': ['A-', 'O-'],
            'B+': ['B+', 'B-', 'O+', 'O-'],
            'B-': ['B-', 'O-'],
            'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            'AB-': ['A-', 'B-', 'AB-', 'O-'],
            'O+': ['O+', 'O-'],
            'O-': ['O-']
        };
        
        return compatibilityMap[recipientGroup] || [];
    },
    
    isCompatible: (donorGroup, recipientGroup) => {
        return this.getCompatibleBloodGroups(recipientGroup).includes(donorGroup);
    }
};