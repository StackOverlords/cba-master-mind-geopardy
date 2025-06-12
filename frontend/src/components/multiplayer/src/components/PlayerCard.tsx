import { useEffect, useRef, useCallback } from "react"
import { ArrowRight, Crown, Target } from "lucide-react"
import { motion } from "framer-motion"
import type { Player } from '../types/game'

interface TurnIndicatorProps {
    players: Player[]
    currentPlayerId: any // Tu ID actual del jugador
}

const PlayerCard: React.FC<TurnIndicatorProps> = ({ players, currentPlayerId }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const currentPlayerRef = useRef<HTMLDivElement>(null)

    // Encontrar el índice del jugador actual
    const currentPlayerIndex = players.findIndex((p) => p.userId === currentPlayerId)

    const scrollToCurrentPlayer = useCallback(() => {
        if (!currentPlayerRef.current) return

        currentPlayerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        })
    }, [])

    useEffect(() => {
        const timeoutId = setTimeout(scrollToCurrentPlayer, 100)
        return () => clearTimeout(timeoutId)
    }, [currentPlayerIndex, scrollToCurrentPlayer])

    // Encontrar al jugador con mayor puntuación (líder)
    const topPlayer = players.reduce((prev, current) => {
        if (current.score > prev.score) return current
        if (current.score === prev.score) {
            // En caso de empate, podrías usar algún criterio de desempate
            // Por ahora mantenemos el primero encontrado
            return prev
        }
        return prev
    })

    return (
        <div className="flex items-center justify-center w-full mb-2">
            <div className="bg-indigo-950/80 rounded-lg px-4 py-3 border border-indigo-500/30 w-full shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <Target className="size-4 text-indigo-300" />
                        <p className="text-indigo-300 text-xs sm:text-sm font-medium">Turn Order</p>
                        <span className="text-indigo-400 text-xs">({players.length} players)</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-indigo-400">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span>Active Player</span>
                    </div>
                </div>

                {/* Container con scroll horizontal */}
                <div
                    ref={containerRef}
                    className={`overflow-x-auto p-2 flex items-center ${players.length <= 5 ? 'justify-center' : ''}`}
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(99, 102, 241, 0.5) rgba(30, 27, 75, 0.5)",
                    }}
                >
                    <div className="flex items-center space-x-3 w-max">
                        {players.map((player, index) => {
                            const isCurrent = index === currentPlayerIndex
                            const isTopPlayer = player.userId === topPlayer.userId
                            const isNext = index === (currentPlayerIndex + 1) % players.length
                            const isPrevious = index === (currentPlayerIndex - 1 + players.length) % players.length

                            return (
                                <div key={player.userId} className="flex items-center">
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
                                                className="relative w-max"
                                                animate={{
                                                    scale: isCurrent ? 1.15 : isNext || isPrevious ? 1.05 : 1,
                                                    y: isCurrent ? -6 : 0,
                                                }}
                                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                            >
                                                <img
                                                    src={player.avatar || "/placeholder.svg"}
                                                    alt={player?.username || `Player ${player.userId}`}
                                                    className={`
                                                        size-10 rounded-full border-3 transition-all duration-300
                                                        ${isCurrent
                                                            ? "border-yellow-400 ring-2 ring-yellow-400/30 shadow-lg shadow-yellow-400/20"
                                                            : isNext
                                                                ? "border-blue-400 ring-2 ring-blue-400/20"
                                                                : "border-indigo-600 opacity-70"
                                                        }
                                                    `}
                                                />
                                                
                                                {/* Indicador de pulso para jugador activo */}
                                                {isCurrent && (
                                                    <motion.div
                                                        className="absolute inset-0 rounded-full border-2 border-yellow-400"
                                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Información del jugador */}
                                        <div className="text-center min-w-0">
                                            <p className={`
                                                text-xs font-semibold truncate max-w-16 transition-colors duration-300
                                                ${isCurrent 
                                                    ? "text-yellow-300" 
                                                    : isNext || isPrevious 
                                                        ? "text-blue-300" 
                                                        : "text-indigo-400"
                                                }
                                            `}>
                                                {player?.username || `P${player.userId}`}
                                            </p>
                                            <p className={`
                                                text-xs font-bold transition-colors duration-300
                                                ${isCurrent 
                                                    ? "text-yellow-400" 
                                                    : isNext || isPrevious 
                                                        ? "text-blue-400" 
                                                        : "text-indigo-500"
                                                }
                                            `}>
                                                {player.score} pts
                                            </p>
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

export default PlayerCard

// ===== IMPLEMENTACIÓN =====
// Reemplaza tu código actual con:
{/*
<TurnIndicator 
    players={players}
    currentPlayerId={currentPlayerId}
/>
*/}