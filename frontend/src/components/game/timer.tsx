
import  { useState } from 'react';
import { motion } from 'framer-motion';
import { useSound } from '../multiplayer/src/hooks/useSound';
interface Props {
    gameStatus: string,
    timeLeft: number

}
export const Timer: React.FC<Props> = ({
    gameStatus,
    timeLeft
}) => {
    const { playTick } = useSound();

    const percentage = (timeLeft / 10) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const [twoThirdsTime] = useState<number>(Math.floor(timeLeft * 0.66))
    const getTimerColor = () => {
        if (timeLeft > twoThirdsTime) return '#10B981'; // Green
        if (timeLeft > 5) return '#F59E0B';  // Yellow
        return '#EF4444'; // Red
    };

    // const formatTime = (seconds: number) => {
    //     const mins = Math.floor(seconds / 60)
    //     const secs = seconds % 60
    //     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    // }
    return (
        <div className="relative">
            <motion.div
                className="relative size-18"
                animate={timeLeft <= 5 && timeLeft > 0 ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, repeat: timeLeft <= 5 && timeLeft > 0 ? Infinity : 0 }}
            >
                {/* Background circle */}
                <div className="absolute inset-0 size-18 bg-dashboard-bg rounded-full shadow-lg border-4 border-dashboard-border"></div>

                <svg className="size-18 transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-indigo-400"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke={getTimerColor()}
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.5 }}
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                        className="text-xl font-bold text-gray-900 dark:text-white"
                        animate={timeLeft <= 5 ? { color: '#EF4444' } : {}}
                    >
                        {timeLeft}
                    </motion.span>
                </div>
            </motion.div>
        </div>
    );
};
