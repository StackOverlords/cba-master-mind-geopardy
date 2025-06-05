
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useSound } from '../hooks/useSound';
import { Check, X } from 'lucide-react';
// import { Check, X } from 'lucide-react';
interface Props {
  socketService: any;
  user: any;
  currentPlayerId:string | null;
}

export const QuestionCard: React.FC<Props> = ({ socketService, user,currentPlayerId }) => {
  const {
    currentQuestion,
    selectedAnswer,
    showFeedback,
    selectAnswer,
    gameStatus,
    correctAnswer,
  } = useGameStore();

  if (!currentQuestion) return null;

  const handleAnswerClick = (index: number) => {
    // if (gameStatus !== 'playing' || selectedAnswer !== null) return;
    selectAnswer(index);
    // showFeedback(true);
    // if (index === currentQuestion.answers.findIndex(a => a.isCorrect)) {
    //   playCorrect();
    // } else {
    //   playIncorrect();
    // }
    socketService.emit("answerQuestion",{ gameCode:sessionStorage.getItem("gameCode"), answerText: currentQuestion.answers[index].text });
  };

  const getOptionStyle = (index: number) => {
    if (!showFeedback) {
      return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:scale-[1.02] shadow-sm hover:shadow-md';
    }
    
    if (index === currentQuestion.answers.findIndex(a => a.isCorrect)) {
      if (index === selectedAnswer) {
        return 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-200 shadow-md';
      }
    }
    
    if (index === selectedAnswer && index !== currentQuestion.answers.findIndex(a => a.isCorrect)) {
      if (gameStatus === 'playing') {
        return 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-200 shadow-md hover:scale-[1.02] hover:shadow-lg';
      }
      // If the game is not in playing status, we show a disabled style
      return 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-200 shadow-md';
    }
    
    return 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 opacity-60';
  };
  // console.log("correctAnswer", correctAnswer);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentQuestion._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        <motion.div
          className="mb-8 text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-relaxed">
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
                ${getOptionStyle(index)}
                disabled:cursor-not-allowed
              `}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={gameStatus === 'playing' && selectedAnswer === null ? { scale: 1.02 } : {}}
              whileTap={gameStatus === 'playing' && selectedAnswer === null ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-xl flex items-center justify-center text-sm font-bold border border-gray-200 dark:border-gray-500">
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
                    { answer.text === correctAnswer ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    ) : answer.text!==correctAnswer ? (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="w-5 h-5 text-white" />
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </div>

              {selectedAnswer === index && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-4 border-blue-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
