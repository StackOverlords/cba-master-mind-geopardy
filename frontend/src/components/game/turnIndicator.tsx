import { useEffect, useRef, useCallback } from "react"
import { ArrowRight, Crown } from "lucide-react"
import { motion } from "framer-motion"
import type { ChampionShipPlayer } from "../../shared/types/ChampionShipGame"
interface GamePlayer extends ChampionShipPlayer {
    scoreTimestamp?: number
}
interface TurnIndicatorProps {
    players: GamePlayer[]
    currentPlayerIndex: number
}

const TurnIndicator: React.FC<TurnIndicatorProps> = ({ players, currentPlayerIndex }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const currentPlayerRef = useRef<HTMLDivElement>(null)

    const scrollToCurrentPlayer = useCallback(() => {
        if (!currentPlayerRef.current) return
      
        currentPlayerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center", // esto centrará el jugador horizontalmente
        })
      }, [])
      

    useEffect(() => {
        const timeoutId = setTimeout(scrollToCurrentPlayer, 100)
        return () => clearTimeout(timeoutId)
    }, [currentPlayerIndex, scrollToCurrentPlayer])

    const topPlayer = players.reduce((prev, current) => {
        if (current.score > prev.score) return current;

        if (current.score === prev.score) {
            const prevTimestamp = prev.scoreTimestamp ?? Infinity;
            const currentTimestamp = current.scoreTimestamp ?? Infinity;

            return currentTimestamp < prevTimestamp ? current : prev;
        }

        return prev;
    });


    return (
        <div className="flex items-center justify-center w-full mb-4">
            <div className="bg-indigo-950/80 rounded-lg px-4 py-2 border border-indigo-500/30 w-full shadow-lg">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-indigo-300 text-sm font-medium">Turn Order</p>
                    <div className="flex items-center space-x-2 text-xs text-indigo-400">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span>Current Player</span>
                    </div>
                </div>

                {/* Container con scroll horizontal */}
                <div
                    ref={containerRef}
                    className="overflow-x-auto p-2 flex justify-center items-center"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(99, 102, 241, 0.5) rgba(30, 27, 75, 0.5)",
                    }}
                >
                    <div className="flex items-center space-x-3 w-max">
                        {players.map((player, index) => {
                            const isCurrent = index === currentPlayerIndex
                            const isTopPlayer = player._id === topPlayer._id
                            const isNext = index === (currentPlayerIndex + 1) % players.length
                            const isPrevious = index === (currentPlayerIndex - 1 + players.length) % players.length

                            return (
                                <div key={player._id} className="flex items-center">
                                    <motion.div
                                        layout
                                        ref={isCurrent ? currentPlayerRef : null}
                                        className="relative flex flex-col items-center space-y-2 min-w-0"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    >
                                        {/* Indicador de posición */}
                                        <div className="relative">
                                            {/* Corona para el líder */}
                                            {isTopPlayer && topPlayer.score > 0 && (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    className="absolute -top-2 -right-1 z-20"
                                                >
                                                    <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                </motion.div>
                                            )}

                                            {/* Avatar del jugador */}
                                            <motion.div
                                                className="relative"
                                                animate={{
                                                    scale: isCurrent ? 1.1 : isNext || isPrevious ? 1.05 : 1,
                                                    y: isCurrent ? -4 : 0,
                                                }}
                                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                            >
                                                <img
                                                    src={player.avatar || "/placeholder.svg"}
                                                    alt={player.username}
                                                    className={`
                                                        size-8 rounded-full border-3 transition-all duration-300
                                                        ${isCurrent
                                                            ? "border-yellow-400 ring-2 ring-yellow-400/30 shadow-lg shadow-yellow-400/20"
                                                            : isNext
                                                                ? "border-blue-400 ring-2 ring-blue-400/20"
                                                                : "border-indigo-600 opacity-70"
                                                        }
                                                        `}
                                                />
                                            </motion.div>
                                        </div>

                                    </motion.div>

                                    {/* Flecha separadora */}
                                    {index < players.length - 1 && (
                                        <motion.div
                                            className="mx-2 flex-shrink-0"
                                            animate={{
                                                x: isCurrent ? 2 : 0,
                                                scale: isCurrent ? 1.1 : 1,
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        >
                                            <ArrowRight
                                                className={`
                          w-4 h-4 transition-colors duration-300
                          ${isCurrent ? "text-yellow-400" : "text-indigo-400"}
                        `}
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TurnIndicator
