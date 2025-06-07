// import { useGameStore } from "./store/gameStore";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameScreen } from "./components/GameScreen";
import "../../../index.css";
import { useAuthStore } from "../../../stores/authStore";
import { GameNotFound } from "./components/GameNotFound";
// import { useEffect } from "react";
// import { socketService } from "../../../services/socketService";
// import { useGameStore } from "./store/gameStore";

function MultiplayerApp() {
  const { user } = useAuthStore();
  // const { nextQuestion } = useGameStore();
  const code = sessionStorage.getItem("gameCode");

  if (!user || !code) {
    return <GameNotFound />;
  }

  // useEffect(() => {
  //   if (!user || !code) {
  //     socketService.connect(user._id);

  //     socketService.on("newTurn", (data: any) => {
  //       console.log("New turn:", data);
  //       nextQuestion(data);
  //     });

  //     socketService.on("answerResult", (data: any) => {

  //     });
  //   }
  // }, []);
  return (
    <ThemeProvider>
      <div className="App">
        <GameScreen user={user} code={code} />
      </div>
    </ThemeProvider>
  );
}

export default MultiplayerApp;
