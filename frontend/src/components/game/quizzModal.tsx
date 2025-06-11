import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import XIcon from "../ui/icons/xIcon";
import CheckIcon from "../ui/icons/checkIcon";
import ErrorIcon from "../ui/icons/errorIcon";
import useSound from "../../hooks/useSound";
import CorrectAnswerSound from "../../assets/sounds/mixkit-correct-answer-reward-952.wav"
import IncorrectAnswerSound from "../../assets/sounds/mixkit-wrong-answer-fail-notification-946.wav"
import CounterSound from "../../assets/sounds/25segundos.mp3"
import type { Answer, Question } from "../../shared/types/question";
import { Play, Target, Trophy, X } from "lucide-react";
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
    const [animatedPoints, setAnimatedPoints] = useState<number>(0);

    const { play: playCorrect, stop: stopCorrect } = useSound(CorrectAnswerSound)
    const { play: playIncorrect, stop: stopIncorrect } = useSound(IncorrectAnswerSound)
    const { play: playCounterSound, stop: stopCounterSound } = useSound(CounterSound)
    // Reset timer when modal opens
    useEffect(() => {
        if (isModalOpen) {
            setTimeLeft(time);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setIsStarted(false);

            const round = currentRound || 1;
            const baseHigh = 100;
            const percentageIncrease = 0.10;
            const multiplier = Math.pow(1 + percentageIncrease, round - 1);
            const high = Math.round(baseHigh * multiplier);

            setAnimatedPoints(high);
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
            setIsAnswered(true);
            stopCorrect();
            playIncorrect();
            handlePlayerAnswered(question?._id || '', { answer: '', isCorrect: false });
        }

        return () => clearInterval(timer as NodeJS.Timeout);
    }, [timeLeft, isModalOpen, isAnswered, isStarted]);

    useEffect(() => {
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
    }, [timeLeft])

    useEffect(() => {
        if (points === animatedPoints) return;

        const difference = points - animatedPoints;
        const increment = difference > 0 ? 1 : -1;

        const interval = setInterval(() => {
            setAnimatedPoints(prev => {
                const next = prev + increment;
                if ((increment > 0 && next >= points) || (increment < 0 && next <= points)) {
                    clearInterval(interval);
                    return points;
                }
                return next;
            });
        }, 80); // Velocidad de animación (puede ajustarse)

        return () => clearInterval(interval);
    }, [points, animatedPoints]);

    const handleAnswerClick = (answer: Answer, isCorrect: boolean) => {
        if (isAnswered) return
        stopCounterSound()
        if (isCorrect) {
            stopCorrect()
            playCorrect()
            fireConfetti()
        }
        else {
            stopIncorrect()
            playIncorrect()
        }
        handlePlayerAnswered(question?._id || '', { answer: answer.text, isCorrect: answer.isCorrect })
        setSelectedAnswer(answer)
        setIsAnswered(true)
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

    const closeModal = () => {
        stopCounterSound()
        handleCloseModal()
    }

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed mi-h-dvh inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50`}
                onClick={() => !isStarted && closeModal()}
            >

                <AnimatePresence>
                    {isAnswered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 0.9, 0, 0.9, 0, 0.7, 0, 0.5, 0],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 2.5,
                                ease: "easeInOut",
                                times: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.9, 1],
                            }}
                            className="absolute inset-0 pointer-events-none -m-2 p-2"
                        >
                            <div
                                className="w-full h-full"
                                style={{
                                    background: `linear-gradient(45deg, 
                                     ${selectedAnswer?.isCorrect
                                            ? "rgba(34,197,94,0.3), rgba(34,197,94,0.1), rgba(34,197,94,0.3)"
                                            : "rgba(239,68,68,0.3), rgba(239,68,68,0.1), rgba(239,68,68,0.3)"
                                        })`,
                                    boxShadow: `
                                      0 0 20px ${selectedAnswer?.isCorrect ? "rgba(34,197,94,0.6)" : "rgba(239,68,68,0.6)"},
                                       0 0 40px ${selectedAnswer?.isCorrect ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"},
                                         0 0 60px ${selectedAnswer?.isCorrect ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"},
                                           inset 0 0 20px ${selectedAnswer?.isCorrect ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"}
                                      `,
                                    border: `2px solid ${selectedAnswer?.isCorrect ? "rgba(34,197,94,0.8)" : "rgba(239,68,68,0.8)"}`,
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="relative w-full max-w-3xl p-6 overflow-y-auto rounded-xl
                        bg-gradient-to-br from-leaderboard-bg to-black backdrop-blur-sm 
                        border border-border/70 shadow-[0_0_15px_rgba(72,66,165,0.3)] max-h-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Glass overlay */}
                    <div className="absolute inset-0 bg-[#6f65ff]/5" />
                    <button
                        disabled={isStarted}
                        className={`p-1 rounded-md hover:bg-dashboard-border/50 transition-colors ease-in-out delay-100 absolute top-6 right-4 z-40 disabled:cursor-not-allowed`}
                        onClick={() => !isStarted && closeModal()}
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                    {/* Content */}
                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center gap-2 sm:gap-6 flex-wrap sm:flex-nowrap justify-center w-full">
                            {/* <img
                                src={currentPlayer.avatar || "/placeholder.svg"}
                                alt={currentPlayer.username}
                                className="size-16 rounded-full border-2 border-indigo-400"
                            /> */}
                            <Timer timeLeft={timeLeft} gameStatus="playing" time={time} />
                            <div className="w-full sm:pr-10">
                                <div className="flex justify-between gap-2 w-full">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`sm:px-3 px-1 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-linear-to-r transition-colors ease-in-out duration-300 from-purple-400 to-blue-400 text-white capitalize text-center`}>
                                                {category || "Quiz"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 text-xs sm:text-base">
                                            <div className="flex items-center gap-2">
                                                <Target className="size-4 hidden sm:block" />
                                                <p className="font-semibold">Round {currentRound}</p>
                                            </div>
                                            <div className="text-yellow-400 font-bold flex items-center gap-2 justify-center">
                                                <Trophy className="size-4" />
                                                <motion.span
                                                    key={animatedPoints}
                                                    className="inline-block"
                                                >
                                                    {animatedPoints}
                                                </motion.span>
                                                <span className="text-xs text-yellow-400 font-normal hidden sm:block">
                                                    pts if correct
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 text-indigo-300">
                                        <img
                                            src={currentPlayer.avatar || "/placeholder.svg"}
                                            alt={currentPlayer.username}
                                            className="size-10 rounded-full border-2 border-indigo-400"
                                        />
                                        <div>
                                            <h3 className="text-sm sm:text-xl font-bold text-white">{currentPlayer.username}</h3>
                                            <p className="text-[10px] sm:text-xs">Your turn</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Question */}
                        <div className={`my-6 ${isAnswered ? '' : 'py-5'}`}>
                            {/* Result Message - appears before question when answered */}
                            {
                                isAnswered && (
                                    <AnimatePresence>
                                        <motion.div
                                            initial={{ opacity: 0, height: "auto", scale: 0.5, marginBottom: 24 }}
                                            animate={{ opacity: 1, height: "auto", scale: 1, marginBottom: 24 }}
                                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                ease: "easeOut",
                                                scale: {
                                                    type: "spring",
                                                    damping: 15,
                                                    stiffness: 180,
                                                },
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div
                                                className={`relative rounded-xl p-3 border-2 backdrop-blur-sm shadow-lg
                                                    ${selectedAnswer?.isCorrect
                                                        ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-400/50"
                                                        : "bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-400/50"
                                                    }`}
                                            >
                                                <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
                                                    <div className="flex items-center gap-2 sm:gap-4">
                                                        <div
                                                            className={`p-2 sm:p-3 rounded-full ${selectedAnswer?.isCorrect ? "bg-emerald-500" : "bg-red-500/70"}`}
                                                        >
                                                            {selectedAnswer?.isCorrect ? (
                                                                <CheckIcon className="size-4 sm:size-6 text-white" />
                                                            ) : (
                                                                <X className="size-4 sm:size-6 text-white" />
                                                            )}
                                                        </div>

                                                        <div>
                                                            <h3
                                                                className={`text-lg sm:text-2xl font-bold ${selectedAnswer?.isCorrect ? "text-emerald-100" : "text-red-100"}`}
                                                            >
                                                                {selectedAnswer?.isCorrect ? "Correct Answer!" : "Incorrect Answer!"}
                                                            </h3>
                                                            <p className={`text-xs sm:text-sm ${selectedAnswer?.isCorrect ? "text-emerald-200" : "text-red-200"}`}>
                                                                {selectedAnswer?.isCorrect
                                                                    ? "Excellent work, keep it up"
                                                                    : "Don't worry, next time will be better"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {selectedAnswer?.isCorrect && (
                                                        <motion.div
                                                            initial={{ scale: 0, rotate: -180 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            transition={{ delay: 0.2, type: "spring", damping: 15 }}
                                                            className="flex items-center gap-2 rounded-full px-3 py-2 border border-yellow-400"
                                                        >
                                                            <Trophy className="size-4 sm:size-5 text-yellow-400" />
                                                            <div className="text-right">
                                                                <motion.p
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    transition={{ delay: 0.4 }}
                                                                    className="text-xs sm:text-sm font-bold text-yellow-400"
                                                                >
                                                                    +{points} pts
                                                                </motion.p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                {/* Decorative elements */}
                                                <div className="absolute top-2 right-2 opacity-20">
                                                    <div
                                                        className={`w-16 h-16 blur-xl rounded-full ${selectedAnswer?.isCorrect ? "bg-emerald-300" : "bg-red-300"}`}
                                                    />
                                                </div>
                                                <div className="absolute bottom-2 left-2 opacity-20">
                                                    <div
                                                        className={`w-12 h-12 blur-xl rounded-full ${selectedAnswer?.isCorrect ? "bg-emerald-300" : "bg-red-300"}`}
                                                    />
                                                </div>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex justify-center items-center mt-6"
                                                >
                                                    <button
                                                        className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-purple-400 to-blue-400 hover:brightness-110 transition-all rounded-md max-w-sm w-full cursor-pointer text-sm sm:text-lg flex items-center justify-center gap-3"
                                                        onClick={() => handleSuccessAnswered()}
                                                    >
                                                        Continue
                                                        <Play className="size-4 sm:size-5" />
                                                    </button>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                )
                            }

                            <h2 className="px-5 text-lg sm:text-3xl text-wrap text-center font-bold">{question?.question}</h2>
                        </div>

                        {/* Answers */}
                        {!isStarted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center gap-4"
                            >
                                <p className="text-indigo-200  font-medium text-center text-xs sm:text-base">Are you ready?</p>
                                <button
                                    className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-purple-400 to-blue-400 hover:brightness-110 transition-all rounded-md max-w-sm w-full cursor-pointer text-sm sm:text-lg flex items-center justify-center gap-3"
                                    onClick={() => setIsStarted(true)}
                                >
                                    <Play className="size-4 sm:size-6" />
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
                                                w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300
                                                ${showCorrect ? "bg-emerald-500 text-white" : ""}
                                                ${showIncorrect ? "bg-red-500/70 text-white" : ""}
                                                ${!isAnswered ? "bg-indigo-600 text-indigo-200" : ""}
                                                ${isAnswered && !isSelected && !isCorrect ? "bg-indigo-800 text-white" : ""}
                                            `}
                                                >
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                                <span className="text-white text-xs sm:text-base flex grow gap-4 justify-between items-center">
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
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default QuizModal;