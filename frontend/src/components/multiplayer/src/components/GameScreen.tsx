import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { PlayerCard } from "./PlayerCard";
import { Timer } from "./Timer";
import { QuestionCard } from "./QuestionCard";
import { Countdown } from "./Countdown";
import { ThemeToggle } from "./ThemeToggle";
import { Clock, RotateCcw, Zap } from "lucide-react";
import { socketService } from "../../../../services/socketService";
import { useSound } from "../hooks/useSound";

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
    setShowFeedback
  } = useGameStore();
  const [playersJoined, setPlayersJoined] = React.useState<any[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = React.useState<string | null>(
    null
  );
  const [currentPlayerUsername, setCurrentPlayerUsername] = React.useState<
    string | null
  >("");

  const [timer, setTimer] = React.useState<number>(0);
  const [question, setQuestion] = React.useState<string | null>(null);

  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(
    null
  );
  const [numberRound, setNumberRound] = React.useState<number[]>([]);

  const [currentRound, setCurrentRound] = React.useState<number>(1);
  const [currentPlayer, setCurrentPlayer] = React.useState<any>(null);

  const { playCorrect, playIncorrect, playTick, playCountdown } = useSound();

  useEffect(() => {
    if (user?._id && code) {
      socketService.connect(user._id);

      socketService.emit("getGameState", code);
      socketService.on("gameState", (data: any) => {
        console.log("Game state received:", data);
        const { defaultTurnTime } = data;
        defaultTurnTimeSet(defaultTurnTime);
      });

      socketService.on("gamePlayers", (playersJoined: any) => {
        console.log("Players joined event received:", playersJoined);
        setPlayersJoined(playersJoined);
      });

      socketService.on("newTurn", (data: any) => {
        console.log("New turn data received:", data);
        const { currentPlayerId, currentPlayerUsername, question, timer } =
          data;
        setCurrentPlayerId(currentPlayerId);
        setQuestion(question);
        setTimer(timer);
        setCurrentPlayerUsername(currentPlayerUsername);
        setShowFeedback(false); 
        nextQuestion(data.question);
      });

      socketService.on("updateTimerOut", (timerLeft: any) => {
        playCountdown();
        console.log("Timer update received:", timerLeft);
        startCountdown(timerLeft);
      });

      socketService.on("updateTimer", (timer: any) => {
        playTick();
        inTurn();
        setTimer(timer);
        if (timer <= 0) {
          console.log("Timer finished, resetting game");
          resetGame();
        }
      });

      socketService.on("answerResult", (data: any) => {
        const { isCorrect, correctAnswer, players } = data;
        selectCorrectAnswer(correctAnswer);
        setShowFeedback(true)
        initializeGame(players);
        if (isCorrect) {
          console.log("Correct answer!");
          playCorrect();
        } else {
          console.log("Incorrect answer.");
          playIncorrect();
        }
      });

      socketService.on("roundFinished", (currentRound: any) => {
        console.log("Round finished:", currentRound);
        // Aquí podrías actualizar el estado del juego para reflejar el fin de la ronda
        setCurrentRound(currentRound.currentRound);
      });
    }
  }, []);
  console.log(gameStatus);
  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-transparent backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div> */}
              <div className="flex items-center">
                <h2 className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-PressStart2P text-lg font-extrabold">
                  MASTER MIND
                </h2>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
              Ronda {currentRound}
            </span>
          </div>
        </div>
      </header>

      {/* Players Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        <div className="text-center mb-8">
          {gameStatus === "playing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center space-y-4 p-6 bg-white/80 rounded-2xl border border-gray-200 backdrop-blur-sm max-w-md mx-auto"
            >
              <Timer timeLeft={timer} timeInRounds={timeInRounds} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 ">
                  {currentPlayerId === user._id
                    ? `¡Es tu turno, ${currentPlayerUsername}!`
                    : `Turno de ${currentPlayerUsername}`}
                </h2>
                <p className="text-gray-500  text-sm mt-1">
                  Responde antes de que se acabe el tiempo
                </p>
              </div>
            </motion.div>
          )}

          {gameStatus === "countdown" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-3 text-gray-500 p-4 bg-white/60 rounded-xl backdrop-blur-sm max-w-xs mx-auto border border-gray-200"
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium">Siguiente pregunta...</span>
            </motion.div>
          )}
        </div>
        {currentQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <QuestionCard socketService={socketService} user={user} currentPlayerId={currentPlayerId} />
          </motion.div>
        )}
      </div>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {/* {gameStatus === "countdown" && (
          <Countdown timer={timeLeft} />
        )} */}
      </AnimatePresence>
    </div>
  );
};
