import { useState, useEffect } from "react";
import DeviceGameIcon from "../components/ui/icons/deviceGameIcon";
import PlayButton from "../components/ui/playButton";
import logoMastermindDark from "../assets/appLogo/Logo-MasterMind.webp";
import bghero from "../assets/bghero.webp";
// import logoCBADark from "../assets/appLogo/CBA Horizontal-blanco.webp";
import logoCBATarijaDark from "../assets/appLogo/tja blanco-06.webp";
import SocialButton from "../components/ui/socialButton";
import FacebookIcon from "../components/ui/icons/facebookIcon";
import WhatsAppIcon from "../components/ui/icons/WhatsAppIcon";
import WorldIcon from "../components/ui/icons/worldIcon";
import { AnimatedBadge } from "../components/ui/animatedBadge";
import CreateGameModal from "../components/game/createGameModal";
import { useAuthStore } from "../stores/authStore";
import { socketService } from "../services/socketService";
import Header from "../components/header";
import { InfoIcon } from "lucide-react";

const LANDING_PAGE_CONTENT = {
  altTexts: {
    cbaTarija: "Logo de CBA Tarija",
    jeopardyMasterMind: "Jeopardy Master Mind",
  },
  hero: {
    title: "Master Mind",
    subtitle: "Challenge your mind and compete with others",
    description: "Not just a trivia game, but a complete experience that will test your knowledge in various categories.",
    playButton: "Play",
  },
} as const;

interface MultiplayerGameConfig {
  name: string;
  categories: string[];
  defaultTurnTime: number;
  maxPlayers: number;
  rounds: number;
}

const LandingPage = () => {
  const [isCreateGameModalOpen, setIsCreateGameModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  //Store and connect to the socket service when the user is available
  const { user } = useAuthStore();
  useEffect(() => {
    if (user && user._id) {
      if (socketService.isActive()) {
        socketService.disconnect(); // Asegurarse de desconectar antes de conectar
      }
      socketService.connect(user._id);
    }
  }, [user]);

  // Modal crear juego
  const handleOpenCreateGameModal = () => {
    if (!user || !user._id) {
      window.location.href = "/auth/sign-in"; // Redirigir al login si no hay usuario
      return;
    }
    setIsCreateGameModalOpen(true);
  };

  // Cerrar modal crear juego
  const handleCloseCreateGameModal = () => {
    if (socketService.isActive()) {
      socketService.disconnect();
    }
    setIsCreateGameModalOpen(false);
    setIsConnecting(false);
  };

  // Manejar la creación del juego según el modo seleccionado
  const handleActualCreateGame = (
    gameMode: "playerVsPlayer" | "championship",
    config?: MultiplayerGameConfig
  ) => {
    if (gameMode === "playerVsPlayer" && config) {
      handleCreateMultiplayerGame(config);
    } else if (gameMode === "championship") {
      handleCreateChampionshipGame();
    }
  };

  const handleCreateMultiplayerGame = (config: MultiplayerGameConfig) => {
    setIsConnecting(true);
    const gameData = {
      userId: user?._id, // Asegúrate de que el usuario esté conectado
      gameData: {
        name: config.name,
        user: user?._id, // ID del usuario que crea el juego
        gameMode: "playerVsPlayer" as const,
        categorys: config.categories, // Nota: usando 'categorys' como en tu backend
        defaultTurnTime: config.defaultTurnTime,
        maxPlayers: config.maxPlayers,
        rounds: config.rounds,
        status: "waiting" as const,
        currentRound: 0,
        currentPlayerDbId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    socketService.emit("createGame", gameData);

    return () => {
      // socketService.off("gameCreated"); // Limpiar el listener al desmontar
      // socketService.off("gameCreationError"); // Limpiar el listener de error
      setIsConnecting(false); // Resetear el estado de conexión
    };
  };

  const handleCreateChampionshipGame = () => {
    // console.log("Creando juego de campeonato...");
    alert("Modo campeonato creado! (Implementar lógica local aquí)");
    setIsCreateGameModalOpen(false);
  };

  return (
    <main
      style={{ backgroundImage: `url(${bghero})` }}
      className="relative flex flex-col min-h-dvh w-full bg-cover bg-no-repeat bg-center"
    >
      <Header />
      {/* Contenedor para el contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center w-full py-6 px-4">
        <div className="relative mt-20 sm:mt-10">
          <div
            className="absolute inset-[-8px] animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-blue-500/20 blur-lg"
            style={{ transform: "scale(1.2)" }}
          />
          <img
            className="h-16 sm:h-24"
            src={logoMastermindDark}
            alt={LANDING_PAGE_CONTENT.altTexts.jeopardyMasterMind}
          />
        </div>

        <h1 className="text-3xl sm:text-5xl text-center mt-8 font-extrabold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-PressStart2P">
          {LANDING_PAGE_CONTENT.hero.title}
        </h1>

        <section className="flex flex-col items-center max-w-4xl justify-center gap-4 px-6 py-2 sm:py-6">
          <h2 className="text-2xl sm:text-5xl font-extrabold text-center text-wrap">
            {LANDING_PAGE_CONTENT.hero.subtitle}
          </h2>

          <p className="text-xs sm:text-base text-center text-gray-400 text-wrap w-full px-14">
            {LANDING_PAGE_CONTENT.hero.description}
          </p>

          <PlayButton
            handleOpenCreateGameModal={handleOpenCreateGameModal}
            className="sm:mt-14 mt-10"
            disabled={isConnecting}
          >
            <DeviceGameIcon className="size-7 sm:size-8" />
            {isConnecting ? "Creando..." : LANDING_PAGE_CONTENT.hero.playButton}
          </PlayButton>

          <CreateGameModal
            isOpen={isCreateGameModalOpen}
            onClose={handleCloseCreateGameModal}
            onCreateGame={handleActualCreateGame}
          />
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full px-4 py-2 mt-auto flex items-center justify-center">
        <div className="w-full xl:w-7xl flex flex-col sm:flex-row items-center justify-center sm:justify-between px-6 z-20 sm:gap-2 gap-8">
          <div className="flex gap-3">
            {/* <img
              className="h-10 drop-shadow-xl/45 drop-shadow-blue-500"
              src={logoCBADark}
              alt={LANDING_PAGE_CONTENT.altTexts.cbaTarija}
            /> */}
            <img
              className="h-12"
              src={logoCBATarijaDark}
              alt={LANDING_PAGE_CONTENT.altTexts.cbaTarija}
            />
          </div>
          <AnimatedBadge />
          <div className="flex gap-3">
            <SocialButton title="Facebook" target="_blank" href="https://es-la.facebook.com/centrobolivianoamericano.tarija">
              <FacebookIcon className="size-6" />
            </SocialButton>
            <SocialButton title="WhatsApp" target="_blank" href="https://api.whatsapp.com/send/?phone=59176192765&text&type=phone_number&app_absent=0">
              <WhatsAppIcon className="size-6" />
            </SocialButton>
            <SocialButton title="CBA" target="_blank" href="https://cba.org.bo/">
              <WorldIcon className="size-6" />
            </SocialButton>
            {/* Add link to About page */}
            <SocialButton title="About" target={undefined} href="/about">
              <InfoIcon className="size-6" />
            </SocialButton>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
