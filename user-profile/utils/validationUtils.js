module.exports = {
    isValidBloodGroup: (bloodGroup) => {
        const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        return validGroups.includes(bloodGroup);
    },
    
    isValidPhoneNumber: (phone) => {
        // Simple validation - would use library like libphonenumber in production
        return /^\+?[\d\s-]{10,}$/.test(phone);
    },
    
    validateMedicalConditions: (conditions) => {
        // Could validate against a medical ontology in production
        return conditions.every(cond => typeof cond === 'string' && cond.length > 0);
    }
};