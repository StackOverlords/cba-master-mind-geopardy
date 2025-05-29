
import { create } from 'zustand';
import { Player, Question, GameState } from '../types/game';

// Sample questions data
const sampleQuestions: Question[] = [
  {
    id: '1',
    question: '¿Cuál es la capital de Francia?',
    options: ['Londres', 'París', 'Madrid', 'Roma'],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: '2',
    question: '¿En qué año se fundó Google?',
    options: ['1996', '1998', '2000', '2002'],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: '3',
    question: '¿Cuál es el planeta más grande del sistema solar?',
    options: ['Saturno', 'Neptuno', 'Júpiter', 'Urano'],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: '4',
    question: '¿Quién escribió "Don Quijote de la Mancha"?',
    options: ['García Lorca', 'Miguel de Cervantes', 'Lope de Vega', 'Calderón de la Barca'],
    correctAnswer: 1,
    difficulty: 'medium'
  }
];

interface GameStore extends GameState {
  initializeGame: (playerNames: string[]) => void;
  startCountdown: () => void;
  nextQuestion: () => void;
  selectAnswer: (answerIndex: number) => void;
  nextPlayer: () => void;
  updateTimer: () => void;
  resetGame: () => void;
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

  initializeGame: (playerNames: string[]) => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      avatar: `👤`,
      score: 0,
      isActive: index === 0
    }));

    set({
      players,
      currentPlayerIndex: 0,
      gameStatus: 'countdown',
      round: 1,
      currentQuestion: sampleQuestions[0],
      timeLeft: 15,
      selectedAnswer: null,
      showFeedback: false
    });
  },

  startCountdown: () => {
    set({ gameStatus: 'countdown' });
    setTimeout(() => {
      set({ gameStatus: 'playing' });
    }, 3000);
  },

  nextQuestion: () => {
    const { round } = get();
    const nextQuestion = sampleQuestions[round % sampleQuestions.length];
    
    set({
      currentQuestion: nextQuestion,
      timeLeft: 15,
      selectedAnswer: null,
      showFeedback: false,
      gameStatus: 'playing'
    });
  },

  selectAnswer: (answerIndex: number) => {
    const { currentQuestion, currentPlayerIndex, players } = get();
    if (!currentQuestion) return;

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const updatedPlayers = players.map((player, index) => {
      if (index === currentPlayerIndex && isCorrect) {
        return { ...player, score: player.score + 10 };
      }
      return player;
    });

    set({
      selectedAnswer: answerIndex,
      showFeedback: true,
      players: updatedPlayers,
      gameStatus: 'answering'
    });

    setTimeout(() => {
      get().nextPlayer();
    }, 2000);
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
      get().nextQuestion();
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
