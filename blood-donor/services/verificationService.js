const Donor = require('../models/donor');

module.exports = {
    verifyDonorEligibility: async (donorId) => {
        try {
            const donor = await Donor.findById(donorId);
            if (!donor) throw new Error('Donor not found');
            
            // Basic eligibility checks (in real app would be more comprehensive)
            const ageValid = this.checkAge(donor.dateOfBirth);
            const weightValid = donor.weight >= 50; // 50kg minimum
            const healthValid = this.checkHealthConditions(donor.healthConditions);
            
            const eligible = ageValid && weightValid && healthValid;
            
            // Update donor record
            donor.eligible = eligible;
            donor.verificationStatus = eligible ? 'verified' : 'rejected';
            donor.verificationDate = new Date();
            await donor.save();
            
            return {
                donorId,
                eligible,
                reasons: !eligible ? [
                    ...(!ageValid ? ['Age requirements not met'] : []),
                    ...(!weightValid ? ['Weight below minimum'] : []),
                    ...(!healthValid ? ['Health conditions make ineligible'] : [])
                ] : [],
                verificationDate: donor.verificationDate
            };
        } catch (error) {
            console.error('Error verifying donor:', error);
            throw error;
        }
    },
    
    checkAge: (dateOfBirth) => {
        if (!dateOfBirth) return false;
        
        const ageDiff = Date.now() - new Date(dateOfBirth).getTime();
        const ageDate = new Date(ageDiff);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        
        return age >= 18 && age <= 65;
    },
    
    checkHealthConditions: (conditions) => {
        if (!conditions || conditions.length === 0) return true;
        
        // In real app, would check against list of disqualifying conditions
        const disqualifyingConditions = [
            'hiv', 'aids', 'hepatitis b', 'hepatitis c', 'ebola'
        ];
        
        return !conditions.some(condition => 
            disqualifyingConditions.includes(condition.toLowerCase())
        );
    },
    
    scheduleRegularVerification: async () => {
        // Implementation would periodically re-verify all donors
    }
};