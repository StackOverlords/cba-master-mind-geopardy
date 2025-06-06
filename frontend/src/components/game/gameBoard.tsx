import { useEffect, useState } from "react"
import PlusIcon from "../ui/icons/plusIcon"
import TriangleIcon from "../ui/icons/triangleIcon"
import SquareIcon from "../ui/icons/squareIcon"
import CircleIcon from "../ui/icons/circleIcon"
import QuizzCard from "./quizzCard"
import QuizModal from "./quizzModal"
import type { ChampionShipPlayer } from "../../shared/types/ChampionShipGame"
import type { Category } from "../../shared/types/category"
import type { Question } from "../../shared/types/question"

interface ChampionShipCategory extends Omit<Category, "questionCount"> { }
interface Props {
    questions: Question[]
    categories: ChampionShipCategory[]
    currentPlayer: ChampionShipPlayer
    currentRound: number
    handleUpdatePlayers: () => void
    moveToNextPlayer: () => void
    moveToNextRound: () => void
}

type QuizzCardType = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    used: boolean
}

const GameBoard: React.FC<Props> = ({
    questions,
    categories,
    currentPlayer,
    currentRound,
    handleUpdatePlayers,
    moveToNextPlayer,
    moveToNextRound
}) => {
    const createCards = (categoryId: string): QuizzCardType[] => {
        const iconConfigs = [
            { icon: TriangleIcon, color: "text-rose-400" },
            { icon: SquareIcon, color: "text-yellow-400" },
            { icon: CircleIcon, color: "text-sky-400" },
            { icon: PlusIcon, color: "text-emerald-400" },
        ]

        return questions.filter((q) => q.categoryId === categoryId).map(() => {
            const randomIcon = iconConfigs[Math.floor(Math.random() * iconConfigs.length)]
            return {
                icon: randomIcon.icon,
                color: randomIcon.color,
                used: false,
            }
        })
    }
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
    const [usedQuestions, setUsedQuestions] = useState<Question[]>([])
    const [timeLeft, setTimeLeft] = useState(30)
    const [timerActive, setTimerActive] = useState(false)
    const [categoryCards, setCategoryCards] = useState<{ [key: string]: QuizzCardType[] }>(
        categories.reduce((acc, category) => {
            acc[category._id] = createCards(category._id);
            return acc;
        }, {} as { [key: string]: QuizzCardType[] })
    );
    // const totalQuestions = Object.values(questions).reduce(
    //     (total, categoryQuestions) => total + categoryQuestions.length,
    //     0,
    // )
    const handleCloseModal = () => {
        setIsModalOpen(false)
        // stopTimer()
    }
    const handleSuccessAnswered = (isCorrect: boolean) => {
        // setIsModalOpen(false)
        // stopTimer()
        if (isCorrect) {
            handleUpdatePlayers()
        }
        moveToNextPlayer()
        moveToNextRound()
    }
    useEffect(() => {
        let intervalId: NodeJS.Timeout

        if (timerActive && timeLeft > 0) {
            intervalId = setInterval(() => {
                setTimeLeft(timeLeft - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            handleTimeUp()
        }

        return () => clearInterval(intervalId)
    }, [timerActive, timeLeft])
    // const getCategoryNameById = async (id: number) => {
    //     return CATEGORIES.find(cat => cat.id === id)?.name
    // }

    const getRandomQuestion = (categoryId: string): Question | null => {
        const categoryQuestions = questions.filter((q) => q.categoryId === categoryId);
        const availableQuestions = categoryQuestions.filter(
            (q) => !usedQuestions.some((used) => used._id === q._id)
        );
        if (availableQuestions.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        return availableQuestions[randomIndex];
    };

    const handleCardClick = (categoryId: string, cardIndex: number) => {
        if (!categoryCards[categoryId][cardIndex].used) {
            const question = getRandomQuestion(categoryId);
            if (question) {
                setSelectedQuestion(question);
                setSelectedCategory(categoryId);
                setIsModalOpen(true);
                startTimer();
                markCardAsUsed(categoryId, cardIndex);
            }
        }
    };

    const startTimer = () => {
        setTimeLeft(30)
        setTimerActive(true)
    }

    const markCardAsUsed = (category: string, cardIndex: number) => {
        setCategoryCards((prevCategoryCards) => {
            const updatedCategoryCards = { ...prevCategoryCards }
            updatedCategoryCards[category] = prevCategoryCards[category].map((card, index) => {
                if (index === cardIndex) {
                    return { ...card, used: true }
                }
                return card
            })
            return updatedCategoryCards
        })
    }

    const handleAnswerSelected = (answerId: string, isCorrect: boolean) => {
        stopTimer()

        if (selectedQuestion) {
            setUsedQuestions((prev) => [...prev, selectedQuestion])
        }

        // if (isCorrect) {
        //     handleUpdatePlayers()
        // }
        // moveToNextPlayer()
        // moveToNextRound()
    }

    const handleTimeUp = () => {
        stopTimer()
        // setIsModalOpen(false)
        // moveToNextPlayer()
        // moveToNextRound()
    }

    const onTimeUp = () => {
        handleTimeUp()
    }

    const stopTimer = () => {
        setTimerActive(false)
    }

    // const moveToNextRound = () => {
    //     if (usedQuestions.length === totalQuestions) {
    //         if (currentRound < maxRounds) {
    //             setCurrentRound(currentRound + 1)
    //             setUsedQuestions([])
    //             resetCards()
    //         } else {
    //             // End Game
    //         }
    //     }
    // }

    const resetCards = () => {
        setCategoryCards((prevCategoryCards) => {
            const updatedCategoryCards: { [key: string]: QuizzCardType[] } = {}
            for (const category in prevCategoryCards) {
                updatedCategoryCards[category] = prevCategoryCards[category].map((card) => ({ ...card, used: false }))
            }
            return updatedCategoryCards
        })
    }
    useEffect(() => {
        console.log(categoryCards)
    }, [categoryCards])
    return (
        <div className="flex items-center justify-center space-y-8 gap-6 w-full">

            <div
                className={`grid gap-4 w-full`}
                style={{
                    gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
                }}
            >
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="flex flex-col gap-2 col-auto h-full w-full"
                    >
                        <div className="flex items-center justify-center p-2 rounded-md bg-indigo-950 border-indigo-400/50 border text-indigo-200 font-bold text-center text-xs sm:text-sm w-full h-full">
                            {category.name}
                        </div>
                        {categoryCards[category._id]?.map((card, cardIndex) => (
                            <div
                                key={`${category._id}-${cardIndex}`}
                                onClick={() => !card.used && handleCardClick(category._id, cardIndex)}
                                className={`cursor-pointer w-full ${card.used ? "opacity-50 cursor-not-allowed" : "hover:scale-101 transition-transform"
                                    }`}
                            >
                                <QuizzCard Icon={card.icon} color={card.color} used={card.used} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>


            {/* <button
                onClick={() => setCards(createCards())}
                className="px-6 py-2 rounded-lg bg-indigo-950 border-indigo-700 hover:bg-indigo-900 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100"
            >
                New Game
            </button> */}
            {
                isModalOpen && (
                    <QuizModal
                        currentPlayer={currentPlayer}
                        question={selectedQuestion ? selectedQuestion : null}
                        category={categories.find((c) => c._id === selectedCategory)?.name}
                        currentRound={currentRound}
                        isModalOpen={isModalOpen}
                        handleCloseModal={handleCloseModal}
                        onAnswerSelected={handleAnswerSelected}
                        onTimeUp={onTimeUp}
                        handleUpdatePlayers={handleSuccessAnswered}
                    />
                )
            }
        </div>
    )
}

export default GameBoard;