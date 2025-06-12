import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import XIcon from "../ui/icons/xIcon";
import ModeSelectionButton from "../ui/modeSelectionButton";
import { HttpClient } from "../../api/http.requests";
import { useAuthStore } from "../../stores/authStore";
import RefreshIcon from "../ui/icons/refreshIcon";
import { ButtonAnimated } from "../ui/buttonAnimated";
import { socketService } from "../../services/socketService";
import JoinGameInputButton from "../ui/joinGameInputButton";
import { useNavigate } from "react-router";
import { useGameStore } from "../multiplayer/src/store/gameStore";
import ErrorToast from "../toastAlerts/errorAlert";
import toast from "react-hot-toast";
import SpinnerIcon from "../ui/icons/spinnerIcon";
import InputField from "../ui/inputField";
import SelectOptions from "../ui/selectOptions";

const httpClient = new HttpClient();

const TextComponent = {
  createGame: "Create Game",
  championship: "Championship",
  multiplayer: "Multiplayer",
  modeSelection: "Select game mode",
  multiplayerConfig: "Configure Multiplayer Game",
  championshipConfig: "Championship Mode",
  namePlaceholder: "Ex: Friday Trivia",
  nameLabel: "Game name",
  turnTimeLabel: "Turn time (sec)",
  maxRounds: "Max. rounds",
  categoriesLabel: "Categories",
  categoriesSelected: "Categories ({count} selected)",
  backButton: "Back",
  createGameButton: "Create Game",
  cancelButton: "Cancel",
  championshipDescription:
    "In this mode, players will take turns on the same device. Perfect for group play in person.",
  shareCode: "Share the game code with your friends so they can join.",
  waitingForPlayers: "Waiting for Players",
  gameCreated: "Game created!",
  gameCode: "Game code",
  copyCode: "Copy code",
  waitingForPlayersDescription: "Waiting for other players to join the game.",
  waitingForPlayersAction: "Go to game",
  players: "Players joined in the room",
  startGame: "Start Game",
  joinExistingGame: "Join Existing Game",
  enterCode: "Enter the code shared by the host",
};

interface Category {
  _id: string;
  name: string;
  description?: string;
  isDeleted?: boolean;
  user: string;
  questionCount: number;
}

interface MultiplayerGameConfig {
  name: string;
  categories: string[];
  defaultTurnTime: number;
  maxPlayers: number;
  rounds: number;
}

interface ApiDataReturn {
  data: Category[];
  limit: number;
  sort: string;
  totalCount: number;
  totalPages: number;
  page: number;
}
interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (
    gameMode: "playerVsPlayer" | "championship",
    config?: MultiplayerGameConfig
  ) => void;
}

type ModalStep =
  | "mode-selection"
  | "multiplayer-config"
  | "championship-config"
  | "waiting-for-players"
  | "room-waiting"
  | "joinGame";

const CreateGameModal: React.FC<CreateGameModalProps> = ({
  isOpen,
  onClose,
  onCreateGame,
}) => {
  const { initializeGame } = useGameStore();

  const [currentStep, setCurrentStep] = useState<ModalStep>("mode-selection");
  const [multiAnimations, setMultiAnimations] = useState({
    refreshAnimation: false,
  });
  // Navigate
  const navigate = useNavigate();

  // Categories fetched from the API
  const [categories, setCategories] = useState<Category[]>([]);
  //Game code
  const [gameCode, setGameCode] = useState<string | null>(null);
  // Players joined in the room
  const [playersJoined, setPlayersJoined] = useState<any[]>([]);
  // authStore
  const { user } = useAuthStore();
  // State to game
  const [gameState, setGameState] = useState<any>(null);
  // Deactivated button start
  const [deactivatedButtonStart, setDeactivatedButtonStart] =
    useState<boolean>(false);
  // Multiplayer mode configuration
  const [multiplayerConfig, setMultiplayerConfig] =
    useState<MultiplayerGameConfig>({
      name: "",
      categories: [],
      defaultTurnTime: 60,
      maxPlayers: 8,
      rounds: 4,
    });
  // Animation state for the refresh button
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  // Reset modal when closed
  useEffect(() => {
    socketService.connect(user?._id || ""); // Make sure user is connected
    setCurrentStep("mode-selection");
    setMultiplayerConfig({
      name: "",
      categories: [],
      defaultTurnTime: 60,
      maxPlayers: 99,
      rounds: 4,
    });
    if (user) {
      handleGetCategories();
    }

    const handleGameCreated = (gameData: any) => {
      setGameCode(gameData.gameCode || gameData.code);
      // console.log(gameData);
      setCurrentStep("waiting-for-players");
    };

    socketService.on("gameCreated", (gameCode: { gameCode: string }) => {
      // console.log("Game created event received:", gameCode.gameCode);
      socketService.emit("getGameState", gameCode.gameCode);
      handleGameCreated(gameCode);
      setIsLoadingCreate(false);
    });
    socketService.on("gameOverPlayersCero", () => {
      // console.log("Game over due to no players:", reason);
      setCurrentStep("mode-selection");
      setGameCode(null);
      setPlayersJoined([]);
    });
    socketService.on("gamePlayers", (playersJoined: any) => {
      setCurrentStep("room-waiting");
      // console.log("Players joined event received:", playersJoined);
      setPlayersJoined(playersJoined.players);
    });

    socketService.on("gameState", (gameState: any) => {
      // console.log("Game state received:", gameState);
      setGameState(gameState);
    });
    socketService.on("gameCancelledOwnerLeft", () => {
      // console.log("Game cancelled due to owner leaving:", reason.message);
      setCurrentStep("mode-selection");
      setGameCode(null);
      setPlayersJoined([]);
    });
    socketService.on("gameStarted", (gameCodeHere: any) => {
      setCurrentStep("mode-selection");
      //Redirect to the game page
      // console.log("Initializing game with players:", gameCodeHere?.players);
      initializeGame(gameCodeHere?.players); // Initialize game with players
      navigate(`/multiplayer`); // Redirect to the game page
      setDeactivatedButtonStart(true); // Disable start button
      sessionStorage.setItem("gameCode", gameCodeHere.gameCode); // Save game code in session storage
    });

    socketService.on("error", (error: any) => {
      // console.log("Error event received:", error);
      toast.custom((t) => (
        <ErrorToast
          t={t}
          title="Something went wrong"
          description={error.message || "An unexpected error occurred."}
        />
      ));
    });
    return () => {
      // socketService.off("gameCreated", handleGameCreated);
      // socketService.off("gameOverPlayersCero");
      // socketService.off("gamePlayers");
      // socketService.off("gameState");
      // socketService.off("gameCancelledOwnerLeft");
      // socketService.off("gameStarted");
      setGameCode(null);
    };
  }, [isOpen, user]);

  const handleModeSelection = (
    mode: "playerVsPlayer" | "championship" | "joinGame"
  ) => {
    if (mode === "playerVsPlayer") {
      setCurrentStep("multiplayer-config");
    } else if (mode === "championship") {
      navigate("/create-game");
    } else if (mode === "joinGame") {
      setCurrentStep("joinGame");
    }
  };

  const handleGetCategories = async () => {
    setMultiAnimations((prev) => ({ ...prev, refreshAnimation: true }));
    try {
      const token = user?.accessToken;
      if (!token) {
        console.error("Could not get authentication token");
        return;
      }

      const fetchedCategories = await httpClient.get<ApiDataReturn>(
        "/category",
        {
          bearerToken: token,
        }
      );
      let categoriesValid = fetchedCategories?.data.filter(
        (q) => q.questionCount > 0
      );
      setCategories(categoriesValid || []);
      setMultiAnimations((prev) => ({ ...prev, refreshAnimation: false }));
    } catch (error) {
      console.error("Error getting categories:", error);
    }
  };

  const handleBackToModeSelection = () => {
    setCurrentStep("mode-selection");
  };

  const handleCreateMultiplayerGame = async () => {
    setIsLoadingCreate(true);
    if (!multiplayerConfig.name.trim()) {
      toast.error((t) => (
        <ErrorToast
          t={t}
          title="Game name is required"
          description="Please enter a name for the game"
        />
      ));
      setIsLoadingCreate(false);
      return;
    }

    if (multiplayerConfig.categories.length === 0) {
      toast.error((t) => (
        <ErrorToast
          t={t}
          title="At least one category is required"
          description="Please select at least one category for the game"
        />
      ));
      setIsLoadingCreate(false);
      return;
    }

    onCreateGame("playerVsPlayer", multiplayerConfig);
  };

  const handleCreateChampionshipGame = () => {
    onCreateGame("championship");
    setCurrentStep("waiting-for-players");
    setGameCode("LOCAL");
  };

  const handleStartGame = () => {
    let socket = socketService.getSocket();
    // console.log("Click in Started!");

    if (gameCode && socket) {
      // console.log(gameCode);
      socket.emit("startGame", { gameCode: gameCode, userId: user?._id });
      setDeactivatedButtonStart(true); // Disable start button
    } else {
      console.error("Game code is not set");
    }
  };
  const handleReady = (userId: string) => {
    // console.log("handleReady called with userId:", userId);
    let socket = socketService.getSocket();
    if (userId !== user?._id) {
      toast.error("You can only mark yourself as ready.");
      return;
    } else {
      // console.log("Marking player as ready:", userId);
      socket.emit("playerReady", { gameCode: gameCode, userId: userId });
    }
  };

  const toggleCategory = (categoryId: string) => {
    setMultiplayerConfig((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };
  const renderRoomWaiting = () => {
    return (
      <motion.div
        key="room-waiting"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-4 w-full max-w-md mx-auto"
      >
        {/* Sección del Código de Juego (Sin cambios) */}
        <div className="bg-zinc-900/70 border border-zinc-700/80 rounded-xl p-4 shadow-lg shadow-black/20">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold text-violet-400 tracking-wider uppercase">
              {TextComponent.gameCode}
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="px-5 py-2 bg-black/20 rounded-lg border border-dashed border-violet-500/50">
                <span className="text-2xl font-mono font-bold tracking-widest text-violet-300">
                  {gameCode}
                </span>
              </div>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigator.clipboard.writeText(gameCode || "")}
                className="p-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors duration-200 shadow-md shadow-violet-600/20"
                aria-label="Copy code"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </motion.button>
            </div>
            <div className="bg-violet-500/10 rounded-md p-2 border border-violet-500/20">
              <p className="text-xs text-violet-300 font-medium">
                {TextComponent.shareCode}
              </p>
            </div>
          </div>
        </div>

        {/* Sección de Jugadores - ¡REDISENADA! */}
        <div className="bg-zinc-900/70 border border-zinc-700/80 rounded-xl overflow-hidden shadow-lg shadow-black/20">
          <div className="px-4 py-3 bg-zinc-800/20 border-b border-zinc-700/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20 border border-violet-500/30">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">
                    Jugadores Conectados
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {playersJoined?.length || 0} de{" "}
                    {multiplayerConfig.maxPlayers} jugadores
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-zinc-800 rounded-full h-1.5 border border-zinc-700">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      ((playersJoined?.length || 0) /
                        multiplayerConfig.maxPlayers) *
                      100,
                      100
                    )}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Lista de Jugadores con nuevo diseño */}
          <div className="p-2 max-h-[calc(100vh-450px)] overflow-y-auto">
            {playersJoined?.length > 0 ? (
              <div className="space-y-2">
                {playersJoined.map((player, index) => {
                  // ⭐ DETERMINAMOS SI ESTA TARJETA PERTENECE AL JUGADOR ACTUAL
                  // Reemplaza 'currentUserId' con la variable que contenga el ID del usuario logueado
                  const isCurrentUser = player.userId === user?._id;

                  return (
                    <motion.div
                      key={player.userId || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <img
                          className="w-12 h-12 rounded-lg object-cover border-2 border-zinc-700"
                          src={player.avatar}
                          alt={player.username}
                        />
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-zinc-800 shadow"></div>
                      </div>

                      {/* Contenedor principal para nombre y botón */}
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Nombre y estado de texto */}
                        <div>
                          <h4 className="text-base font-bold text-zinc-100 truncate">
                            {player.username || `Jugador ${index + 1}`}
                            {isCurrentUser && (
                              <span className="text-xs text-violet-400">
                                {" "}
                                (Tú)
                              </span>
                            )}
                          </h4>
                          <p
                            className={`text-xs font-semibold ${player.isReady
                                ? "text-green-400"
                                : "text-zinc-400"
                              }`}
                          >
                            {player.isReady ? "Listo" : "Esperando..."}
                          </p>
                        </div>

                        {/* LÓGICA CORREGIDA: mostramos el botón o el indicador */}
                        {isCurrentUser ? (
                          // BOTÓN INTERACTIVO PARA EL JUGADOR ACTUAL
                          <motion.button
                            layout
                            onClick={() => handleReady(player.userId)}
                            className={`w-full text-sm font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 py-2
                  ${player.isReady
                                ? "bg-green-600 border-2 border-green-500 text-white shadow-lg shadow-green-500/20"
                                : "bg-zinc-700/50 border-2 border-dashed border-violet-500/60 text-violet-300 hover:bg-violet-500/80 hover:text-white hover:border-solid animate-pulse"
                              }`}
                          >
                            {player.isReady ? (
                              <>
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>Listo</span>
                              </>
                            ) : (
                              <span>¡Declárate Listo!</span>
                            )}
                          </motion.button>
                        ) : (
                          // INDICADOR VISUAL PARA OTROS JUGADORES (NO INTERACTIVO)
                          <div
                            className={`w-full text-sm font-bold rounded-lg flex items-center justify-center gap-2 py-2
                 ${player.isReady
                                ? "bg-green-600/30 text-green-400"
                                : "bg-zinc-700/30 text-zinc-400"
                              }`}
                          >
                            {player.isReady ? (
                              <span>✓ Listo</span>
                            ) : (
                              <span>Esperando...</span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // Estado cuando no hay jugadores
              <div className="text-center py-10 px-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-zinc-700 shadow-md">
                  <svg
                    className="w-7 h-7 text-zinc-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-zinc-300 mb-1">
                  Esperando jugadores...
                </h4>
                <p className="text-zinc-400 text-xs">
                  Comparte el código para que otros se unan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botón de Acción Principal (Sin cambios) */}
        {deactivatedButtonStart !== true ? (
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 25px rgba(139, 92, 246, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartGame}
            className="w-full py-3 text-base text-white bg-violet-600 hover:bg-violet-500 rounded-lg font-bold transition-all duration-200 shadow-lg shadow-violet-600/30"
          >
            {TextComponent.startGame}
          </motion.button>
        ) : null}
      </motion.div>
    );
  };
  const renderGameCreatedStep = () => (
    <motion.div
      key="waiting-for-players"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 w-full max-w-md mx-auto" // Usamos el mismo ancho y centrado
    >
      {/* Sección del Código de Juego - Re-estilizada */}
      <div className="bg-zinc-900/70 border border-zinc-700/80 rounded-xl p-4 shadow-lg shadow-black/20">
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold text-violet-400 tracking-wider uppercase">
            {TextComponent.gameCode}
          </p>

          <div className="flex items-center justify-center gap-3">
            {/* El código con un fondo más oscuro y borde de acento */}
            <div className="px-5 py-2 bg-black/20 rounded-lg border border-dashed border-violet-500/50">
              <span className="text-2xl font-mono font-bold tracking-widest text-violet-300">
                {gameCode}
              </span>
            </div>
            {/* Botón de Copiar con el nuevo acento */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)", // Sombra violeta
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigator.clipboard.writeText(gameCode || "")}
              className="p-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors duration-200 shadow-md shadow-violet-600/20"
              aria-label="Copy code"
            >
              {/* Icono de Copiar */}
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </motion.button>
          </div>

          {/* Banner de información sutil */}
          <div className="bg-violet-500/10 rounded-md p-2 border border-violet-500/20">
            <p className="text-xs text-violet-300 font-medium">
              Comparte este código para que tus amigos se unan a la partida.
            </p>
          </div>
        </div>
      </div>

      {/* Mensaje principal */}
      <div className="text-center mt-6">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-zinc-100">
          {TextComponent.gameCreated}
        </h3>
        <p className="text-zinc-400 mt-2">{TextComponent.shareCode}</p>
      </div>

      {/* Botón de Acción Principal */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 text-base text-white bg-zinc-700 hover:bg-zinc-600 rounded-lg font-bold transition-colors duration-200 shadow-md shadow-black/20"
        >
          {TextComponent.waitingForPlayersAction}
        </button>
      </div>
    </motion.div>
  );

  const renderModeSelectionStep = () => (
    <motion.div
      key="mode-selection"
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <p className="text-slate-400">
        Choose the type of game you want to start:
      </p>

      <div className="space-y-3">
        <ModeSelectionButton
          label={TextComponent.multiplayer}
          description="Other players join from their devices"
          isSelected={false}
          onClick={() => handleModeSelection("playerVsPlayer")}
          icon="🌐"
          children={
            <span className="ml-2 px-2 py-0.5 rounded bg-yellow-400 text-gray-800 text-[10px] sm:text-xs font-semibold">
              Beta
            </span>
          }
        />
        <ModeSelectionButton
          label={TextComponent.championship}
          description="Players take turns on this device"
          isSelected={false}
          onClick={() => handleModeSelection("championship")}
          icon="🏆"
        />
        <JoinGameInputButton
          label={TextComponent.joinExistingGame}
          description={TextComponent.enterCode}
          icon="🔗"
          userId={user?._id}
          placeholder="Example: GZKQAYBK"
          buttonText="Join Now"
          setGameCode={(code) => setGameCode(code)}
          gameState={gameState}
          setDeactivatedButtonStart={(val) => setDeactivatedButtonStart(val)}
          children={
            <span className="ml-2 px-2 py-0.5 rounded bg-yellow-400 text-gray-800 text-[10px] sm:text-xs font-semibold">
              Beta
            </span>
          }
        />
      </div>
    </motion.div>
  );

  const renderMultiplayerConfigStep = () => (
    <motion.div
      key="multiplayer-config"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="space-y-5 w-full max-w-xl mx-auto"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={handleBackToModeSelection}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="text-sm font-semibold text-gray-200">
          {TextComponent.multiplayerConfig}
        </h3>
      </div>

      {/* Game name */}
      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1.5">
          {TextComponent.nameLabel}
        </label>
        <InputField
          type="text"
          value={multiplayerConfig.name}
          onChange={(e) =>
            setMultiplayerConfig((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder={TextComponent.namePlaceholder}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-300"
          maxLength={50}
        />
      </div>

      {/* Time and players configuration */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            {TextComponent.turnTimeLabel}
          </label>
          <SelectOptions
            value={multiplayerConfig.defaultTurnTime}
            onChange={(e) =>
              setMultiplayerConfig((prev) => ({
                ...prev,
                defaultTurnTime: Number(e.target.value),
              }))
            }
          >
            <option value={30} className="bg-gray-800 text-gray-300">
              30 seconds
            </option>
            <option value={60} className="bg-gray-800 text-gray-300">
              60 seconds
            </option>
            <option value={90} className="bg-gray-800 text-gray-300">
              90 seconds
            </option>
            <option value={120} className="bg-gray-800 text-gray-300">
              2 minutes
            </option>
          </SelectOptions>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            {TextComponent.maxRounds}
          </label>
          <SelectOptions
            value={multiplayerConfig.rounds}
            onChange={(e) =>
              setMultiplayerConfig((prev) => ({
                ...prev,
                rounds: Number(e.target.value),
              }))
            }
          >
            <option value={2} className="bg-gray-800 text-gray-300">
              2 rounds
            </option>
            <option value={4} className="bg-gray-800 text-gray-300">
              4 rounds
            </option>
            <option value={6} className="bg-gray-800 text-gray-300">
              6 rounds
            </option>
            <option value={8} className="bg-gray-800 text-gray-300">
              8 rounds
            </option>
            <option value={10} className="bg-gray-800 text-gray-300">
              10 rounds
            </option>
          </SelectOptions>
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-gray-300">
            {TextComponent.categoriesSelected.replace(
              "{count}",
              multiplayerConfig.categories.length.toString()
            )}
          </label>
          <ButtonAnimated
            isAnimated={multiAnimations.refreshAnimation}
            onClick={handleGetCategories}
            className="w-5 h-5 rounded-lg flex items-center justify-center"
            aria-label="Reload categories"
          >
            <RefreshIcon className="w-4 h-4" />
          </ButtonAnimated>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto py-1">
          {categories.map((category) => (
            <button
              key={category?._id}
              onClick={() => toggleCategory(category._id)}
              className={`p-2.5 text-left border rounded-lg transition-all text-sm ${multiplayerConfig.categories.includes(category._id)
                  ? "border-blue-500  text-blue-400"
                  : "border-dashboard-border"
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs text-white">
                  {category.name}
                </span>
                {multiplayerConfig.categories.includes(category._id) && (
                  <div className="w-3.5 h-3.5 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2 h-2 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {category.description && (
                <p
                  className={`text-[10px] mt-0.5 ${multiplayerConfig.categories.includes(category._id)
                      ? "text-blue-400"
                      : "text-gray-300"
                    }`}
                >
                  {category.description}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderChampionshipConfigStep = () => (
    <motion.div
      key="championship-config"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleBackToModeSelection}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-slate-400">
          {TextComponent.championshipConfig}
        </h3>
      </div>

      <div className="text-center py-8">
        <div className="text-6xl mb-4">🏆</div>
        <h4 className="text-xl font-bold text-white mb-2">
          Ready for the Championship!
        </h4>
        <p className="text-slate-400">
          {TextComponent.championshipDescription}
        </p>
      </div>
    </motion.div>
  );

  const getActionButtons = () => {
    if (currentStep === "mode-selection") {
      return (
        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-white bg-dashboard-border/80 hover:bg-dashboard-border rounded-lg font-medium transition-colors"
          >
            {TextComponent.cancelButton}
          </button>
        </div>
      );
    }

    if (currentStep === "multiplayer-config") {
      const canCreate =
        multiplayerConfig.name.trim() &&
        multiplayerConfig.categories.length > 0;

      return (
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleBackToModeSelection}
            className="flex-1 px-4 py-2.5 text-white border-dashboard-border/50 border-2 hover:bg-dashboard-border/50 rounded-lg font-medium transition-colors"
          >
            {TextComponent.backButton}
          </button>
          <button
            onClick={handleCreateMultiplayerGame}
            disabled={!canCreate}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${canCreate
                ? "bg-dashboard-border/80 hover:bg-dashboard-border text-white"
                : "bg-dashboard-border/50 text-white cursor-not-allowed"
              }`}
          >
            {isLoadingCreate ? (
              <SpinnerIcon className="inline-block mr-2 w-5 h-5 animate-spin" />
            ) : (
              TextComponent.createGame
            )}
          </button>
        </div>
      );
    }

    if (currentStep === "championship-config") {
      return (
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleBackToModeSelection}
            className="flex-1 px-4 py-2.5  text-white border-dashboard-border/50 border-2 hover:bg-dashboard-border/50 rounded-lg font-medium transition-colors"
          >
            {TextComponent.backButton}
          </button>
          <button
            onClick={handleCreateChampionshipGame}
            className="flex-1 px-4 py-2.5 bg-dashboard-border/80 hover:bg-dashboard-border text-white rounded-lg font-medium transition-colors"
          >
            {TextComponent.championship}
          </button>
        </div>
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl p-4 bg-gradient-to-br from-leaderboard-bg to-black rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl w-full font-bold text-white">
                {currentStep === "mode-selection" && "Create New Game"}
                {currentStep === "multiplayer-config" && "Configuration"}
                {currentStep === "championship-config" && "Championship"}
                {currentStep === "waiting-for-players" && (
                  <span>{TextComponent.waitingForPlayers}</span>
                )}
                {currentStep === "room-waiting" && (
                  <span>{TextComponent.players}</span>
                )}
              </h2>
              <button
                className="p-2 text-gray-400 hover:bg-dashboard-border hover:text-white rounded-md transition-colors"
                onClick={onClose}
                aria-label="Close modal"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {currentStep === "mode-selection" && renderModeSelectionStep()}
              {currentStep === "multiplayer-config" &&
                renderMultiplayerConfigStep()}
              {currentStep === "championship-config" &&
                renderChampionshipConfigStep()}
              {currentStep === "waiting-for-players" && renderGameCreatedStep()}
              {currentStep === "room-waiting" && renderRoomWaiting()}
            </AnimatePresence>

            {/* Action Buttons */}
            {getActionButtons()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateGameModal;
