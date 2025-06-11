import { motion } from "motion/react";
// import type { ChampionShipPlayer } from "../../shared/types/ChampionShipGame";
import PodiumStep from "./leaderboard/podiumStep";
import TrophyIcon from "../ui/icons/trophyIcon";
import { useNavigate } from "react-router";
import { Flag, Sparkles } from "lucide-react";

interface Props {
    players: any[];
};
const PodiumResults: React.FC<Props> = ({
    players
}) => {
    const navigate = useNavigate()
    const sortedAll = [...players].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (a.scoreTimestamp ?? 0) - (b.scoreTimestamp ?? 0);
    });

    const handleNewGame = () => {
        navigate('/create-game')
    }
    const handleEndGame = () => {
        navigate('/')
    }
    const podium = sortedAll.filter(p => p.score > 0).slice(0, 3);
    const rest = sortedAll.filter(p => !podium.includes(p));
    return (
        <div className="flex flex-col items-center p-2 sm:p-4 w-full overflow-y-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-yellow-400 text-center mb-2 mt-8">
                🏆 Final Classification!
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 text-center mb-6">
                Only the fastest and wisest made it to the podium. Congratulations to everyone!
            </p>
            <div className="text-xs flex gap-2 w-full max-w-sm">
                <button
                    onClick={handleNewGame}
                    className="w-full p-2 flex justify-center items-center gap-2 group text-white font-semibold rounded-md bg-dashboard-bg hover:bg-dashboard-border ease-in-out duration-200 hover:brightness-110 transition-all shadow-md border border-dashboard-border cursor-pointer"
                >
                    <Sparkles className="size-4 text-teal-200 group-hover:text-teal-400 transition-colors duration-200" />
                    New Game
                </button>
                <button
                    onClick={handleEndGame}
                    className="w-full py-2 px-3 text-white font-semibold rounded-md bg-dashboard-bg hover:bg-dashboard-border ease-in-out duration-200 hover:brightness-110 transition-all shadow-md border border-dashboard-border cursor-pointer flex items-center justify-center gap-2 group"
                >
                    <Flag className="size-4 text-red-200 group-hover:text-red-400" />
                    End Game
                </button>
            </div>
            {/* Podio */}
            <div className="flex justify-center items-end gap-2 sm:gap-3 mt-10">
                {podium[1] && (
                    <PodiumStep
                        player={podium[1]}
                        rank={2}
                        height={'h-24 sm:h-32'}
                        position={2}
                    />
                )}
                {podium[0] && (
                    <PodiumStep
                        player={podium[0]}
                        rank={1}
                        height={'h-32 sm:h-44'}
                        position={1}
                        isCenter={true}
                    />
                )}
                {podium[2] && (
                    <PodiumStep
                        player={podium[2]}
                        rank={3}
                        height={'h-20 sm:h-24'}
                        position={3}
                    />
                )}
            </div>

            {/* Resto de jugadores */}
            {rest.length > 0 && (
                <div className="w-full max-w-2xl mt-6 space-y-2">
                    {rest.map((player, index) => (
                        <motion.div
                            key={player._id}
                            layout
                            transition={{ type: "spring", stiffness: 100, damping: 30 }}
                            className={`bg-leaderboard-row-hover relative rounded-md mb-1 w-full flex items-center text-xs sm:text-sm py-2`}>
                            <div className="w-2/12">
                                <div className="flex items-center justify-center">
                                    <span className="font-bold text-indigo-400 text-center w-9"># {index + (podium.length + 1)}</span>
                                </div>
                            </div>
                            <div className="pl-2 w-7/12">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={player.avatar}
                                        alt={player.username}
                                        className="size-8 rounded-full overflow-hidden bg-leaderboard-highlight flex-shrink-0 object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                                        }}
                                    />
                                    <span className={`font-medium`}>
                                        {player.username}
                                    </span>
                                </div>
                            </div>
                            <div className="px-4 font-mono font-medium w-3/12">
                                <span className="flex w-full text-right gap-3 text-yellow-400 font-bold items-center justify-end">
                                    {player.score.toLocaleString()}
                                    <TrophyIcon className="size-3 sm:size-4" />
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PodiumResults;