const VoiceProcessingService = require('../services/voiceProcessingService');
const EmergencyDispatchService = require('../services/emergencyDispatchService');

// Process voice input
exports.processVoiceInput = async (req, res) => {
    try {
        const { userId } = req.params;
        const { audioData, audioFormat } = req.body;
        
        // Validate audio data
        if (!audioData || !audioFormat) {
            return res.status(400).json({ error: 'Missing audio data or format' });
        }
        
        // Process voice input
        const processingResult = await VoiceProcessingService.processAudio(
            userId,
            audioData,
            audioFormat
        );
        
        // Check for emergency keywords
        if (processingResult.emergencyDetected) {
            await EmergencyDispatchService.triggerVoiceEmergency(
                userId,
                processingResult.keywordsFound
            );
        }
        
        res.status(200).json({
            message: 'Voice processing complete',
            ...processingResult
        });
    } catch (error) {
        console.error('Error processing voice input:', error);
        res.status(500).json({ error: 'Failed to process voice input' });
    }
};

// Get voice command history
exports.getVoiceHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const history = await VoiceProcessingService.getVoiceCommandHistory(userId);
        
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching voice history:', error);
        res.status(500).json({ error: 'Failed to fetch voice history' });
    }
};