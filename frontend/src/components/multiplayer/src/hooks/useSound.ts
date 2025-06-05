
import { useCallback } from 'react';
// import { Howl } from 'howler';

// Simple sound effects using frequency synthesis
const createBeepSound = (frequency: number, duration: number) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

export const useSound = () => {
  const playCorrect = useCallback(() => {
    createBeepSound(800, 0.3);
    setTimeout(() => createBeepSound(1000, 0.2), 100);
  }, []);

  const playIncorrect = useCallback(() => {
    createBeepSound(200, 0.5);
  }, []);

  const playTick = useCallback(() => {
    createBeepSound(600, 0.1);
  }, []);

  const playCountdown = useCallback(() => {
    createBeepSound(500, 0.2);
  }, []);

  return {
    playCorrect,
    playIncorrect,
    playTick,
    playCountdown
  };
};
