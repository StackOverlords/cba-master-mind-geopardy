import type { Category } from "./category"
import type { Question } from "./question"
import type { User } from "./user"

export interface ChampionShipPlayer {
    username: string,
    score: number,
    _id: string,
    avatar?: string
    scoreTimestamp?: number,
    currentTurn: boolean
}
export interface ChampionShipPlayerPosition {
    position: number,
    score: number,
    _id: string
}
export interface ChampioShipGameFinalResults {
    positions: ChampionShipPlayerPosition[],
    _id: string
}
export interface ChampioShipGame {

    _id: string,
    name: string
    user: User,
    status: string,
    gameMode: string,
    isDeleted: boolean,
    questions: Question[],
    categorys: Omit<Category, 'questionCount'>[],
    finalResults: ChampioShipGameFinalResults,
    finalResultsLocal: [],
    playersLocal: ChampionShipPlayer[],
    currentRound: number,
    rounds: number,
    defaultTurnTime: number,
    questionsLocalAnswered: QuestionsAnswered[]
    createdAt: string,
    updatedAt: string
}
interface QuestionsLocalAnswered extends AnswerData {
    questionId: string
}

export interface AnswerData {
    answer: string;
    isCorrect: boolean;
}

export interface SubmitAnswerPayload {
    gameId: string;
    questionId: string;
    answerData: AnswerData;
}
export interface QuestionsAnswered extends AnswerData {
    _id: string,
    questionId: string
}