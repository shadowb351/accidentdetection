const SensorDataProcessor = require('../utils/sensorDataProcessor');

module.exports = {
    // Analyze sensor data to detect accidents
    analyzeSensorData: async (accelerometer, gyroscope, microphone) => {
        try {
            // Check for sudden deceleration (crash impact)
            const impactDetected = SensorDataProcessor.detectImpact(
                accelerometer, 
                gyroscope
            );
            
            // Check for crash sounds (glass breaking, metal crunching)
            const crashSoundsDetected = microphone 
                ? SensorDataProcessor.analyzeAudio(microphone) 
                : false;
            
            // Determine if accident likely occurred
            return impactDetected || crashSoundsDetected;
        } catch (error) {
            console.error('Error analyzing sensor data:', error);
            return false;
        }
    }
};