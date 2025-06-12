import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { CreateGameChampionShipDto } from "../../shared/types/game.dto";
import { useAuthStore } from "../../stores/authStore";
// import { useState } from "react";
interface Props {
    currentSlide: number;
    prevSlide: () => void;
    nextSlide: () => void;
}
const SlidePresetGames: React.FC<Props> = ({

}) => {
    const userId = useAuthStore((state) => state.user?._id)
    const preConfiguredGames: CreateGameChampionShipDto[] = [
        {
            name: 'Trivia Challenge',
            user: userId ? userId : '',
            status: 'playing',
            gameMode: 'championship',
            generateQuestions: true,
            playersLocal: [
                { username: 'Alice', score: 0, _id: Date.now().toString(), avatar: '', scoreTimestamp: 0 },
                { username: 'Bob', score: 0, _id: Date.now().toString(), avatar: '', scoreTimestamp: 0 },
                { username: 'Eve', score: 0, _id: Date.now().toString(), avatar: '', scoreTimestamp: 0 }
            ],
            categorys: ['History', 'Science'],
            rounds: 3,
            currentRound: 1,
            defaultTurnTime: 30
        },
        {
            name: 'Quiz Battle',
            user: userId ? userId : '',
            status: 'playing',
            gameMode: 'championship',
            generateQuestions: true,
            playersLocal: [
                { username: 'Charlie', score: 0, _id: Date.now().toString(), avatar: '', scoreTimestamp: 0 },
                { username: 'Juan', score: 0, _id: Date.now().toString(), avatar: '', scoreTimestamp: 0 },
                { username: 'Maria', score: 0, _id: Date.now().toString(), avatar: '', scoreTimestamp: 0 }
            ],
            categorys: ['Sports', 'Movies'],
            rounds: 5,
            currentRound: 1,
            defaultTurnTime: 25
        }
    ];
    console.log(preConfiguredGames)
    // const [currentSlide, setCurrentSlide] = useState(0)

    // const visibleGames = showAllGames ? preConfiguredGames : preConfiguredGames.slice(0, 5)


    const nextSlide = () => {
        // setCurrentSlide((prev) => (prev + 1) % Math.max(1, visibleGames.length - 2))
    }

    const prevSlide = () => {
        // setCurrentSlide((prev) => (prev - 1 + Math.max(1, visibleGames.length - 2)) % Math.max(1, visibleGames.length - 2))
    }
    return (
        <div className="relative">
            <div className="flex items-center space-x-4 overflow-hidden">
                <button
                    onClick={prevSlide}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex-1 overflow-hidden">
                    <motion.div
                        className="flex space-x-4"
                        // animate={{ x: -currentSlide * 320 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <AnimatePresence>
                            {/* {games.map((game, index) => (
                                <motion.article
                                    key={game.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex-shrink-0 w-80"
                                >
                                    <GameCard game={game} />
                                </motion.article>
                            ))} */}
                        </AnimatePresence>
                    </motion.div>
                </div>

                <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default SlidePresetGames;