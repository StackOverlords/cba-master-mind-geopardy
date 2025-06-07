
import React from 'react';
import { motion } from 'framer-motion'; 
import { Crown, User } from 'lucide-react';
import type { Player } from '../types/game';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive }) => {
  return (
    <motion.div
      className={`
        relative p-4 rounded-2xl border transition-all duration-300 backdrop-blur-sm
        ${isActive 
          ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20' 
          : 'border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:shadow-md'
        }
      `}
      animate={isActive ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {isActive && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      <div className="flex items-center space-x-3">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-xl border-2
          ${isActive 
            ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600' 
            : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
          }
        `}>
          <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {player?.username || `Jugador ${player.userId}`}
            </h3>
            {player.score > 0 && (
              <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {player.score} puntos
          </p>
        </div>
        
        {isActive && (
          <div className="flex-shrink-0">
            <div className="w-2 h-8 bg-blue-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
