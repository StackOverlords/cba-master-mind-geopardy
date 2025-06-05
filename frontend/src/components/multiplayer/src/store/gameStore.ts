
import { create } from 'zustand';
import type { GameState, Player } from '../types/game';


interface GameStore extends GameState {
  initializeGame: (playerNames: string[]) => void;
  startCountdown: (timeLeft: number) => void;
  nextQuestion: (data: any) => void;
  selectAnswer: (answerIndex: number) => void;
  nextPlayer: () => void;
  updateTimer: () => void;
  resetGame: () => void;
  inTurn: () => void;
  defaultTurnTimeSet: (time: number) => void;
  selectCorrectAnswer: (answer: any) => void;
  setShowFeedback: (show: boolean) => void;
  timeInRounds: number;
  correctAnswer: any;
}

export const useGameStore = create<GameStore>((set, get) => ({
  players: [],
  currentQuestion: null,
  currentPlayerIndex: 0,
  timeLeft: 15,
  gameStatus: 'waiting',
  round: 1,
  selectedAnswer: null,
  showFeedback: false,
  timeInRounds: 0,
  correctAnswer: null,

  initializeGame: (players: any) => {
    console.log(players, "players in gameStore");
    const playersSet: Player[] = players.map((user: any, index: any) => ({
      id: `player-${index}`,
      username: user.username,
      socketId: user.socketId,
      userId: user.userId,
      score: user.score || 0,
      hasAnsweredThisTurn: user.hasAnsweredThisTurn || false,
      // isActive: index === 0
    }));
    set({
      players: playersSet,
    });
  },

  startCountdown: (timeLeft: number) => {
    set({ gameStatus: 'countdown', timeLeft });
  },
  inTurn: () => {
    set({ gameStatus: 'playing' });
  },
  defaultTurnTimeSet: (time: number) => {
    set({ timeInRounds: time });
  },
  nextQuestion: (data: any) => {
    set({
      currentQuestion: data
    });
  },
  selectCorrectAnswer: (answer:any) => {
    set({
      correctAnswer: answer
    });
  },
  selectAnswer: (selectedAnswer: number) => {
    set({
      selectedAnswer,
    });
  },

  nextPlayer: () => {
    const { players, currentPlayerIndex, round } = get();
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

    const updatedPlayers = players.map((player, index) => ({
      ...player,
      isActive: index === nextPlayerIndex
    }));

    if (nextPlayerIndex === 0) {
      // New round
      set({
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        round: round + 1,
        gameStatus: 'playing'
      });
    } else {
      set({
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
        gameStatus: 'playing',
        timeLeft: 15,
        selectedAnswer: null,
        showFeedback: false
      });
    }
  },

  setShowFeedback: (show: boolean) => {
    set({ showFeedback: show });
  },

  updateTimer: () => {
    const { timeLeft } = get();
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else {
      get().selectAnswer(-1); // Time's up, wrong answer
    }
  },

  resetGame: () => {
    set({
      players: [],
      currentQuestion: null,
      currentPlayerIndex: 0,
      timeLeft: 15,
      gameStatus: 'waiting',
      round: 1,
      selectedAnswer: null,
      showFeedback: false
    });
  }
}));
