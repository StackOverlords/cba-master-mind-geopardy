import type React from "react"
import { Clock, CornerUpLeft, Target, Trophy, Users } from "lucide-react"
import type { ChampionShipPlayer } from "../../shared/types/ChampionShipGame"

interface GameStatusProps {
    gameName: string
    currentRound: number
    currentPlayer: ChampionShipPlayer
    countPlayers: number
    turnTime: number
    rounds: number
    handleFinishGame: () => void
}

import { useState, useEffect } from "react";
import { motion } from "motion/react"
import { useNavigate } from "react-router"
import ConfirmationModal from "../confirmationModal"

const usePointRange = (currentRound: number, baseHigh: number, baseLow: number, percentageIncrease: number) => {
    const [pointRange, setPointRange] = useState<string>("");
    useEffect(() => {
        const round = currentRound || 1;
        const multiplier = Math.pow(1 + percentageIncrease, round - 1);

        const high = Math.round(baseHigh * multiplier);
        const low = Math.round(baseLow * multiplier);

        setPointRange(`${low} - ${high}`);
    }, [currentRound, baseHigh, baseLow, percentageIncrease]);

    return pointRange;
};

// Ejemplo de uso en el componente
const GameStatus: React.FC<GameStatusProps> = ({
    gameName,
    currentRound,
    currentPlayer,
    countPlayers,
    turnTime,
    rounds,
    handleFinishGame
}) => {
    const baseHigh = 100;
    const baseLow = 80;
    const percentageIncrease = 0.10; // 10% extra por ronda

    const pointRange = usePointRange(currentRound, baseHigh, baseLow, percentageIncrease);
    const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)
    const navigate = useNavigate()
    const handleExit = () => {
        handleFinishGame()
        navigate('/')
    }

    return (
        <>
            <div className="bg-indigo-950/80 rounded-lg p-3 border border-indigo-500/30 shadow-lg mb-4 w-full">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex space-x-4 flex-col">
                        <header className="flex items-center gap-4">
                            <button
                                onClick={() => setShowModalConfirm(true)}
                                className="bg-indigo-900 p-3 rounded-xl hover:bg-indigo-700 group cursor-pointer transition-colors ease-in-out duration-200">
                                {/* <Gamepad className="h-6 w-6 text-yellow-400" /> */}
                                <CornerUpLeft className="size-6 text-indigo-200 group-hover:text-white" />
                            </button>
                            <div>
                                <h2 className="text-lg sm:text-2xl font-bold text-indigo-200">{gameName}</h2>
                                <motion.p
                                    className="text-yellow-400 font-bold flex items-center gap-2 text-xs sm:text-sm"
                                    key={pointRange} // Cambia la animación cuando cambia el rango
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Trophy className="size-3 sm:size-4" />
                                    {pointRange} points
                                </motion.p>
                            </div>
                        </header>
                        <div className="flex space-x-4 text-xs sm:text-sm mt-2">
                            <div className="flex gap-2 items-center justify-center text-indigo-300">
                                <Target className="size-3 sm:size-4" />
                                <p className="">Round {currentRound}/{rounds}</p>
                            </div>
                            <div className="flex items-center gap-2 text-indigo-300">
                                <Users className="size-3 sm:size-4" />
                                <span>players {countPlayers}</span>
                            </div>
                            <div className="flex items-center gap-2 text-indigo-300">
                                <Clock className="size-3 sm:size-4" />
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
                            <p className="text-indigo-200 font-semibold text-sm sm:text-base">{currentPlayer?.username}'s Turn</p>
                            <p className="text-indigo-300 text-xs sm:text-sm">Score: {currentPlayer?.score}</p>
                        </div>
                    </div>
                </div>
            </div>
            {
                showModalConfirm &&
                <ConfirmationModal
                    title="Exit Game"
                    message="Are you sure you want to leave the game? Your progress will be lost."
                    confirmButtonText="Leave Game"
                    onCancel={() => setShowModalConfirm(false)}
                    onConfirm={handleExit}
                    type="warning"
                />
            }
        </>
    );
};

export default GameStatus;
