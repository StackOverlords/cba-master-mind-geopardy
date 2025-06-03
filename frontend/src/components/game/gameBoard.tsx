import { useEffect, useState } from "react"
import PlusIcon from "../ui/icons/plusIcon"
import TriangleIcon from "../ui/icons/triangleIcon"
import SquareIcon from "../ui/icons/squareIcon"
import CircleIcon from "../ui/icons/circleIcon"
import QuizzCard from "./quizzCard"
import type { Question } from "../../shared/types"
import QuizModal from "./quizzModal"
import type { Player } from "../../shared/types/game"
interface Props {
    questions: {
        science: Question[]
        history: Question[]
        geography: Question[]
        sports: Question[]
        art: Question[]
    }
    currentPlayer: Player
    currentRound:number
    handleUpdatePlayers: () => void
    moveToNextPlayer: () => void
    moveToNextRound:()=>void
}
type Category = {
    id: number;
    name: string;
}

type QuizzCardType = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    used: boolean
}

const CATEGORIES: Category[] = [
    { id: 1, name: "Science" },
    { id: 2, name: "History" },
    { id: 3, name: "Geography" },
    { id: 4, name: "Sports" },
    { id: 5, name: "Art" },
];


const createCards = (category: string): QuizzCardType[] => {
    const iconConfigs = [
        { icon: TriangleIcon, color: "text-rose-400" },
        { icon: SquareIcon, color: "text-yellow-400" },
        { icon: CircleIcon, color: "text-sky-400" },
        { icon: PlusIcon, color: "text-emerald-400" },
    ]

    return Array.from({ length: 5 }, (_, i) => {
        const randomIcon = iconConfigs[Math.floor(Math.random() * iconConfigs.length)]
        return {
            icon: randomIcon.icon,
            color: randomIcon.color,
            used: false,
        }
    })
}


const GameBoard: React.FC<Props> = ({
    questions,
    currentPlayer,
    currentRound,
    handleUpdatePlayers,
    moveToNextPlayer,
    moveToNextRound
}) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
    const [usedQuestions, setUsedQuestions] = useState<Question[]>([])
    const [timeLeft, setTimeLeft] = useState(30)
    const [timerActive, setTimerActive] = useState(false)
    const [categoryCards, setCategoryCards] = useState<{ [key: string]: QuizzCardType[] }>({
        science: createCards("science"),
        history: createCards("history"),
        geography: createCards("geography"),
        sports: createCards("sports"),
        art: createCards("art"),
    })
    const totalQuestions = Object.values(questions).reduce(
        (total, categoryQuestions) => total + categoryQuestions.length,
        0,
    )
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

    const getRandomQuestion = (category: keyof typeof questions): Question | null => {
        const availableQuestions = questions[category].filter(
            (question) => !usedQuestions.some((used) => used.id === question.id),
        )
        if (availableQuestions.length === 0) return null
        const randomIndex = Math.floor(Math.random() * availableQuestions.length)
        return availableQuestions[randomIndex]
    }

    const handleCardClick = (category: string, cardIndex: number) => {
        if (!categoryCards[category][cardIndex].used) {
            const question = getRandomQuestion(category as keyof typeof questions)
            if (question) {
                setSelectedQuestion(question)
                setSelectedCategory(category)
                setIsModalOpen(true)
                startTimer()
                markCardAsUsed(category, cardIndex)
            }
        }
    }

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

    return (
        <div className="flex items-center justify-center space-y-8 gap-6">

            <div className="grid grid-cols-5 gap-2">
                {/* Categories Header */}
                {CATEGORIES.map(category => (
                    <div key={category.id} className="flex flex-col gap-2">
                        <div
                            className="flex items-center justify-center p-2 rounded-md bg-indigo-950 border-indigo-400/50 border text-indigo-200 font-bold text-center text-xs sm:text-sm w-18 sm:w-auto"
                        >
                            {category.name}
                        </div>
                        {categoryCards[category.name.toLowerCase()]?.map((card, cardIndex) => (
                            <div
                                key={`${category.id}-${cardIndex}`}
                                onClick={() => !card.used && handleCardClick(category.name.toLowerCase(), cardIndex)}
                                className={`cursor-pointer ${card.used ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition-transform"}`}
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
                        question={selectedQuestion}
                        category={selectedCategory}
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