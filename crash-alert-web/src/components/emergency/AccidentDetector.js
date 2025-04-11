import React, { useEffect, useState } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { Button, Alert } from '@mui/material';
import Countdown from './Countdown';

const AccidentDetector = () => {
  const { detectAccident, cancelEmergency } = useEmergency();
  const [impactDetected, setImpactDetected] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);

  useEffect(() => {
    const setupSensors = async () => {
      if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', handleMotion);
      }
      
      if (navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setupAudioAnalysis(stream);
      }
    };

    setupSensors();
    
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  const handleMotion = (event) => {
    const acceleration = event.acceleration;
    const impact = calculateImpact(acceleration);
    
    if (impact > 3.5 && !impactDetected) { // Threshold for crash detection
      setImpactDetected(true);
      triggerEmergencyCountdown();
    }
  };

  const triggerEmergencyCountdown = () => {
    setCountdownActive(true);
    setTimeout(() => {
      if (countdownActive) {
        detectAccident(); // Automatically trigger emergency if no cancel
      }
    }, 10000); // 10 second countdown
  };

  const handleCancel = () => {
    setCountdownActive(false);
    cancelEmergency();
  };

  return (
    <div className="emergency-detector">
      {countdownActive && (
        <div className="emergency-countdown">
          <Alert severity="warning">
            <Countdown seconds={10} onComplete={detectAccident} />
            <p>Emergency alert will be sent in 10 seconds</p>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleCancel}
            >
              Cancel Emergency
            </Button>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default AccidentDetector;