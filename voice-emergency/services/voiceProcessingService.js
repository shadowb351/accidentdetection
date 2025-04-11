const VoiceCommand = require('../models/voiceCommand');
const AudioLog = require('../models/audioLog');
const KeywordDetectionService = require('./keywordDetectionService');
const AudioUtils = require('../utils/audioUtils');

module.exports = {
    processAudio: async (userId, audioData, audioFormat) => {
        try {
            // Convert and normalize audio
            const processedAudio = AudioUtils.processAudioData(audioData, audioFormat);
            
            // Save audio log
            const audioLog = new AudioLog({
                user: userId,
                audioData: processedAudio.normalized,
                format: 'wav', // converted to standard format
                length: processedAudio.duration
            });
            await audioLog.save();
            
            // Detect keywords
            const detectionResult = await KeywordDetectionService.detectEmergencyKeywords(
                processedAudio.normalized
            );
            
            // Save voice command record
            const voiceCommand = new VoiceCommand({
                user: userId,
                audioLog: audioLog._id,
                transcript: detectionResult.transcript,
                keywords: detectionResult.keywordsFound,
                isEmergency: detectionResult.emergencyDetected,
                processedAt: new Date()
            });
            await voiceCommand.save();
            
            return {
                audioId: audioLog._id,
                commandId: voiceCommand._id,
                transcript: detectionResult.transcript,
                keywordsFound: detectionResult.keywordsFound,
                emergencyDetected: detectionResult.emergencyDetected,
                confidence: detectionResult.confidence
            };
        } catch (error) {
            console.error('Error in voice processing service:', error);
            throw error;
        }
    },
    
    getVoiceCommandHistory: async (userId) => {
        try {
            return await VoiceCommand.find({ user: userId })
                .sort({ processedAt: -1 })
                .limit(50)
                .populate('audioLog');
        } catch (error) {
            console.error('Error fetching voice history:', error);
            throw error;
        }
    },
    
    startBackgroundListening: (userId) => {
        // Implementation would start continuous audio monitoring
        // This would interface with mobile SDKs
    },
    
    stopBackgroundListening: (userId) => {
        // Implementation would stop audio monitoring
    }
};