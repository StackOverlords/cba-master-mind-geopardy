
import { useGameStore } from './store/gameStore';
import { ThemeProvider } from './contexts/ThemeContext';
import { GameSetup } from './components/GameSetup';
import { GameScreen } from './components/GameScreen';
import '../../../index.css'
function MultiplayerApp() {
  const { gameStatus } = useGameStore();

  return (
    <ThemeProvider>
      <div className="App">
        {gameStatus === 'waiting' ? <GameSetup /> : <GameScreen />}
      </div>
    </ThemeProvider>
  );
}

export default MultiplayerApp;
