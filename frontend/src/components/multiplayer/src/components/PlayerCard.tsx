import React from 'react';
import { motion } from 'framer-motion'; 
import { Crown, Zap } from 'lucide-react';
import type { Player } from '../types/game';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive }) => {
  console.log(player)
  return (
    <motion.div
      className={`
        relative p-3 rounded-xl border-2 transition-all duration-300 backdrop-blur-md
        ${isActive 
          ? 'border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-br from-purple-500/10 to-pink-500/10 shadow-lg shadow-purple-500/25' 
          : 'border-slate-200/50 bg-slate-50/80 hover:bg-slate-100/80 hover:shadow-md hover:border-slate-300/50'
        }
      `}
      animate={isActive ? { scale: 1.02, y: -2 } : { scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Active pulse indicator */}
      {isActive && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      
      {/* Glowing border for active player */}
      {isActive && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-sm -z-10" />
      )}
      
      <div className="flex items-center space-x-3">
        {/* Avatar container - more compact */}
        <div className={`
          relative w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all duration-300
          ${isActive 
            ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 shadow-md' 
            : 'bg-slate-100 border-slate-200'
          }
        `}>
          <img className='w-7 h-7 rounded-md' src={player.avatar} alt="avatar" />
          {isActive && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-2 h-2 text-white" />
            </motion.div>
          )}
        </div>
        
        {/* Player info - more compact */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <h3 className={`
              font-bold text-sm truncate transition-colors duration-300
              ${isActive 
                ? 'text-slate-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' 
                : 'text-slate-700'
              }
            `}>
              {player?.username || `Player ${player.userId}`}
            </h3>
            {player.score > 0 && (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-3 h-3 text-amber-500 flex-shrink-0" />
              </motion.div>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <span className={`
              text-xs font-semibold transition-colors duration-300
              ${isActive 
                ? 'text-purple-600' 
                : 'text-slate-500'
              }
            `}>
              {player.score}
            </span>
            <span className="text-xs text-slate-400">pts</span>
          </div>
        </div>
        
        {/* Active indicator - sleeker design */}
        {isActive && (
          <motion.div
            className="flex-shrink-0"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="w-1.5 h-6 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full shadow-lg" />
          </motion.div>
        )}
      </div>
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
    </motion.div>
  );
};
export default PlayerCard;