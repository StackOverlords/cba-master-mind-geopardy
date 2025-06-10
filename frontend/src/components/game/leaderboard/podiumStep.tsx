import { motion } from "motion/react";
import type { ChampionShipPlayer } from "../../../shared/types/ChampionShipGame";
import PositionBadge from "./positionBadge";

interface Props {
    rank: number,
    height: string,
    position: number,
    isCenter?: boolean,
    player: ChampionShipPlayer
}
const PodiumStep: React.FC<Props> = ({
    rank,
    height,
    position,
    isCenter,
    player
}) => {

    return (
        <article>
            <motion.div
                className="flex flex-col items-center z-30 relative"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <div className="relative mb-4">
                    <img
                        src={player.avatar || "/placeholder.svg"}
                        alt={player.username}
                        className={`${isCenter ? "size-16 sm:size-20" : "size-12 sm:size-16"} rounded-full border-4 ${position === 1 ? "border-leaderboard-gold/70" : position === 2 ? "border-leaderboard-silver/70" : "border-leaderboard-bronze/70"
                            } shadow-2xl`}
                    />
                    <div
                        className={`absolute -z-10 inset-0 rounded-full blur-lg opacity-40 ${position === 1 ? "bg-leaderboard-gold" : position === 2 ? "bg-leaderboard-silver" : "bg-leaderboard-bronze"
                            }`}
                    />
                </div>

                <h3 className="text-white font-bold text-lg text-wrap sm:text-xl mb-1 text-center drop-shadow-lg">{player.username}</h3>

                <p className="text-slate-300 text-xs mb-4 drop-shadow">Earn {player.score} points</p>
            </motion.div>

            <div className="relative w-24 sm:w-40 md:w-56 -mt-8" style={{ perspective: "200px" }}>
                <div
                    className={`
                w-full h-20 shadow-xl relative z-10 bg-gradient-to-b from-[#1c1f2c] to-[#131724]`}
                    style={{
                        transform: "rotateX(50deg)",
                        transformOrigin: "bottom center",
                        transformStyle: "preserve-3d",
                    }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        {/* <span className={`text-xl font-bold opacity-70 ${'text-gaming-diamond'}`}>
                    {1}
                </span> */}
                        <div
                            className={`absolute -z-10 inset-0 m-3 rounded-full blur-lg opacity-40 ${position === 1 ? "bg-leaderboard-gold/50" : position === 2 ? "bg-leaderboard-silver/50" : "bg-leaderboard-bronze/50"
                                }`}
                        />
                    </div>
                </div>

                <div
                    className={`
                 w-full ${height} bg-gradient-to-b from-[#1c1f2c] to-[#131724] shadow-xl relative mask-b-from-20% mask-b-to-80% `}
                    style={{
                        marginTop: "-1px"
                    }}
                >
                    <div className="absolute inset-0 flex p-2 justify-center">
                        <span className={`text-8xl font-bold opacity-80 ${position === 1 ? "text-leaderboard-gold" : position === 2 ? "text-leaderboard-silver" : "text-leaderboard-bronze"}`}>
                            <PositionBadge position={rank} size="sm:size-20 size-14" />
                        </span>
                        <div
                            className={`absolute -z-10 inset-0 rounded-full blur-lg opacity-40 ${position === 1 ? "bg-leaderboard-gold/50" : position === 2 ? "bg-leaderboard-silver/50" : "bg-leaderboard-bronze/50"
                                }`}
                        />
                    </div>
                </div>
            </div>
        </article>
    );
}

export default PodiumStep;