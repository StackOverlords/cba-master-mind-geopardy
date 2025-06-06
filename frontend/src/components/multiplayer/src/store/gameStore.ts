
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
  finalResults: {
    ranking: { playerId: string; score: number }[];
    playersScores: { userId: string; username: string; score: number }[];
  };

  setFinalScore: (rankings: any) => void;
  timerGameOut: number;
  setTimerGameOut: (timerGameOut: number) => void;
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
  timerGameOut: 0,
  finalResults: {
    ranking: [],
    playersScores: []
  },
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

  selectCorrectAnswer: (answer: any) => { // This function is called to set the correct answer for the current question
    set({
      correctAnswer: answer
    });
  },

  selectAnswer: (selectedAnswer: number) => { // This function is called when a player selects an answer
    set({
      selectedAnswer,
    });
  },

  nextPlayer: () => { // This function is called to move to the next player in the game
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

  setShowFeedback: (show: boolean) => { // This function is called to show or hide feedback after an answer is selected
    set({ showFeedback: show });
  },

  updateTimer: () => { // This function is called to update the timer every second
    const { timeLeft } = get();
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else {
      get().selectAnswer(-1); // Time's up, wrong answer
    }
  },

  resetGame: () => { // This function is called to reset the game state
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
  },
  setFinalScore: (rankings: any) => { // This function is called to set the final results of the game
    set({ gameStatus: 'finished' })
    /*
      gameStatus: 'finished'
    */
    set({ finalResults: rankings });
    /*
      {
        rankings: [
          { playerId: 'player-1', score: 100 },
          { playerId: 'player-2', score: 80 },
        ],
        playersScores: [
          { userId:'123',username:'player-1', score: 100},
          { userId:'456',username:'player-2', score: 80}
        ]
      }
    */
  },
  setTimerGameOut: (timerGameOut: number) => set({ timerGameOut })
}));
