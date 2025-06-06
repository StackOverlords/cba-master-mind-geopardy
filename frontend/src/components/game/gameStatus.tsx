import type React from "react"
import { Clock, Target, Trophy, Users } from "lucide-react"
import type { ChampionShipPlayer } from "../../shared/types/ChampionShipGame"

interface GameStatusProps {
    gameName: string
    currentRound: number
    currentPlayer: ChampionShipPlayer
    countPlayers: number
    turnTime: number
}

const GameStatus: React.FC<GameStatusProps> = ({
    gameName,
    currentRound,
    currentPlayer,
    countPlayers,
    turnTime
}) => {
    return (
        <div className="bg-indigo-950/80 rounded-lg p-3 border border-indigo-500/30 shadow-lg mb-4 w-full">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex space-x-4 flex-col">
                    <header className="flex items-center gap-4">
                        <div className="bg-indigo-900 p-3 rounded-full">
                            <Trophy className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-indigo-200">{gameName}</h2>
                            {/* <p className="text-indigo-300/70">Code: {gameCode}</p> */}
                        </div>
                    </header>
                    <div className="flex space-x-4 text-sm mt-2">
                        <div className="flex gap-2 items-center justify-center text-indigo-300">
                            <Target className="size-4" />
                            <p className="">Round {currentRound}</p>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-300">
                            <Users className="size-4" />
                            <span>players {countPlayers}</span>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-300">
                            <Clock className="size-4" />
                            <span>{turnTime}s per turn</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3 bg-indigo-900/60 px-4 py-2 rounded-lg w-full sm:w-max">
                    <img
                        src={currentPlayer?.avatar || "/placeholder.svg"}
                        alt={currentPlayer?.username}
                        className="h-10 w-10 rounded-full border-2 border-indigo-400"
                    />
                    <div>
                        <p className="text-indigo-200 font-semibold">{currentPlayer?.username}'s Turn</p>
                        <p className="text-indigo-300 text-sm">Score: {currentPlayer?.score}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameStatus
