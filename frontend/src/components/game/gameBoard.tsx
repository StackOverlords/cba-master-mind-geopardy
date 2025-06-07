import { useEffect, useState } from "react"
import PlusIcon from "../ui/icons/plusIcon"
import TriangleIcon from "../ui/icons/triangleIcon"
import SquareIcon from "../ui/icons/squareIcon"
import CircleIcon from "../ui/icons/circleIcon"
import QuizzCard from "./quizzCard"
import QuizModal from "./quizzModal"
import type { AnswerData, ChampionShipPlayer, QuestionsAnswered } from "../../shared/types/ChampionShipGame"
import type { Category } from "../../shared/types/category"
import type { Question } from "../../shared/types/question"

interface ChampionShipCategory extends Omit<Category, "questionCount"> { }
interface Props {
    questions: Question[]
    categories: ChampionShipCategory[]
    currentPlayer: ChampionShipPlayer
    currentRound: number
    questionsAnswered: QuestionsAnswered[],
    time: number,
    handleUpdatePlayers: (isCorrect: boolean, points: number) => void
    moveToNextPlayer: () => void
    moveToNextRound: () => void
    hasUpdatedPlayers: () => void
    handlePlayerAnswered: (questionId: string, answerData: AnswerData) => void
}

type QuizzCardType = {
    question: Question;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    used: boolean;
};

const GameBoard: React.FC<Props> = ({
    questions,
    categories,
    currentPlayer,
    currentRound,
    questionsAnswered,
    handleUpdatePlayers,
    moveToNextPlayer,
    moveToNextRound,
    hasUpdatedPlayers,
    handlePlayerAnswered,
    time
}) => {
    const [categoryCards, setCategoryCards] = useState<{ [key: string]: QuizzCardType[] }>({});

    useEffect(() => {
        const iconConfigs = [
            { icon: TriangleIcon, color: "text-rose-400" },
            { icon: SquareIcon, color: "text-yellow-400" },
            { icon: CircleIcon, color: "text-sky-400" },
            { icon: PlusIcon, color: "text-emerald-400" },
        ];

        const shuffled = (arr: Question[]) =>
            [...arr].sort(() => Math.random() - 0.5);

        const initCards = categories.reduce((acc, category) => {
            const categoryQuestions = shuffled(questions.filter(q => q.categoryId === category._id));

            acc[category._id] = categoryQuestions.map((q) => {
                const randomIcon = iconConfigs[Math.floor(Math.random() * iconConfigs.length)];
                return {
                    question: q,
                    icon: randomIcon.icon,
                    color: randomIcon.color,
                    used: false,
                };
            });
            return acc;
        }, {} as { [key: string]: QuizzCardType[] });

        setCategoryCards(initCards);
    }, [questions, categories]);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
    // const [usedQuestions, setUsedQuestions] = useState<Question[]>([])
    const [timeLeft, setTimeLeft] = useState(time)
    const [timerActive, setTimerActive] = useState(false)
    // const [categoryCards, setCategoryCards] = useState<{ [key: string]: QuizzCardType[] }>(
    //     categories.reduce((acc, category) => {
    //         acc[category._id] = createCards(category._id);
    //         return acc;
    //     }, {} as { [key: string]: QuizzCardType[] })
    // );
    // const totalQuestions = Object.values(questions).reduce(
    //     (total, categoryQuestions) => total + categoryQuestions.length,
    //     0,
    // )
    const handleCloseModal = () => {
        setIsModalOpen(false)
        // stopTimer()
    }
    const handleSuccessAnswered = (isCorrect: boolean, points: number) => {
        // setIsModalOpen(false)
        // stopTimer()
        handleUpdatePlayers(isCorrect, points)
        moveToNextPlayer()
        moveToNextRound()
        hasUpdatedPlayers()
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

    const handleCardClick = (categoryId: string, cardIndex: number) => {
        const card = categoryCards[categoryId][cardIndex];
        if (!card.used) {
            setSelectedQuestion(card.question);
            setSelectedCategory(categoryId);
            setIsModalOpen(true);
            startTimer();
        }
    };


    const startTimer = () => {
        setTimeLeft(30)
        setTimerActive(true)
    }

    const handleAnswerSelected = (answerId: string, isCorrect: boolean) => {
        console.log(answerId, isCorrect)
        // stopTimer()

        // if (selectedQuestion) {
        //     setUsedQuestions((prev) => [...prev, selectedQuestion])
        // }

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
                                onClick={() => !questionsAnswered.find((q) => q.questionId === card.question._id) && handleCardClick(category._id, cardIndex)}
                                className={` w-full ${questionsAnswered.some(q => q.questionId === card.question._id)
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:scale-105 transition-transform cursor-pointer"
                                    }`}
                            >
                                <QuizzCard Icon={card.icon} color={card.color} />
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
                        time={time}
                        handlePlayerAnswered={handlePlayerAnswered}
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