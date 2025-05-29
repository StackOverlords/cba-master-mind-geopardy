
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { PlayerCard } from './PlayerCard';
import { Timer } from './Timer';
import { QuestionCard } from './QuestionCard';
import { Countdown } from './Countdown';
import { ThemeToggle } from './ThemeToggle';
import { Clock, RotateCcw, Zap } from 'lucide-react';

export const GameScreen: React.FC = () => {
  const {
    players,
    currentPlayerIndex,
    gameStatus,
    round,
    startCountdown,
    resetGame
  } = useGameStore();

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quick Trivia
              </h1>
            </div>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-700">
              Ronda {round}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-colors duration-200 font-medium border border-red-200 dark:border-red-800 flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Players Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {players.map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              isActive={index === currentPlayerIndex}
            />
          ))}
        </div>

        {/* Game Status */}
        <div className="text-center mb-8">
          {gameStatus === 'playing' && currentPlayer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center space-y-4 p-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm max-w-md mx-auto"
            >
              <Timer />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ¡Tu turno, {currentPlayer.name}!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Responde antes de que se acabe el tiempo
                </p>
              </div>
            </motion.div>
          )}

          {gameStatus === 'answering' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-3 text-gray-500 dark:text-gray-400 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm max-w-xs mx-auto border border-gray-200 dark:border-gray-700"
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium">Siguiente pregunta...</span>
            </motion.div>
          )}
        </div>

        {/* Question */}
        {gameStatus === 'playing' || gameStatus === 'answering' ? (
          <QuestionCard />
        ) : null}
      </div>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {gameStatus === 'countdown' && (
          <Countdown onComplete={startCountdown} />
        )}
      </AnimatePresence>
    </div>
  );
};
