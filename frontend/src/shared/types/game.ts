export interface Player {
    playerId: string,
    username: string,
    score: number,
    _id: string
}
export interface PlayerPosition {
    playerId: string,
    position: number,
    score: number,
    _id: string
}
export interface GameFinalResults {
    positions: PlayerPosition[],
    _id: string
}
export interface Game {

    _id: string,
    name: string
    user: string,
    status: string,
    gameMode: string,
    players: Player[],
    isDeleted: boolean,
    questions: string[],
    categorys: string[],
    code: string,
    finalResults: GameFinalResults,
    currentRound: number,
    currentPlayerDbId: string,
    defaultTurnTime: number,
    createdAt: string,
    updatedAt: string
}