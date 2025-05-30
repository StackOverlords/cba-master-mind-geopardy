import { useState } from "react"
import PlusIcon from "../ui/icons/plusIcon"
import TriangleIcon from "../ui/icons/triangleIcon"
import SquareIcon from "../ui/icons/squareIcon"
import CircleIcon from "../ui/icons/circleIcon"
import QuizzCard from "./quizzCard"
import type { Question } from "../../shared/types"
import QuizModal from "./quizzModal"

const questions: {
    science: Question[]
    history: Question[]
    geography: Question[]
    sports: Question[]
    art: Question[]
} = {
    science: [
        {
            id: "sci1",
            text: "What is the chemical symbol for water?",
            answers: [
                { id: "a1", text: "H2O", isCorrect: true },
                { id: "a2", text: "O2", isCorrect: false },
                { id: "a3", text: "CO2", isCorrect: false },
                { id: "a4", text: "NaCl", isCorrect: false },
            ],
        },
        {
            id: "sci2",
            text: "What planet is known as the Red Planet?",
            answers: [
                { id: "a1", text: "Mars", isCorrect: true },
                { id: "a2", text: "Jupiter", isCorrect: false },
                { id: "a3", text: "Saturn", isCorrect: false },
                { id: "a4", text: "Venus", isCorrect: false },
            ],
        },
        {
            id: "sci3",
            text: "Which gas do plants absorb from the atmosphere?",
            answers: [
                { id: "a1", text: "Oxygen", isCorrect: false },
                { id: "a2", text: "Carbon dioxide", isCorrect: true },
                { id: "a3", text: "Hydrogen", isCorrect: false },
                { id: "a4", text: "Nitrogen", isCorrect: false },
            ],
        },
        {
            id: "sci4",
            text: "What part of the cell contains the genetic material?",
            answers: [
                { id: "a1", text: "Cytoplasm", isCorrect: false },
                { id: "a2", text: "Nucleus", isCorrect: true },
                { id: "a3", text: "Cell wall", isCorrect: false },
                { id: "a4", text: "Ribosome", isCorrect: false },
            ],
        },
        {
            id: "sci5",
            text: "What force keeps planets in orbit around the sun?",
            answers: [
                { id: "a1", text: "Magnetism", isCorrect: false },
                { id: "a2", text: "Inertia", isCorrect: false },
                { id: "a3", text: "Gravity", isCorrect: true },
                { id: "a4", text: "Friction", isCorrect: false },
            ],
        },
    ],
    history: [
        {
            id: "his1",
            text: "Who was the first President of the United States?",
            answers: [
                { id: "a1", text: "Thomas Jefferson", isCorrect: false },
                { id: "a2", text: "George Washington", isCorrect: true },
                { id: "a3", text: "Abraham Lincoln", isCorrect: false },
                { id: "a4", text: "John Adams", isCorrect: false },
            ],
        },
        {
            id: "his2",
            text: "In which year did World War II end?",
            answers: [
                { id: "a1", text: "1940", isCorrect: false },
                { id: "a2", text: "1945", isCorrect: true },
                { id: "a3", text: "1939", isCorrect: false },
                { id: "a4", text: "1950", isCorrect: false },
            ],
        },
        {
            id: "his3",
            text: "Which empire built the Colosseum?",
            answers: [
                { id: "a1", text: "Greek", isCorrect: false },
                { id: "a2", text: "Roman", isCorrect: true },
                { id: "a3", text: "Ottoman", isCorrect: false },
                { id: "a4", text: "Byzantine", isCorrect: false },
            ],
        },
        {
            id: "his4",
            text: "Who discovered America in 1492?",
            answers: [
                { id: "a1", text: "Vasco da Gama", isCorrect: false },
                { id: "a2", text: "Christopher Columbus", isCorrect: true },
                { id: "a3", text: "Ferdinand Magellan", isCorrect: false },
                { id: "a4", text: "Hernán Cortés", isCorrect: false },
            ],
        },
        {
            id: "his5",
            text: "Where did the Industrial Revolution begin?",
            answers: [
                { id: "a1", text: "Germany", isCorrect: false },
                { id: "a2", text: "France", isCorrect: false },
                { id: "a3", text: "United Kingdom", isCorrect: true },
                { id: "a4", text: "United States", isCorrect: false },
            ],
        },
    ],
    geography: [
        {
            id: "geo1",
            text: "What is the largest continent?",
            answers: [
                { id: "a1", text: "Africa", isCorrect: false },
                { id: "a2", text: "Asia", isCorrect: true },
                { id: "a3", text: "Europe", isCorrect: false },
                { id: "a4", text: "North America", isCorrect: false },
            ],
        },
        {
            id: "geo2",
            text: "What is the capital of Australia?",
            answers: [
                { id: "a1", text: "Sydney", isCorrect: false },
                { id: "a2", text: "Melbourne", isCorrect: false },
                { id: "a3", text: "Canberra", isCorrect: true },
                { id: "a4", text: "Brisbane", isCorrect: false },
            ],
        },
        {
            id: "geo3",
            text: "Which desert is the largest in the world?",
            answers: [
                { id: "a1", text: "Sahara", isCorrect: true },
                { id: "a2", text: "Gobi", isCorrect: false },
                { id: "a3", text: "Kalahari", isCorrect: false },
                { id: "a4", text: "Arctic", isCorrect: false },
            ],
        },
        {
            id: "geo4",
            text: "Through which continent does the Nile River flow?",
            answers: [
                { id: "a1", text: "Asia", isCorrect: false },
                { id: "a2", text: "Africa", isCorrect: true },
                { id: "a3", text: "Europe", isCorrect: false },
                { id: "a4", text: "South America", isCorrect: false },
            ],
        },
        {
            id: "geo5",
            text: "Which country has the most islands?",
            answers: [
                { id: "a1", text: "Indonesia", isCorrect: false },
                { id: "a2", text: "Canada", isCorrect: false },
                { id: "a3", text: "Sweden", isCorrect: true },
                { id: "a4", text: "Philippines", isCorrect: false },
            ],
        },
    ],
    sports: [
        {
            id: "spo1",
            text: "How many players are on a soccer team (on the field)?",
            answers: [
                { id: "a1", text: "9", isCorrect: false },
                { id: "a2", text: "10", isCorrect: false },
                { id: "a3", text: "11", isCorrect: true },
                { id: "a4", text: "12", isCorrect: false },
            ],
        },
        {
            id: "spo2",
            text: "In which sport do you use a shuttlecock?",
            answers: [
                { id: "a1", text: "Tennis", isCorrect: false },
                { id: "a2", text: "Badminton", isCorrect: true },
                { id: "a3", text: "Squash", isCorrect: false },
                { id: "a4", text: "Volleyball", isCorrect: false },
            ],
        },
        {
            id: "spo3",
            text: "What country has won the most World Cups in soccer?",
            answers: [
                { id: "a1", text: "Germany", isCorrect: false },
                { id: "a2", text: "Argentina", isCorrect: false },
                { id: "a3", text: "Brazil", isCorrect: true },
                { id: "a4", text: "Italy", isCorrect: false },
            ],
        },
        {
            id: "spo4",
            text: "What sport does Serena Williams play?",
            answers: [
                { id: "a1", text: "Basketball", isCorrect: false },
                { id: "a2", text: "Tennis", isCorrect: true },
                { id: "a3", text: "Golf", isCorrect: false },
                { id: "a4", text: "Swimming", isCorrect: false },
            ],
        },
        {
            id: "spo5",
            text: "Which country hosted the 2016 Summer Olympics?",
            answers: [
                { id: "a1", text: "China", isCorrect: false },
                { id: "a2", text: "Brazil", isCorrect: true },
                { id: "a3", text: "UK", isCorrect: false },
                { id: "a4", text: "Japan", isCorrect: false },
            ],
        },
    ],
    art: [
        {
            id: "art1",
            text: "Who painted the Mona Lisa?",
            answers: [
                { id: "a1", text: "Vincent van Gogh", isCorrect: false },
                { id: "a2", text: "Pablo Picasso", isCorrect: false },
                { id: "a3", text: "Leonardo da Vinci", isCorrect: true },
                { id: "a4", text: "Michelangelo", isCorrect: false },
            ],
        },
        {
            id: "art2",
            text: "Which artist is known for the painting 'Starry Night'?",
            answers: [
                { id: "a1", text: "Vincent van Gogh", isCorrect: true },
                { id: "a2", text: "Claude Monet", isCorrect: false },
                { id: "a3", text: "Salvador Dalí", isCorrect: false },
                { id: "a4", text: "Edvard Munch", isCorrect: false },
            ],
        },
        {
            id: "art3",
            text: "The sculpture 'David' was created by which artist?",
            answers: [
                { id: "a1", text: "Donatello", isCorrect: false },
                { id: "a2", text: "Michelangelo", isCorrect: true },
                { id: "a3", text: "Raphael", isCorrect: false },
                { id: "a4", text: "Bernini", isCorrect: false },
            ],
        },
        {
            id: "art4",
            text: "Which art movement is Salvador Dalí associated with?",
            answers: [
                { id: "a1", text: "Cubism", isCorrect: false },
                { id: "a2", text: "Impressionism", isCorrect: false },
                { id: "a3", text: "Surrealism", isCorrect: true },
                { id: "a4", text: "Baroque", isCorrect: false },
            ],
        },
        {
            id: "art5",
            text: "Which artist is known for 'The Persistence of Memory'?",
            answers: [
                { id: "a1", text: "Dalí", isCorrect: true },
                { id: "a2", text: "Picasso", isCorrect: false },
                { id: "a3", text: "Kandinsky", isCorrect: false },
                { id: "a4", text: "Warhol", isCorrect: false },
            ],
        },
    ],
}

type Category = {
    id: number;
    name: string;
}

type QuizzCardType = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
}

const CATEGORIES: Category[] = [
    { id: 1, name: "Science" },
    { id: 2, name: "History" },
    { id: 3, name: "Geography" },
    { id: 4, name: "Sports" },
    { id: 5, name: "Art" },
];


const createCards = (): QuizzCardType => {
    const iconConfigs = [
        { icon: TriangleIcon, color: "text-rose-400" },
        { icon: SquareIcon, color: "text-yellow-400" },
        { icon: CircleIcon, color: "text-sky-400" },
        { icon: PlusIcon, color: "text-emerald-400" }
    ];
    let card: QuizzCardType
    const randomIcon = iconConfigs[Math.floor(Math.random() * iconConfigs.length)];
    card = {
        icon: randomIcon.icon,
        color: randomIcon.color
    };
    return card
}


const GameBoard = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [score, setScore] = useState(4152)
    const [playerName, setPlayerName] = useState("Aubrey")
    const [currentRound, setCurrentRound] = useState(1)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const getCategoryNameById = async (id: number) => {
        return CATEGORIES.find(cat => cat.id === id)?.name
    }

    const getRandomQuestion = (categoryKey: keyof typeof questions): Question => {
        const categoryQuestions = questions[categoryKey]
        const randomIndex = Math.floor(Math.random() * categoryQuestions.length)
        return categoryQuestions[randomIndex]
    }

    const handleCardClick = async (categoryId: number) => {
        const categoryName = await getCategoryNameById(categoryId)
        if (categoryName) setSelectedCategory(categoryName)
        setIsModalOpen(true)
        if (!categoryName) return

        const question = getRandomQuestion(categoryName.toLowerCase() as keyof typeof questions)
        setSelectedQuestion(question)
    }
    const handleAnswerSelected = (answerId: string, isCorrect: boolean) => {
        if (isCorrect) {
            setScore(score + 100)
        }
    }

    const onTimeUp = () => {

    }

    return (
        <div className="flex items-center justify-center p-4 space-y-8 gap-6">

            <div className="grid grid-cols-5 gap-2">
                {/* Categories Header */}
                {CATEGORIES.map(category => (
                    <div key={category.id} className="flex flex-col gap-2">
                        <div
                            className="flex items-center justify-center p-2 rounded-md bg-indigo-950 border-indigo-400/50 border text-indigo-200 font-bold text-center text-xs sm:text-sm w-18 sm:w-auto"
                        >
                            {category.name}
                        </div>
                        {
                            questions[category.name.toLowerCase() as keyof typeof questions]?.map((question) => {
                                const card = createCards(); // Mueve esto fuera del JSX

                                return (
                                    <div key={question.id} onClick={() => handleCardClick(category.id)} className="cursor-pointer">
                                        <QuizzCard
                                            Icon={card.icon}
                                            color={card.color}
                                        />
                                    </div>
                                );
                            })

                        }
                    </div>
                ))}
            </div>

            {/* <button
                onClick={() => setCards(createCards())}
                className="px-6 py-2 rounded-lg bg-indigo-950 border-indigo-700 hover:bg-indigo-900 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100"
            >
                New Game
            </button> */}
            <QuizModal
                question={selectedQuestion}
                category={selectedCategory}
                playerName={playerName}
                currentRound={currentRound}
                isModalOpen={isModalOpen}
                handleCloseModal={handleCloseModal}
                onAnswerSelected={handleAnswerSelected}
                onTimeUp={onTimeUp}
            />
        </div>
    )
}

export default GameBoard;