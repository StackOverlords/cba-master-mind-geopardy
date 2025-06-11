import { useCallback } from 'react';
import { Howl } from 'howler';
import soundCountdown from '../../../../assets/sounds/tick.wav'; // Sonido normal
import soundCountdownEnd from '../../../../assets/sounds/ticktak.wav'; // Sonido de contador finalizando
import soundCorrect from '../../../../assets/sounds/mixkit-correct-answer-reward-952.wav'; // Sonido de respuesta correcta
import soundIncorrect from '../../../../assets/sounds/mixkit-wrong-answer-fail-notification-946.wav'; // Sonido de respuesta incorrecta

// Precargar los sonidos con Howler.js
const sounds = {
  countdown: new Howl({ src: [soundCountdown], volume: 0.7 }),
  countdownEnd: new Howl({ src: [soundCountdownEnd], volume: 0.7 }),
  correct: new Howl({ src: [soundCorrect], volume: 0.7 }),
  incorrect: new Howl({ src: [soundIncorrect], volume: 0.7 }),
};

export const useSound = () => {
  const playCorrect = useCallback(() => {
    sounds.correct.play();
  }, []);

  const playIncorrect = useCallback(() => {
    sounds.incorrect.play();
  }, []);

  const playTick = useCallback(() => {
    sounds.countdown.play();
  }, []);

  const playCountdown = useCallback(() => {
    sounds.countdownEnd.play();
  }, []);

  return {
    playCorrect,
    playIncorrect,
    playTick,
    playCountdown,
  };
};