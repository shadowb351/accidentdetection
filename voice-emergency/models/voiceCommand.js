import React, { useEffect } from 'react';
import { useEmergency } from '../contexts/EmergencyContext';

const VoiceCommandListener = () => {
  const { detectAccident } = useEmergency();

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      const emergencyKeywords = ['help', 'emergency', 'accident', 'hurt'];
      const detected = emergencyKeywords.some(keyword => 
        transcript.toLowerCase().includes(keyword)
      );

      if (detected) {
        detectAccident();
      }
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [detectAccident]);

  return null;
};

export default VoiceCommandListener;

const mongoose = require('mongoose');

const voiceCommandSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    audioLog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AudioLog',
        required: true
    },
    transcript: String,
    keywords: [String],
    isEmergency: {
        type: Boolean,
        required: true
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1
    },
    processedAt: {
        type: Date,
        default: Date.now
    }
});

voiceCommandSchema.index({ user: 1 });
voiceCommandSchema.index({ isEmergency: 1 });
voiceCommandSchema.index({ processedAt: -1 });

module.exports = mongoose.model('VoiceCommand', voiceCommandSchema);