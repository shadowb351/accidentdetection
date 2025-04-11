const SpeechRecognitionUtils = require('../utils/speechRecognitionUtils');
const EmergencyTrigger = require('../models/emergencyTrigger');

// Keywords to detect (can be expanded)
const EMERGENCY_KEYWORDS = [
    'help', 'emergency', 'accident', 'hurt', 'pain',
    'ambulance', 'police', 'fire', 'danger', 'urgent'
];

module.exports = {
    detectEmergencyKeywords: async (audioData) => {
        try {
            // Convert audio to text
            const transcript = await SpeechRecognitionUtils.transcribeAudio(audioData);
            
            // Analyze for emergency keywords
            const keywordsFound = [];
            let emergencyDetected = false;
            
            const words = transcript.toLowerCase().split(/\s+/);
            for (const word of words) {
                if (EMERGENCY_KEYWORDS.includes(word)) {
                    keywordsFound.push(word);
                    emergencyDetected = true;
                }
            }
            
            // Calculate confidence score
            const confidence = this.calculateConfidence(keywordsFound, words.length);
            
            return {
                transcript,
                keywordsFound,
                emergencyDetected,
                confidence
            };
        } catch (error) {
            console.error('Error detecting keywords:', error);
            throw error;
        }
    },
    
    calculateConfidence: (keywords, totalWords) => {
        if (totalWords === 0) return 0;
        
        // More keywords = higher confidence
        const keywordRatio = keywords.length / totalWords;
        
        // Certain keywords have higher weight
        const weightedKeywords = keywords.map(k => 
            ['help', 'emergency'].includes(k) ? 1.5 : 1
        );
        const weightSum = weightedKeywords.reduce((a, b) => a + b, 0);
        
        return Math.min(1, (weightSum * keywordRatio) * 0.8 + (keywords.length > 0 ? 0.2 : 0));
    },
    
    updateKeywordList: (newKeywords) => {
        EMERGENCY_KEYWORDS.push(...newKeywords);
        return EMERGENCY_KEYWORDS;
    }
};