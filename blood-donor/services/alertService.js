const BloodRequest = require('../models/bloodRequest');
const Donor = require('../models/donor');
const Hospital = require('../models/hospital');
const { sendPushNotification } = require('./notificationService');

module.exports = {
    createBloodRequest: async (hospitalId, patientId, bloodGroup, unitsNeeded, urgency, matchingDonors) => {
        try {
            const hospital = await Hospital.findById(hospitalId);
            if (!hospital) throw new Error('Hospital not found');
            
            const bloodRequest = new BloodRequest({
                hospital: hospitalId,
                patient: patientId,
                bloodGroup,
                unitsNeeded,
                urgency,
                requestedAt: new Date(),
                status: 'active',
                potentialDonors: matchingDonors.map(d => d._id),
                location: hospital.location
            });
            
            await bloodRequest.save();
            return bloodRequest;
        } catch (error) {
            console.error('Error creating blood request:', error);
            throw error;
        }
    },
    
    notifyDonors: async (donors, requestId) => {
        try {
            const notificationPromises = donors.map(donor => {
                return sendPushNotification(
                    donor.user,
                    'Blood Donation Request',
                    `Urgent need for ${donor.bloodGroup} blood. Can you help?`,
                    { requestId, type: 'blood_request' }
                );
            });
            
            await Promise.all(notificationPromises);
            
            // Update donor records with active request
            await Donor.updateMany(
                { _id: { $in: donors.map(d => d._id) } },
                { $push: { activeRequests: requestId } }
            );
            
            return true;
        } catch (error) {
            console.error('Error notifying donors:', error);
            throw error;
        }
    },
    
    recordDonorResponse: async (requestId, donorId, response) => {
        try {
            const bloodRequest = await BloodRequest.findById(requestId);
            if (!bloodRequest) throw new Error('Blood request not found');
            
            const donor = await Donor.findById(donorId);
            if (!donor) throw new Error('Donor not found');
            
            // Update blood request with donor response
            const responseIndex = bloodRequest.potentialDonors.findIndex(d => d.equals(donorId));
            if (responseIndex === -1) throw new Error('Donor not in request');
            
            bloodRequest.donorResponses.push({
                donor: donorId,
                response,
                respondedAt: new Date()
            });
            
            if (response === 'accepted') {
                bloodRequest.acceptedDonors.push(donorId);
                
                // Check if request is fulfilled
                if (bloodRequest.acceptedDonors.length >= bloodRequest.unitsNeeded) {
                    bloodRequest.status = 'fulfilled';
                }
            }
            
            await bloodRequest.save();
            
            // Update donor record
            await Donor.findByIdAndUpdate(donorId, {
                $pull: { activeRequests: requestId },
                $push: { requestHistory: {
                    request: requestId,
                    response,
                    date: new Date()
                } }
            });
            
            return bloodRequest;
        } catch (error) {
            console.error('Error recording donor response:', error);
            throw error;
        }
    },
    
    coordinateDonation: async (requestId, donorId, method) => {
        try {
            const bloodRequest = await BloodRequest.findById(requestId)
                .populate('hospital');
            if (!bloodRequest) throw new Error('Blood request not found');
            
            const donor = await Donor.findById(donorId);
            if (!donor) throw new Error('Donor not found');
            
            // Create donation record
            const donation = new Donation({
                request: requestId,
                donor: donorId,
                hospital: bloodRequest.hospital._id,
                method,
                status: method === 'pickup' ? 'pickup_scheduled' : 'donor_en_route',
                bloodGroup: donor.bloodGroup,
                scheduledAt: new Date(Date.now() + 3600000) // 1 hour from now
            });
            
            await donation.save();
            
            // Update blood request
            bloodRequest.coordinatedDonations.push(donation._id);
            await bloodRequest.save();
            
            // Update donor record
            donor.lastDonationDate = new Date();
            donor.totalDonations += 1;
            await donor.save();
            
            // Send appropriate notifications
            if (method === 'pickup') {
                await this.notifyHospitalStaff(bloodRequest.hospital._id, donation._id);
            }
            
            return {
                donation,
                nextSteps: method === 'pickup' ? 
                    'Ambulance will be dispatched for pickup' :
                    'Please proceed to the hospital'
            };
        } catch (error) {
            console.error('Error coordinating donation:', error);
            throw error;
        }
    },
    
    notifyHospitalStaff: async (hospitalId, donationId) => {
        // Implementation would notify hospital staff about incoming donation
    }
};