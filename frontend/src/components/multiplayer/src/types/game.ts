
export interface Player {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  isActive: boolean;
}

export interface Question {
  _id: string;
  question: string;
  answers: { text: string; isCorrect: boolean }[];
}

export interface GameState {
  players: Player[];
  currentQuestion: Question | null;
  currentPlayerIndex: number;
  timeLeft: number;
  gameStatus: 'waiting' | 'countdown' | 'playing' | 'answering' | 'finished';
  round: number;
  selectedAnswer: number | null;
  showFeedback: boolean;
}
