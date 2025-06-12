import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { Timer } from "./Timer";
import { QuestionCard } from "./QuestionCard";
// import { ThemeToggle } from "./ThemeToggle";
import {
  Clock,
  CornerUpLeft,
  Gamepad,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { socketService } from "../../../../services/socketService";
import { useSound } from "../hooks/useSound";
// import { FinalResults } from "./FinalResults";
// import { Leaderboard } from "./ui/leaderBoard";
import PodiumResults from "../../../game/podiumResults";
// import LeaderboardHeader from "../../../game/leaderboard/leaderboardHeader";
import BackButton from "../../../ui/backButton";
import PlayerCard from "./PlayerCard";
const overlayVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
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
    // finalResults,
    setFinalScore,
    setAnswerSelected,
    // selectAnswer,
    setTimerGameOut,
    setGameStatus
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
  const [gameData, setGameData] = React.useState<any>(null);
  const [rounds, setRounds] = React.useState<number>(0);

  //CleanGame
  const handleCleanGame = () => {
    setGameStatus("waiting");
    setCurrentPlayerId(null);
    setCurrentPlayerUsername("");
    setTimer(0);
    setCurrentRound(1);
    setPointsByRound(100);
    setGameData(null);
    // setRounds(0);
    setFinalScore(null);
    setShowFeedback(false);
    // setAnswerSelected(null);
    setTimerGameOut(0);
    // socketService.disconnect();
    // sessionStorage.removeItem("gameCode");
    // window.location.href = "/";
  };

  useEffect(() => {
    if (user?._id && code) {
      socketService.connect(user._id);

      socketService.emit("getGameState", code);
      socketService.on("gameState", (data: any) => {
        const { defaultTurnTime, rounds, gameData } = data;
        setRounds(rounds);
        setGameData(gameData);
        defaultTurnTimeSet(defaultTurnTime);
      });

      socketService.on("gamePlayers", (playersJoined: any) => {
        initializeGame(playersJoined.players);
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
        startCountdown(timerLeft);
      });

      // Actualizar el estado de espera a responder
      socketService.on("updateTimer", (timer: any) => {
        if (timer <= 5) {
          playCountdown();
        } else {
          playTick();
        }
        inTurn();
        setTimer(timer);
        if (timer <= 0) {
          resetGame();
        }
      });

      // Mostrar la respuesta correcta y el feedback
      socketService.on("answerResult", (data: any) => {
        const {
          isCorrect,
          correctAnswer,
          players,
          answerSelected,
        } = data;
        setAnswerSelected(answerSelected);
        selectCorrectAnswer(correctAnswer);
        setShowFeedback(true); 
        // console.log(players);
        initializeGame(players);
        if (isCorrect) {
          playCorrect();
        } else {
          playIncorrect();
        }
      });

      // Finalizar el juego y mostrar resultados
      socketService.on("gameOver", (data: any) => {
        setFinalScore(data);
      });

      // Cuando la ronda termina, actualiza el estado del juego
      socketService.on("roundFinished", (currentRound: any) => {
        setCurrentRound(currentRound.currentRound);
      });

      // Contador antes de devolver a los jugadores a la pantalla de inicio
      socketService.on("updateTimerOutGame", (timeLeft: any) => {
        setTimerGameOut(timeLeft);
      });

      // Redirigir a los jugadores a la pantalla de inicio después de un tiempo
      socketService.on("redirectToHome", () => {
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-transparent">
        <div className="max-w-7xl mx-auto py-2 px-2">
          <div className="bg-indigo-950/80 rounded-lg p-4 border border-indigo-500/30 shadow-lg w-full backdrop-blur-sm">
            {/* Desktop Layout */}
            <div className="hidden md:flex flex-wrap justify-between items-center gap-4">
              <div className="flex space-x-6 flex-col">
                <header className="flex items-center gap-4">
                  {/* Back/Menu Button */}
                  <button className="bg-indigo-900 p-3 rounded-xl hover:bg-indigo-700 group cursor-pointer transition-colors ease-in-out duration-200">
                    <CornerUpLeft className="size-6 text-indigo-200 group-hover:text-white" />
                  </button>

                  {/* Game Title and Points */}
                  <div>
                    <h1 className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-PressStart2P text-2xl md:text-3xl font-extrabold tracking-tighter drop-shadow-lg">
                      MASTER MIND
                    </h1>
                    <motion.p
                      className="text-yellow-400 font-bold flex items-center gap-2 text-sm"
                      key={pointsByRound}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Trophy className="size-4" />
                      {pointsByRound} points this round
                    </motion.p>
                  </div>
                </header>

                {/* Game Stats */}
                <div className="flex space-x-4 text-sm mt-2">
                  <div className="flex gap-2 items-center justify-center text-indigo-300 bg-indigo-900/40 px-3 py-1.5 rounded-lg border border-indigo-600/30">
                    <Target className="size-4" />
                    <p>
                      Round {currentRound}/{rounds}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-300 bg-indigo-900/40 px-3 py-1.5 rounded-lg border border-indigo-600/30">
                    <Users className="size-4" />
                    <span>{players.length}</span>{" "}
                    {/* Hardcoded - conectar con backend */}
                  </div>
                  <div className="flex items-center gap-2 text-indigo-300 bg-indigo-900/40 px-3 py-1.5 rounded-lg border border-indigo-600/30">
                    <Clock className="size-4" />
                    <span>{gameData?.defaultTurnTime}s</span>{" "}
                    {/* Hardcoded - conectar con backend */}
                  </div>
                  <div className="flex items-center gap-2 text-indigo-300 bg-indigo-900/40 px-3 py-1.5 rounded-lg border border-indigo-600/30">
                    <Gamepad className="size-4" />
                    <span>{"Game: " + (gameData?.name || "Master Mind")}</span>
                  </div>
                </div>
              </div>
                {players && (
                  players.map((player)=>{
                    if(player.userId === currentPlayerId) {
                      return (
                        <div key={player.userId} className="flex items-center space-x-3 bg-indigo-900/60 px-4 py-3 rounded-lg border border-indigo-500/40">
                        <img
                      src={player.avatar || "/placeholder-avatar.jpg"} // Hardcoded
                      alt={player.username}
                      className="h-10 w-10 rounded-full border-2 border-indigo-400"
                    />
                    <div>
                      <p className="text-indigo-200 font-semibold text-sm">
                        {player.username}'s Turn
                      </p>
                      <p className="text-indigo-300 text-xs">
                        Score: {player.score} {/* Hardcoded */}
                      </p>
                    </div>
              </div>
                      );
                    }
                  })
                )}

              {/* Current Player Section */}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col space-y-4">
              {/* Top Row - Title and Back Button */}
              <div className="flex items-center justify-between">
                <button className="bg-indigo-900 p-2 rounded-lg hover:bg-indigo-700 group cursor-pointer transition-colors ease-in-out duration-200">
                  <CornerUpLeft className="size-5 text-indigo-200 group-hover:text-white" />
                </button>
                <h2 className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-PressStart2P text-xl font-extrabold text-center flex-1 mx-4">
                  MASTER MIND
                </h2>
                <div className="w-8"> {/* Spacer for centering */}</div>
              </div>

              {/* Points Display */}
              <motion.div
                className="text-yellow-400 font-bold flex items-center justify-center gap-2 text-sm"
                key={pointsByRound}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Trophy className="size-4" />
                {pointsByRound} points this round
              </motion.div>

              {/* Game Stats Row */}
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="flex items-center border border-fuchsia-600 px-3 py-1.5 rounded-lg bg-fuchsia-900 bg-opacity-30 text-white">
                  <Target className="size-3 mr-1" />
                  <span className="font-bold text-fuchsia-300">
                    {currentRound}
                  </span>
                  /{rounds}
                </span>
                <span className="flex items-center border border-cyan-600 px-3 py-1.5 rounded-lg bg-cyan-900 bg-opacity-30 text-white">
                  <Users className="size-3 mr-1" />
                  <span className="font-bold text-cyan-300">4</span> players
                </span>
                <span className="flex items-center border border-green-600 px-3 py-1.5 rounded-lg bg-green-900 bg-opacity-30 text-white">
                  <Clock className="size-3 mr-1" />
                  <span className="font-bold text-green-300">60s</span>
                </span>
              </div>

              {/* Current Player Mobile */}
              {players && (
                players.map((player)=>{
                  if(player.userId === currentPlayerId) {
                    return (
                      <div key={player.userId} className="flex items-center justify-center space-x-3 bg-indigo-900/60 px-4 py-2 rounded-lg border border-indigo-500/40">
                  <img
                    src={player.avatar || "/placeholder-avatar.jpg"} // Hardcoded
                    alt={player.username}
                    className="h-8 w-8 rounded-full border-2 border-indigo-400"
                  />
                  <div className="text-center">
                    <p className="text-indigo-200 font-semibold text-sm">
                      {player.username}'s Turn
                    </p>
                    <p className="text-indigo-300 text-xs">
                      Score: {player.score}
                    </p>
                  </div>
                </div>
                    );
                  }
                })
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-2 px-2">
        {/* Players grid - more compact and responsive */}
        <PlayerCard players={players} currentPlayerId={currentPlayerId} />
        <div className="text-center mb-2">
          {gameStatus === "playing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center space-y-3 md:space-y-4 p-4 md:p-6 rounded-2xl max-w-sm md:max-w-lg mx-auto bg-indigo-950/60 border border-indigo-500/30 backdrop-blur-sm shadow-xl"
            >
              <Timer timeLeft={timer} timeInRounds={timeInRounds} />

              <div className="text-center">
                <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent leading-tight drop-shadow-sm">
                  {currentPlayerId === user._id
                    ? `It's your turn, ${currentPlayerUsername}!`
                    : `${currentPlayerUsername}'s turn`}
                </h2>

                <p className="text-indigo-200 text-xs md:text-sm mt-2 font-semibold px-2">
                  {currentPlayerId === user._id
                    ? "Select the correct answer"
                    : "Waiting for the player to answer..."}
                </p>
              </div>
            </motion.div>
          )}
          {gameStatus === "countdown" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center space-y-3 md:space-y-4 p-4 md:p-6 rounded-2xl max-w-sm md:max-w-lg mx-auto bg-indigo-950/60 border border-indigo-500/30 backdrop-blur-sm shadow-xl"
            >
              {/* Timer Display */}
              <div className="flex items-center justify-center">
                <motion.div
                  className="relative w-16 h-16 md:w-20 md:h-20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-400/30 shadow-lg shadow-cyan-500/30"></div>

                  {/* Progress ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent shadow-lg shadow-cyan-500/50"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  ></motion.div>

                  {/* Center content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Clock className="w-6 h-6 md:w-7 md:h-7 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Status text */}
              <div className="text-center">
                <span className="font-bold text-sm md:text-base text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                  Next question...
                </span>
                <p className="text-xs text-cyan-200 mt-1 px-3 py-1.5 bg-cyan-500/10 rounded-lg border border-cyan-400/30">
                  ⚡ Getting ready to continue
                </p>
              </div>

              {/* Decorative dots */}
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/50"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
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
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm bg-opacity-70 z-50 flex justify-center h-dvh"
            initial="hidden"
            animate="visible"
            variants={overlayVariants}
          >
            <BackButton handleCleanGame={handleCleanGame} href="/" text="Go Home" className="left-4 top-4" />
            <PodiumResults
              players={players}
              handleCleanGame={handleCleanGame}
              showButtons={false}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
