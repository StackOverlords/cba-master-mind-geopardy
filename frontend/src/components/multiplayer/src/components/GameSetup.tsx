
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { Users, Play, X } from 'lucide-react';

export const GameSetup: React.FC = () => {
  const [players, setPlayers] = useState(['', '']);
  const { initializeGame } = useGameStore();

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const startGame = () => {
    const validPlayers = players.filter(name => name.trim() !== '');
    if (validPlayers.length >= 2) {
      initializeGame(validPlayers);
    }
  };

  const canStart = players.filter(name => name.trim() !== '').length >= 2;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Trivia
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Configura los jugadores para comenzar
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {players.map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <input
                type="text"
                placeholder={`Jugador ${index + 1}`}
                value={player}
                onChange={(e) => updatePlayer(index, e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
              />
              {players.length > 2 && (
                <button
                  onClick={() => removePlayer(index)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200 flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="space-y-3">
          {players.length < 4 && (
            <button
              onClick={addPlayer}
              className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all duration-200 font-medium"
            >
              + Agregar jugador
            </button>
          )}

          <motion.button
            onClick={startGame}
            disabled={!canStart}
            className={`
              w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2
              ${canStart
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }
            `}
            whileHover={canStart ? { scale: 1.02 } : {}}
            whileTap={canStart ? { scale: 0.98 } : {}}
          >
            <Play className="w-5 h-5" />
            <span>{canStart ? 'Comenzar Juego' : 'Mínimo 2 jugadores'}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
