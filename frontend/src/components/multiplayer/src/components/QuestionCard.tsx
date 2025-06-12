import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore'; 
// NUEVO: Importamos el ícono de Usuario
import { Check, X, User } from 'lucide-react';

interface Props {
  socketService: any;
  user: any;
  currentPlayerId: string | null;
  currentPlayerUsername:string | null;
}

export const QuestionCard: React.FC<Props> = ({ socketService, user, currentPlayerId,currentPlayerUsername }) => {
  const {
    currentQuestion,
    selectedAnswer,
    showFeedback,
    selectAnswer,
    // gameStatus,
    correctAnswer,
    answerSelected, // Este es el texto de la respuesta seleccionada por otro jugador
  } = useGameStore();
  // console.log(currentQuestion)
  if (!currentQuestion) return null;

  const handleAnswerClick = (index: number) => {
    // Esta lógica no cambia, sigue funcionando para el jugador actual
    selectAnswer(index); 
    socketService.emit("answerQuestion", { gameCode: sessionStorage.getItem("gameCode"), answerText: currentQuestion.answers[index].text });
  };


  return (
    <AnimatePresence>
      <motion.div
        key={currentQuestion._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        <motion.div
          className="mb-8 text-center p-6 bg-gradient-to-br from-transparent via-indigo-500/5 to-white/7 rounded-2xl border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-white leading-relaxed">
            {currentQuestion.question}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.answers.map((answer, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={user._id !== currentPlayerId}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300 text-left backdrop-blur-sm
                disabled:cursor-not-allowed
                ${answerSelected === answer.text ? 'shadow-[0_0_0_4px_rgba(96,165,250,0.6)] ring-2 ring-blue-400' : ''}
              `}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="w-10 h-10 bg-gray-100 bg-gray-600 rounded-xl flex items-center justify-center text-sm font-bold border border-gray-200 border-gray-500">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-lg font-medium leading-relaxed">{answer.text}</span>
                </div>
                
                {showFeedback && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex-shrink-0"
                  >
                    {answer.text === correctAnswer ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Indicador de la selección del PROPIO jugador */}
              {selectedAnswer === index && (
                <motion.div
                  // className="absolute inset-0 rounded-2xl border-4 border-blue-400 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {answerSelected && answer.text === answerSelected  && (
                <motion.div
                  layoutId="selected-by-other"
                  className="absolute top-2 right-2 flex items-center gap-2 bg-gray-200/60 bg-gray-900/60 backdrop-blur-sm py-1 px-2 rounded-full text-xs pointer-events-none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <User className="w-3.5 h-3.5 text-gray-700 text-white" />
                  <span className="font-semibold text-gray-800 text-white">{currentPlayerUsername?currentPlayerUsername:''}</span>
                </motion.div>
              )}

            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};