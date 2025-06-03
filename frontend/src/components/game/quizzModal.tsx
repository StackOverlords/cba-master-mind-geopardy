import { AnimatePresence, motion } from "motion/react";
import type { Question } from "../../shared/types";
import { useEffect, useState } from "react";
import XIcon from "../ui/icons/xIcon";
import TrophyIcon from "../ui/icons/trophyIcon";
import CheckIcon from "../ui/icons/checkIcon";
import ErrorIcon from "../ui/icons/errorIcon";
import useSound from "../../hooks/useSound";
import CorrectAnswerSound from "../../assets/sounds/mixkit-correct-answer-reward-952.wav"
import IncorrectAnswerSound from "../../assets/sounds/mixkit-wrong-answer-fail-notification-946.wav"
import CounterSound from "../../assets/sounds/25segundos.mp3"
import type { Answer } from "../../shared/types/question";
import { Clock, Target, Trophy } from "lucide-react";
import type { Player } from "../../shared/types/game";
import { Timer } from "./timer";

type Props = {
    isModalOpen: boolean
    currentRound?: number
    question?: Question | null,
    category?: string | null,
    currentPlayer: Player
    onAnswerSelected: (answerId: string, isCorrect: boolean) => void
    onTimeUp: () => void,
    handleCloseModal: () => void
    handleUpdatePlayers: (isCorrect: boolean) => void
}

const QuizModal: React.FC<Props> = ({
    isModalOpen,
    currentRound,
    question,
    category,
    currentPlayer,
    onAnswerSelected,
    onTimeUp,
    handleCloseModal,
    handleUpdatePlayers
}) => {

    const [timeLeft, setTimeLeft] = useState<number>(10)
    const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)

    const { play: playCorrect, stop: stopCorrect } = useSound(CorrectAnswerSound)
    const { play: playIncorrect, stop: stopIncorrect } = useSound(IncorrectAnswerSound)
    const { play: playCounterSound, stop: stopCounterSound } = useSound(CounterSound)
    // Reset timer when modal opens
    useEffect(() => {
        if (isModalOpen) {
            setTimeLeft(10)
            setSelectedAnswer(null)
            setIsAnswered(false)
        }
    }, [isModalOpen])

    const handleSuccessAnswered = () => {
        handleUpdatePlayers(!!selectedAnswer?.isCorrect || false)
        handleCloseModal()
    }
    // Countdown timer
    useEffect(() => {
        stopCounterSound()
        if (isModalOpen && !isAnswered) playCounterSound(10)
    }, [isModalOpen, isAnswered])

    useEffect(() => {
        if (!isModalOpen || isAnswered) return

        const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000)

        if (timeLeft === 0) {
            onTimeUp()
            setIsAnswered(true)
            stopCorrect()
            playIncorrect()
        }

        return () => clearInterval(timer as NodeJS.Timeout)
    }, [timeLeft, isModalOpen, isAnswered, onTimeUp])

    const handleAnswerClick = (answer: Answer, isCorrect: boolean) => {
        if (isAnswered) return
        stopCounterSound()
        if (isCorrect) {
            stopCorrect()
            playCorrect()
        }
        else {
            stopIncorrect()
            playIncorrect()
        }

        setSelectedAnswer(answer)
        setIsAnswered(true)
        onAnswerSelected(answer._id, isCorrect)
    }

    const getAnswerStyle = (answerId: string, isCorrect: boolean) => {
        if (isAnswered && isCorrect) {
            return "bg-green-300/40 border-green-400 text-green-100"
        }
        if (isAnswered && !selectedAnswer) return "bg-red-400/40 border-red-400 text-red-100"

        if (!isAnswered || selectedAnswer?._id !== answerId) {
            return "transition-all duration-300 border-indigo-400/50 bg-indigo-900/60 border rounded-lg hover:bg-indigo-800/80"
        }

        return isCorrect ? "bg-green-300/40 border-green-400 text-green-100" : "bg-red-400/40 border-red-400 text-red-100"
    }
    const getTimerColor = () => {
        if (timeLeft > 20) return 'text-green-400 border-green-400';
        if (timeLeft > 5) return 'text-yellow-400 border-yellow-400';
        return 'text-red-400 border-red-400';
    };

    const getProgressColor = () => {
        if (timeLeft > 20) return 'bg-green-400';
        if (timeLeft > 5) return 'bg-yellow-400';
        return 'bg-red-400';
    };
    const closeModal = () => {
        stopCounterSound()
        handleCloseModal()
    }
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
                onClick={() => !isAnswered && closeModal()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="relative w-full max-w-2xl p-6 overflow-hidden rounded-xl
                        bg-gradient-to-br from-leaderboard-bg/60 to-black/30 backdrop-blur-sm 
                        border border-border/70 shadow-[0_0_15px_rgba(72,66,165,0.3)]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Glass overlay */}
                    <div className="absolute inset-0 bg-[#6f65ff]/5" />
                    <button
                        disabled={isAnswered}
                        className={`p-1 rounded-md hover:bg-dashboard-border/50 transition-colors ease-in-out delay-100 absolute top-6 right-4 z-40 disabled:cursor-not-allowed`}
                        onClick={() => !isAnswered && closeModal()}
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                    {/* Content */}
                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center gap-4">
                            <img
                                src={currentPlayer.avatar || "/placeholder.svg"}
                                alt={currentPlayer.username}
                                className="size-16 rounded-full border-2 border-indigo-400"
                            />
                            <div className="w-full pr-10">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-linear-to-r from-purple-400 to-blue-400 text-white capitalize`}>
                                            {category || "Quiz"}
                                        </span>
                                        <Trophy className="w-4 h-4 text-yellow-400" />
                                    </div>
                                    <div className="flex items-center gap-2 text-indigo-300">
                                        <Target className="size-4" />
                                        <p className="font-semibold">Round {currentRound}</p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white">{currentPlayer.username}</h3>
                            </div>
                        </div>

                        <Timer timeLeft={timeLeft} gameStatus="playing" />
                        {/* Question */}
                        <div className="p-5 mb-6">
                            <h2 className="text-3xl text-wrap text-center font-bold">{question?.text}</h2>
                        </div>

                        {/* Answers */}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {question?.answers.map((answer, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                    className={`relative cursor-pointer p-4 text-left rounded-lg border transition-colors
                                ${getAnswerStyle(answer._id, answer.isCorrect)}`}
                                    onClick={() => handleAnswerClick(answer, answer.isCorrect)}
                                    disabled={isAnswered}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/5 to-white/7" />
                                    <span className="text-[#e0ddff] flex gap-4 justify-between items-center">
                                        {answer.text}
                                        {isAnswered && (
                                            answer.isCorrect ? (
                                                <CheckIcon className="size-5" />
                                            ) : selectedAnswer?._id === answer._id ? (
                                                <ErrorIcon className="size-5" />
                                            ) : !selectedAnswer ? (
                                                <ErrorIcon className="size-5" />
                                            ) : null
                                        )}
                                    </span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Footer - shows after answering */}
                        {isAnswered && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-between mt-6"
                            >
                                <div className="flex items-center">
                                    {selectedAnswer && selectedAnswer.isCorrect && (
                                        <div className="flex items-center text-yellow-400">
                                            <TrophyIcon className="w-5 h-5 mr-2" />
                                            <span className="font-medium">+100 points</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="flex items-center justify-center p-2 rounded-md bg-indigo-950 border-indigo-400/50 border text-indigo-200 font-bold text-center text-xs sm:text-sm w-18 sm:w-24"
                                    onClick={() => handleSuccessAnswered()}
                                >
                                    Continue
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default QuizModal;