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
import { AnimatePresence, motion } from "motion/react"

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
    const ROWS_PER_CATEGORY = 4
    // Estado para las preguntas visibles y no visibles por categoría
    const [visibleQuestions, setVisibleQuestions] = useState<{ [categoryId: string]: QuizzCardType[] }>({})
    const [hiddenQuestions, setHiddenQuestions] = useState<{ [categoryId: string]: QuizzCardType[] }>({})
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

    const createCards = () => {
        if (questions.length === 0 || categories.length === 0) return;
        const iconConfigs = [
            { icon: TriangleIcon, color: "text-rose-400" },
            { icon: SquareIcon, color: "text-yellow-400" },
            { icon: CircleIcon, color: "text-sky-400" },
            { icon: PlusIcon, color: "text-emerald-400" },
        ];

        const shuffled = (arr: Question[]) => [...arr].sort(() => Math.random() - 0.5);

        const initialVisible: { [categoryId: string]: QuizzCardType[] } = {};
        const initialHidden: { [categoryId: string]: QuizzCardType[] } = {};

        categories.forEach((category) => {
            const categoryQuestions = shuffled(
                questions.filter((q) => q.categoryId === category._id)
            );

            const allCards = categoryQuestions.map((q) => {
                const { icon, color } = iconConfigs[Math.floor(Math.random() * iconConfigs.length)];
                return {
                    question: q,
                    icon,
                    color,
                    used: questionsAnswered.some((qa) => qa.questionId === q._id),
                };
            });

            const unanswered = allCards.filter((card) => !card.used);
            const answered = allCards.filter((card) => card.used);

            // Mostrar solo no respondidas si hay suficientes
            const columnCount = categories.length === 1
                ? (() => {
                    const cardCount = unanswered.length + answered.length;
                    for (let i = 5; i > 0; i--) {
                        if (cardCount % i === 0) {
                            return i;
                        }
                    }
                    return Math.min(cardCount, 5);
                })()
                : 1;

            const visibleRowCount = columnCount * ROWS_PER_CATEGORY;

            const visible = unanswered.length >= visibleRowCount
                ? unanswered.slice(0, visibleRowCount)
                : [
                    ...unanswered,
                    ...answered.slice(0, visibleRowCount - unanswered.length),
                ];

            initialVisible[category._id] = visible;
            initialHidden[category._id] = allCards.filter(card => !visible.includes(card));
        });
        setVisibleQuestions(initialVisible);
        setHiddenQuestions(initialHidden);
    }
    useEffect(() => {
        console.debug(hiddenQuestions)
        createCards()
    }, []);


    // Actualizar el estado de las preguntas cuando se responden
    useEffect(() => {
        if (questionsAnswered.length === 0) {
            createCards()
            return
        };

        const lastAnswered = questionsAnswered[questionsAnswered.length - 1];
        const questionId = lastAnswered.questionId;

        // Identificar la categoría donde está esa pregunta
        let updatedCategoryId: string | null = null;

        for (const categoryId in visibleQuestions) {
            const found = visibleQuestions[categoryId].some(card => card.question._id === questionId);
            if (found) {
                updatedCategoryId = categoryId;
                break;
            }
        }

        if (!updatedCategoryId) return;

        setVisibleQuestions(prevVisible => {
            const updatedVisible = { ...prevVisible };
            const categoryCards = [...updatedVisible[updatedCategoryId!]];
            const index = categoryCards.findIndex(card => card.question._id === questionId);

            if (index !== -1) {
                setHiddenQuestions(prevHidden => {
                    const updatedHidden = { ...prevHidden };
                    const hiddenForCategory = updatedHidden[updatedCategoryId!] || [];

                    // Obtener solo preguntas no respondidas
                    const unansweredHidden = hiddenForCategory.filter(card => !card.used);

                    if (unansweredHidden.length > 0) {
                        // Reemplazar solo si hay preguntas no respondidas
                        categoryCards[index] = unansweredHidden[0];

                        // Remover solo esa pregunta específica del hidden original
                        updatedHidden[updatedCategoryId!] = hiddenForCategory.filter(
                            card => card.question._id !== unansweredHidden[0].question._id
                        );
                    } else {
                        // No hay más preguntas no respondidas → marcar como usada
                        categoryCards[index].used = true;
                    }

                    updatedVisible[updatedCategoryId!] = categoryCards;
                    return updatedHidden;
                });
            }

            return updatedVisible;
        });
    }, [questionsAnswered]);

    const handleCloseModal = () => {
        setVisibleQuestions((prevVisible) => {
            const updatedVisible = { ...prevVisible };
            if (selectedCategory && selectedQuestion) {
            const categoryCards = [...updatedVisible[selectedCategory]];
            const cardIndex = categoryCards.findIndex(card => card.question._id === selectedQuestion._id);

            if (cardIndex !== -1) {
                categoryCards[cardIndex].used = false;
                updatedVisible[selectedCategory] = categoryCards;
            }
            }
            return updatedVisible;
        });
        setSelectedQuestion(null)
        setSelectedCategory(null)
        setIsModalOpen(false)
    }
    const handleSuccessAnswered = (isCorrect: boolean, points: number) => {
        handleUpdatePlayers(isCorrect, points)
        moveToNextPlayer()
        moveToNextRound()
        hasUpdatedPlayers()
    }

    const handleCardClick = (categoryId: string, cardIndex: number) => {
        const card = visibleQuestions[categoryId]?.[cardIndex]

        if (card && !card.used && !isCardAnswered(card.question._id)) {
            setSelectedQuestion(card.question)
            setSelectedCategory(categoryId)
            setIsModalOpen(true)
            setVisibleQuestions((prevVisible) => {
                const updatedVisible = { ...prevVisible };
                const categoryCards = [...updatedVisible[categoryId]];

                if (categoryCards[cardIndex]) {
                    categoryCards[cardIndex].used = true;
                    updatedVisible[categoryId] = categoryCards;
                }

                return updatedVisible;
            });
        }
    }
    const isCardAnswered = (questionId: string) => {
        return questionsAnswered.some((q) => q.questionId === questionId)
    }


    return (
        <div className="flex items-start flex-col justify-center gap-2 sm:gap-3 w-full">
            <div
                className={`grid gap-2 sm:gap-3 w-full`}
                style={{
                    gridTemplateColumns: categories.length === 1
                        ? (() => {
                            const cardCount = visibleQuestions[categories[0]._id]?.length || 1;
                            // Si el número de tarjetas es divisible por un número menor o igual a 5, usa ese número como columnas
                            for (let i = 5; i > 0; i--) {
                                if (cardCount % i === 0) {
                                    return `repeat(${i}, minmax(0, 1fr))`;
                                }
                            }
                            // Si no es divisible, usa el límite de 5 columnas
                            return `repeat(${Math.min(cardCount, 5)}, minmax(0, 1fr))`;
                        })()
                        : `repeat(${categories.length}, minmax(0, 1fr))`, // Una columna por categoría
                }}
            >
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className={`flex flex-col gap-2 col-auto h-full w-full ${categories.length === 1 ? "col-span-full" : ""
                            }`}
                    >
                        <div
                            className={`flex items-center justify-center p-2 rounded-md bg-indigo-950 border-indigo-400/50 border text-indigo-200 font-bold text-center text-xs sm:text-sm w-full h-full ${categories.length === 1 ? "col-span-full" : ""
                                }`}
                        >
                            {category.name}
                        </div>
                    </div>
                ))}
            </div>
            <div
                className={`grid gap-2 sm:gap-3 w-full h-full max-h-max`}
                style={{
                    gridTemplateColumns: categories.length === 1
                        ? (() => {
                            const cardCount = visibleQuestions[categories[0]._id]?.length || 1;
                            // Si el número de tarjetas es divisible por un número menor o igual a 5, usa ese número como columnas
                            for (let i = 5; i > 0; i--) {
                                if (cardCount % i === 0) {
                                    return `repeat(${i}, minmax(0, 1fr))`;
                                }
                            }
                            // Si no es divisible, usa el límite de 5 columnas
                            return `repeat(${Math.min(cardCount, 5)}, minmax(0, 1fr))`;
                        })()
                        : `repeat(${categories.length}, minmax(0, 1fr))`, // Una columna por categoría
                }}
            >
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className={`flex flex-col gap-2 col-auto h-full w-full ${categories.length === 1 ? "col-span-full" : ""
                            }`}
                    >
                        <div
                            className={`grid gap-2 sm:gap-3`}
                            style={categories.length === 1 ? {
                                gridTemplateColumns: (() => {
                                    const cardCount = visibleQuestions[category._id]?.length || 1;
                                    // Si el número de tarjetas es divisible por un número menor o igual a 5, usa ese número como columnas
                                    for (let i = 5; i > 0; i--) {
                                        if (cardCount % i === 0) {
                                            return `repeat(${i}, minmax(0, 1fr))`;
                                        }
                                    }
                                    // Si no es divisible, usa el límite de 5 columnas
                                    return `repeat(${Math.min(cardCount, 5)}, minmax(0, 1fr))`;
                                })(),
                            } : {}}
                        >
                            <AnimatePresence mode="popLayout">
                                {visibleQuestions[category._id]?.map((card) => {
                                    const isAnswered = questionsAnswered.some((q) => q.questionId === card.question._id);
                                    return (
                                        <motion.div
                                            key={card.question._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{
                                                opacity: isAnswered || card.used ? 0.5 : 1,
                                                scale: 1
                                            }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                            onClick={() =>
                                                !isAnswered &&
                                                handleCardClick(
                                                    category._id,
                                                    visibleQuestions[category._id].findIndex(c => c.question._id === card.question._id)
                                                )
                                            }
                                            className={`w-full ${isAnswered || card.used ? "cursor-not-allowed" : "hover:scale-102 transition-transform cursor-pointer"}`}
                                        >
                                            <QuizzCard Icon={card.icon} color={card.color} />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                        </div>
                    </div>
                ))}
            </div>
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
                        handleUpdatePlayers={handleSuccessAnswered}
                    />
                )
            }
        </div>
    )
}

export default GameBoard;