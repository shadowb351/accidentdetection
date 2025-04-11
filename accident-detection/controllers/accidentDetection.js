const SensorService = require('../services/sensorService');
const AlertService = require('../services/alertService');
const CountdownService = require('../services/countdownService');

// Process incoming sensor data
exports.processSensorData = async (req, res) => {
    try {
        const { userId, accelerometer, gyroscope, microphone, location } = req.body;
        
        // Validate sensor data
        if (!userId || !accelerometer || !gyroscope || !location) {
            return res.status(400).json({ error: 'Missing required sensor data' });
        }

        // Detect potential accident
        const isAccident = await SensorService.analyzeSensorData(
            accelerometer, 
            gyroscope, 
            microphone
        );

        if (isAccident) {
            // Start emergency countdown
            const countdownResult = await CountdownService.startCountdown(userId, 10); // 10 seconds
            
            return res.status(202).json({
                message: 'Potential accident detected',
                countdownStarted: true,
                countdownId: countdownResult.countdownId
            });
        }

        res.status(200).json({ message: 'No accident detected' });
    } catch (error) {
        console.error('Error processing sensor data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Handle countdown cancellation
exports.cancelEmergency = async (req, res) => {
    try {
        const { userId, countdownId } = req.body;
        
        const success = await CountdownService.cancelCountdown(userId, countdownId);
        
        if (success) {
            return res.status(200).json({ message: 'Emergency cancelled successfully' });
        }
        
        res.status(404).json({ error: 'Countdown not found or already expired' });
    } catch (error) {
        console.error('Error cancelling emergency:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};