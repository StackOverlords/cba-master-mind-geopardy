
// import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
// import { useGameStore } from '../store/gameStore';
// import { useSound } from '../hooks/useSound';

interface TimerProps {
  timeLeft: number;
  timeInRounds: number;
}
export const Timer: React.FC<TimerProps> = ({ timeLeft, timeInRounds }) => { 
  const percentage = (timeLeft / timeInRounds || 60) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getTimerColor = () => {
    if (timeLeft > 10) return '#10B981'; // Green
    if (timeLeft > 5) return '#F59E0B';  // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div className="relative">
      <motion.div
        className="relative w-20 h-20"
        animate={timeLeft <= 5 ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, repeat: timeLeft <= 5 ? Infinity : 0 }}
      >
        {/* Background circle */}
        <div className="absolute inset-0 w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-lg border-4 border-gray-100 dark:border-gray-700"></div>
        
        <svg className="w-20 h-20 transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-gray-200 dark:text-gray-600"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            stroke={getTimerColor()}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xl font-bold text-gray-900 dark:text-white"
            animate={timeLeft <= 5 ? { color: '#EF4444' } : {}}
          >
            {timeLeft}
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
};
