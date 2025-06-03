// import { useGameStore } from "./store/gameStore";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameScreen } from "./components/GameScreen";
import "../../../index.css";
import { useAuthStore } from "../../../stores/authStore";
import { GameNotFound } from "./components/GameNotFound";

function MultiplayerApp() {
  const { user } = useAuthStore();
  const code = sessionStorage.getItem("gameCode");

  if (!user || !code) {
    return <GameNotFound />;
  }
  return (
    <ThemeProvider>
      <div className="App">
        <GameScreen user={user} code={code} />
      </div>
    </ThemeProvider>
  );
}

export default MultiplayerApp;
