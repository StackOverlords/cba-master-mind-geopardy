import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import XIcon from "../ui/icons/xIcon";
import TrophyIcon from "../ui/icons/trophyIcon";
import CheckIcon from "../ui/icons/checkIcon";
import ErrorIcon from "../ui/icons/errorIcon";
import useSound from "../../hooks/useSound";
import CorrectAnswerSound from "../../assets/sounds/mixkit-correct-answer-reward-952.wav"
import IncorrectAnswerSound from "../../assets/sounds/mixkit-wrong-answer-fail-notification-946.wav"
import CounterSound from "../../assets/sounds/25segundos.mp3"
import type { Answer, Question } from "../../shared/types/question";
import { Target, Trophy } from "lucide-react";
import { Timer } from "./timer";
import type { AnswerData, ChampionShipPlayer } from "../../shared/types/ChampionShipGame";
import confetti from "canvas-confetti";


type Props = {
    isModalOpen: boolean
    currentRound?: number
    question?: Question | null,
    category?: string | null,
    currentPlayer: ChampionShipPlayer
    time: number
    onAnswerSelected: (answerId: string, isCorrect: boolean) => void
    onTimeUp: () => void,
    handleCloseModal: () => void
    handleUpdatePlayers: (isCorrect: boolean, points: number) => void
    handlePlayerAnswered: (questionId: string, answerData: AnswerData) => void
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
    handleUpdatePlayers,
    handlePlayerAnswered,
    time
}) => {

    const [timeLeft, setTimeLeft] = useState<number>(time)
    const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [isStarted, setIsStarted] = useState(false)
    const [points, setPoints] = useState<number>(0)

    const { play: playCorrect, stop: stopCorrect } = useSound(CorrectAnswerSound)
    const { play: playIncorrect, stop: stopIncorrect } = useSound(IncorrectAnswerSound)
    const { play: playCounterSound, stop: stopCounterSound } = useSound(CounterSound)
    // Reset timer when modal opens
    useEffect(() => {
        if (isModalOpen) {
            setTimeLeft(time);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setIsStarted(false); // <- Nuevo
        }
    }, [isModalOpen]);

    const fireConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
        });
    };

    const [twoThirdsTime] = useState<number>(Math.floor(time * 0.66));

    const handleSuccessAnswered = () => {

        handleUpdatePlayers(!!selectedAnswer?.isCorrect || false, points);
        handleCloseModal();
    };

    // Countdown timer
    useEffect(() => {
        stopCounterSound();
        if (isModalOpen && !isAnswered && isStarted) {
            playCounterSound(time);
        }
    }, [isModalOpen, isAnswered, isStarted]);

    useEffect(() => {
        if (!isModalOpen || isAnswered || !isStarted) return;

        const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);

        if (timeLeft === 0) {
            onTimeUp();
            setIsAnswered(true);
            stopCorrect();
            playIncorrect();
            handlePlayerAnswered(question?._id || '', { answer: '', isCorrect: false });
        }

        return () => clearInterval(timer as NodeJS.Timeout);
    }, [timeLeft, isModalOpen, isAnswered, isStarted]);


    const handleAnswerClick = (answer: Answer, isCorrect: boolean) => {
        if (isAnswered) return
        stopCounterSound()
        if (isCorrect) {
            stopCorrect()
            playCorrect()
            fireConfetti()
            const round = currentRound || 1;

            const baseHigh = 100;
            const baseMid = 90;
            const baseLow = 80;
            const percentageIncrease = 0.10; // 10% extra por ronda

            const multiplier = Math.pow(1 + percentageIncrease, round - 1);

            const high = Math.round(baseHigh * multiplier);
            const mid = Math.round(baseMid * multiplier);
            const low = Math.round(baseLow * multiplier);

            let points = 0;

            if (timeLeft > twoThirdsTime) {
                points = high;
            } else if (timeLeft > 5) {
                points = mid;
            } else {
                points = low;
            }
            setPoints(points)
        }
        else {
            stopIncorrect()
            playIncorrect()
        }
        handlePlayerAnswered(question?._id || '', { answer: answer.text, isCorrect: answer.isCorrect })
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
    // const getTimerColor = () => {
    //     if (timeLeft > 20) return 'text-green-400 border-green-400';
    //     if (timeLeft > 5) return 'text-yellow-400 border-yellow-400';
    //     return 'text-red-400 border-red-400';
    // };

    // const getProgressColor = () => {
    //     if (timeLeft > 20) return 'bg-green-400';
    //     if (timeLeft > 5) return 'bg-yellow-400';
    //     return 'bg-red-400';
    // };
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
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50 ${isAnswered && !selectedAnswer || selectedAnswer?.isCorrect === false ? 'animate-flash-red' : ''}`}
                onClick={() => !isAnswered && closeModal()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="relative w-full max-w-3xl p-6 overflow-hidden rounded-xl
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
                        <div className="flex items-center gap-6">
                            {/* <img
                                src={currentPlayer.avatar || "/placeholder.svg"}
                                alt={currentPlayer.username}
                                className="size-16 rounded-full border-2 border-indigo-400"
                            /> */}
                            <Timer timeLeft={timeLeft} gameStatus="playing" time={time} />
                            <div className="w-full pr-10">
                                <div className="flex justify-between gap-2">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-linear-to-r from-purple-400/60 to-blue-400/60 transition-colors ease-in-out duration-300 hover:from-purple-400 hover:to-blue-400 text-white capitalize`}>
                                                {category || "Quiz"}
                                            </span>
                                            <Trophy className="w-4 h-4 text-yellow-400" />

                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Target className="size-4" />
                                            <p className="font-semibold">Round {currentRound}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 text-indigo-300">
                                        <img
                                            src={currentPlayer.avatar || "/placeholder.svg"}
                                            alt={currentPlayer.username}
                                            className="size-10 rounded-full border-2 border-indigo-400"
                                        />
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{currentPlayer.username}</h3>
                                            <p className="text-xs">Your turn</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Question */}
                        <div className="p-5 my-6">
                            <h2 className="text-3xl text-wrap text-center font-bold">{question?.question}</h2>
                        </div>

                        {/* Answers */}
                        {!isStarted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center gap-4"
                            >
                                <p className="text-indigo-200  font-medium text-center">Are you ready?</p>
                                <button
                                    className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-pink-500 rounded-md max-w-sm w-full cursor-pointer transition-all"
                                    onClick={() => setIsStarted(true)}
                                >
                                    Start
                                </button>
                            </motion.div>
                        )}
                        <AnimatePresence>
                            {isStarted && (
                                <motion.div
                                    key="question"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 gap-3 md:grid-cols-2"
                                >
                                    {question?.answers.map((answer, idx) => {
                                        const isSelected = selectedAnswer?._id === answer._id
                                        const isCorrect = answer.isCorrect
                                        const showCorrect = isAnswered && isCorrect
                                        const showIncorrect = isAnswered && isSelected && !isCorrect || (isAnswered && !selectedAnswer && !isCorrect)
                                        return (
                                            <motion.button
                                                key={idx}
                                                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                                                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                                className={`flex gap-3 relative cursor-pointer p-4 text-left rounded-lg border transition-colors
                                        ${getAnswerStyle(answer._id, answer.isCorrect)}`}
                                                onClick={() => handleAnswerClick(answer, answer.isCorrect)}
                                                disabled={isAnswered}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/5 to-white/7" />
                                                <div
                                                    className={`
                                                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                                                ${showCorrect ? "bg-emerald-500 text-white" : ""}
                                                ${showIncorrect ? "bg-red-500/70 text-white" : ""}
                                                ${!isAnswered ? "bg-indigo-600 text-indigo-200" : ""}
                                                ${isAnswered && !isSelected && !isCorrect ? "bg-indigo-800 text-white" : ""}
                                            `}
                                                >
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                                <span className="text-[#e0ddff] flex grow gap-4 justify-between items-center">
                                                    {answer.text}
                                                    {isAnswered && (
                                                        answer.isCorrect ? (
                                                            <CheckIcon className="size-5 text-emerald-300" />
                                                        ) : selectedAnswer?._id === answer._id ? (
                                                            <ErrorIcon className="size-5 text-red-400" />
                                                        ) : !selectedAnswer ? (
                                                            <ErrorIcon className="size-5 text-red-400" />
                                                        ) : null
                                                    )}
                                                </span>
                                            </motion.button>
                                        )
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>

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
                                            <span className="font-medium">{points} points</span>
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