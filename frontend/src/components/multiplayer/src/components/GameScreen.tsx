import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { PlayerCard } from "./PlayerCard";
import { Timer } from "./Timer";
import { QuestionCard } from "./QuestionCard";
// import { ThemeToggle } from "./ThemeToggle";
import { Clock } from "lucide-react";
import { socketService } from "../../../../services/socketService";
import { useSound } from "../hooks/useSound";
import { FinalResults } from "./FinalResults";
import { Leaderboard } from "./ui/leaderBoard";

interface GameScreenProps {
  user: any;
  code: any;
}
export const GameScreen: React.FC<GameScreenProps> = ({ user, code }) => {
  const {
    players,
    gameStatus,
    // round,
    startCountdown,
    inTurn,
    // timeLeft,
    resetGame,
    nextQuestion,
    currentQuestion,
    defaultTurnTimeSet,
    timeInRounds,
    selectCorrectAnswer,
    initializeGame,
    setShowFeedback,
    finalResults,
    setFinalScore,
    setAnswerSelected,
    // selectAnswer,
    setTimerGameOut,
  } = useGameStore();
  const [currentPlayerId, setCurrentPlayerId] = React.useState<string | null>(
    null
  );
  const [currentPlayerUsername, setCurrentPlayerUsername] = React.useState<
    string | null
  >("");

  const [timer, setTimer] = React.useState<number>(0);

  const [currentRound, setCurrentRound] = React.useState<number>(1);

  const { playCorrect, playIncorrect, playTick, playCountdown } = useSound();

  const [pointsByRound, setPointsByRound] = React.useState<number>(100);
  const [rounds, setRounds] = React.useState<number>(0);
  useEffect(() => {
    if (user?._id && code) {
      socketService.connect(user._id);

      socketService.emit("getGameState", code);
      socketService.on("gameState", (data: any) => {
        console.log("Game state received:", data);
        const { defaultTurnTime, rounds } = data;
        setRounds(rounds);
        defaultTurnTimeSet(defaultTurnTime);
      });

      socketService.on("gamePlayers", (playersJoined: any) => {
        console.log("Players joined event received:", playersJoined);
        initializeGame(playersJoined);
      });

      socketService.on("newTurn", (data: any) => {
        const { currentPlayerId, currentPlayerUsername, timer } = data;
        setCurrentPlayerId(currentPlayerId);
        setTimer(timer);
        setCurrentPlayerUsername(currentPlayerUsername);
        setShowFeedback(false);
        nextQuestion(data.question);
      });

      // Actualizar el estado del juego cuando se recibe una nueva pregunta
      socketService.on("updateTimerOut", (timerLeft: any) => {
        // playCountdown();
        console.log("Timer update received:", timerLeft);
        startCountdown(timerLeft);
        // nextQuestion({});
      });

      // Actualizar el estado de espera a responder
      socketService.on("updateTimer", (timer: any) => {
        if(timer <= 5) {
          playCountdown();
        }else{
          playTick();
        }
        inTurn();
        setTimer(timer);
        if (timer <= 0) {
          console.log("Timer finished, resetting game");
          resetGame();
        }
      });

      // Mostrar la respuesta correcta y el feedback
      socketService.on("answerResult", (data: any) => {
        const { isCorrect, correctAnswer, players, answerSelected } = data;
        setAnswerSelected(answerSelected);
        selectCorrectAnswer(correctAnswer);
        setShowFeedback(true);
        initializeGame(players);
        if (isCorrect) {
          console.log("Correct answer!");
          playCorrect();
        } else {
          console.log("Incorrect answer.");
          playIncorrect();
        }
      });

      // Finalizar el juego y mostrar resultados
      socketService.on("gameOver", (data: any) => {
        console.log("Game over evento received:", data);
        setFinalScore(data);
      });

      // Cuando la ronda termina, actualiza el estado del juego
      socketService.on("roundFinished", (currentRound: any) => {
        console.log("Round finished:", currentRound);
        // Aquí podrías actualizar el estado del juego para reflejar el fin de la ronda
        setCurrentRound(currentRound.currentRound);
      });

      // Contador antes de devolver a los jugadores a la pantalla de inicio
      socketService.on("updateTimerOutGame", (timeLeft: any) => {
        console.log("updated timer out game received:", timeLeft);
        setTimerGameOut(timeLeft);
      });

      // Redirigir a los jugadores a la pantalla de inicio después de un tiempo
      socketService.on("redirectToHome", (data: any) => {
        console.log("Game timeout, redirecting to home", data);
        sessionStorage.removeItem("gameCode");
        socketService.disconnect();
        window.location.href = "/";
      });

      // Actualizar los puntajes
      socketService.on("updatePointsShow", (points: number) => {
        setPointsByRound(points);
      });
    }
  }, []);
  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="sticky bg-transparent backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <h2 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-PressStart2P text-lg font-extrabold">
                    MASTER MIND
                  </h2>
                </div>
              </div>
              <span className="px-4 py-1 text-white rounded-lg text-base border border-[0.2px] border-white shadow-sm">
                Round {currentRound}/{rounds}
              </span>
              <span className="px-4 py-1 text-white rounded-lg text-base border border-[0.2px] border-white shadow-sm">
                Remaining points: {pointsByRound}
              </span>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col items-center space-y-4">
            {/* Title centered */}
            <div className="flex items-center">
              <h2 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-PressStart2P text-base font-extrabold text-center">
                MASTER MIND
              </h2>
            </div>

            {/* Stats below in row or stacked based on screen size */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="px-3 py-1 text-white rounded-lg text-sm border border-[0.2px] border-white shadow-sm text-center">
                Round {currentRound}/{rounds}
              </span>
              <span className="px-3 py-1 text-white rounded-lg text-sm border border-[0.2px] border-white shadow-sm text-center">
                Points: {pointsByRound}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Players grid - more compact and responsive */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 mb-6">
          {players.map((player, index) => (
            <PlayerCard
              key={player.userId}
              player={player}
              isActive={
                index === players.findIndex((p) => p.userId === currentPlayerId)
              }
            />
          ))}
        </div>
        <div className="text-center mb-6">
          {gameStatus === "playing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center space-y-3 md:space-y-4 p-4 md:p-6 bg-gradient-to-br from-purple-50/95 to-pink-50/95 rounded-2xl border border-purple-200/50 backdrop-blur-xl max-w-sm md:max-w-lg mx-auto shadow-xl shadow-purple-500/10"
            >
              <Timer timeLeft={timer} timeInRounds={timeInRounds} />
              <div className="text-center">
                <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 bg-clip-text text-transparent leading-tight">
                  {currentPlayerId === user._id
                    ? `¡Es tu turno, ${currentPlayerUsername}!`
                    : `Turno de ${currentPlayerUsername}`}
                </h2>
                <p className="text-purple-600/80 text-xs md:text-sm mt-1 font-semibold px-2">
                  {currentPlayerId === user._id
                    ? "Selecciona la respuesta correcta"
                    : "Esperando que el jugador responda..."}
                </p>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-75"></div>
            </motion.div>
          )}
          {gameStatus === "countdown" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center space-y-3 text-indigo-700 p-4 md:p-5 bg-gradient-to-br from-indigo-50/95 to-purple-50/95 rounded-2xl backdrop-blur-xl max-w-xs md:max-w-sm mx-auto border border-indigo-200/60 shadow-xl shadow-indigo-500/15"
            >
              {/* Timer Display */}
              <div className="flex items-center justify-center">
                <motion.div
                  className="relative w-16 h-16 md:w-20 md:h-20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-200/40"></div>
                  
                  {/* Progress ring - you can map your countdown here */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                  
                  {/* Center content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Clock className="w-6 h-6 md:w-7 md:h-7 text-indigo-600" />
                    </motion.div>
                  </div>
                  
                  {/* Timer number - map your countdown value here */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"> 
                  </div>
                </motion.div>
              </div>

              {/* Status text */}
              <div className="text-center">
                <span className="font-bold text-sm md:text-base bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
                  Siguiente pregunta...
                </span>
                <p className="text-xs text-indigo-500/80 mt-1">
                  Preparándose para continuar
                </p>
              </div>

              {/* Decorative dots */}
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Question card section */}
        {currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <QuestionCard
              socketService={socketService}
              user={user}
              currentPlayerId={currentPlayerId}
              currentPlayerUsername={currentPlayerUsername}
            />
          </motion.div>
        )}
      </div>
      {gameStatus === "finished" && (
        <AnimatePresence>
          <FinalResults>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Leaderboard data={finalResults} />
            </motion.div>
          </FinalResults>
        </AnimatePresence>
      )}
    </div>
  );
};
