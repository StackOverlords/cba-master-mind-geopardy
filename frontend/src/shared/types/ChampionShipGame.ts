import type { Category } from "./category"
import type { Question } from "./question"
import type { User } from "./user"

export interface ChampionShipPlayer {
    username: string,
    score: number,
    _id: string,
    avatar?: string
    scoreTimestamp?: number
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
    playersLocal: ChampionShipPlayer[],
    currentRound: number,
    rounds: number,
    defaultTurnTime: number,
    questionsLocalAnswered: []
    createdAt: string,
    updatedAt: string
}