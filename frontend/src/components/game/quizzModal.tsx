import { AnimatePresence, motion } from "motion/react";
import type { Question } from "../../shared/types";
import { useEffect, useState } from "react";
import ClockIcon from "../ui/icons/clockIcon";
import XIcon from "../ui/icons/xIcon";
import TrophyIcon from "../ui/icons/trophyIcon";
import CheckIcon from "../ui/icons/checkIcon";
import ErrorIcon from "../ui/icons/errorIcon";
import useSound from "../../hooks/useSound";
import CorrectAnswerSound from "../../assets/sounds/mixkit-correct-answer-reward-952.wav"
import IncorrectAnswerSound from "../../assets/sounds/mixkit-wrong-answer-fail-notification-946.wav"
import CounterSound from "../../assets/sounds/25segundos.mp3"

type Props = {
    isModalOpen: boolean
    playerName?: string
    currentRound?: number
    question?: Question | null,
    category?: string | null,
    onAnswerSelected: (answerId: string, isCorrect: boolean) => void
    onTimeUp: () => void,
    handleCloseModal: () => void
}

const QuizModal: React.FC<Props> = ({
    isModalOpen,
    playerName,
    currentRound,
    question,
    category,
    onAnswerSelected,
    onTimeUp,
    handleCloseModal
}) => {

    const [timeLeft, setTimeLeft] = useState(10)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)

    const { play: playCorrect, stop: stopCorrect } = useSound(CorrectAnswerSound)
    const { play: playIncorrect, stop: stopIncorrect } = useSound(IncorrectAnswerSound)
    const { play: playCounterSound, stop: stopCounterSound } = useSound(CounterSound, timeLeft)
    // Reset timer when modal opens
    useEffect(() => {
        if (isModalOpen) {
            setTimeLeft(10)
            setSelectedAnswer(null)
            setIsAnswered(false)
        }
    }, [isModalOpen])

    // Countdown timer
    useEffect(() => {
        stopCounterSound()
        if (isModalOpen && !isAnswered) playCounterSound()
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

    const handleAnswerClick = (answerId: string, isCorrect: boolean) => {
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

        setSelectedAnswer(answerId)
        setIsAnswered(true)
        onAnswerSelected(answerId, isCorrect)
    }

    const getAnswerStyle = (answerId: string, isCorrect: boolean) => {
        if (isAnswered && isCorrect) {
            return "bg-green-300/40 border-green-400 text-green-100"
        }
        if (isAnswered && !selectedAnswer) return "bg-red-400/40 border-red-400 text-red-100"

        if (!isAnswered || selectedAnswer !== answerId) {
            return "transition-all duration-300 border-indigo-400/50 bg-indigo-900/60 border rounded-lg hover:bg-indigo-800/80"
        }

        return isCorrect ? "bg-green-300/40 border-green-400 text-green-100" : "bg-red-400/40 border-red-400 text-red-100"
    }

    return (
        <AnimatePresence>
            {isModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
                    onClick={() => !isAnswered && handleCloseModal()}
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

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="px-3 py-1 mb-2 text-sm font-medium rounded-md w-fit bg-linear-to-br from-purple-400/50 to-blue-400/50">
                                        {category || "Quiz"}
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#e0ddff]">Round {currentRound}</h3>
                                    <p className="text-[#a5a0ff]">{playerName}</p>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div
                                        className={`flex items-center px-3 py-1 rounded-full 
                                  ${timeLeft <= 5 ? "bg-pink-500/20 text-pink-100" : "bg-[#3d3693]/50 text-[#a5a0ff]"}`}
                                    >
                                        <ClockIcon className="w-4 h-4 mr-2" />
                                        <span className="font-mono font-medium">{timeLeft}s</span>
                                    </div>

                                    <button
                                        //   variant="ghost"
                                        //   size="icon"
                                        className="text-[#a5a0ff] hover:text-[#e0ddff] hover:bg-[#3d3693]/50"
                                        onClick={() => handleCloseModal()}
                                    >
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Question */}
                            <div className="p-5 mb-6">
                                <h2 className="text-3xl text-wrap text-center font-bold">{question?.text}</h2>
                            </div>

                            {/* Answers */}
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {question?.answers.map((answer) => (
                                    <motion.button
                                        key={answer.id}
                                        whileHover={!isAnswered ? { scale: 1.02 } : {}}
                                        whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                        className={`relative cursor-pointer p-4 text-left rounded-lg border transition-colors
                                ${getAnswerStyle(answer.id, answer.isCorrect)}`}
                                        onClick={() => handleAnswerClick(answer.id, answer.isCorrect)}
                                        disabled={isAnswered}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/5 to-white/7" />
                                        <span className="text-[#e0ddff] flex gap-4 justify-between items-center">
                                            {answer.text}
                                            {isAnswered && (
                                                answer.isCorrect ? (
                                                    <CheckIcon className="size-5" />
                                                ) : selectedAnswer === answer.id ? (
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
                                        {selectedAnswer && question?.answers.find((a) => a.id === selectedAnswer)?.isCorrect && (
                                            <div className="flex items-center text-yellow-400">
                                                <TrophyIcon className="w-5 h-5 mr-2" />
                                                <span className="font-medium">+100 points</span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="flex items-center justify-center p-2 rounded-md bg-indigo-950 border-indigo-400/50 border text-indigo-200 font-bold text-center text-xs sm:text-sm w-18 sm:w-24"
                                        onClick={() => handleCloseModal()}
                                    >
                                        Continue
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default QuizModal;