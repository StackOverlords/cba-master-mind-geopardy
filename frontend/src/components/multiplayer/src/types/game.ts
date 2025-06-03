
export interface Player {
  id: string;
  username: string;
  avatar: string;
  score: number;
  isActive: boolean;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
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
