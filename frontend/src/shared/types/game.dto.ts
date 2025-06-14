export interface PlayerChampionShip {
    username: string,
    score: number,
    _id: string,
    avatar?: string,
    scoreTimestamp:number
}
export interface CreateGameChampionShipDto {

    _id?: string,
    name: string
    user: string,
    status: string,
    gameMode: string,
    generateQuestions: boolean,
    playersLocal: PlayerChampionShip[],
    categorys: string[],
    rounds: number,
    currentRound:number,
    defaultTurnTime:number
}