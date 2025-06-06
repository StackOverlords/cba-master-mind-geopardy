import { useEffect, useState } from "react";
import GameBoard from "../components/game/gameBoard";
import GameStatus from "../components/game/gameStatus";
import Leaderboard from "../components/game/leaderboard/leaderboard";
import type { Game, Player } from "../shared/types/game";
import type { Question } from "../shared/types";
import TurnIndicator from "../components/game/turnIndicator";
import { useChampionShipGameById } from "../hooks/queries/championshipGame/useChampionShipGameById";
import { useParams } from "react-router";
import type { ChampionShipPlayer, ChampioShipGame } from "../shared/types/ChampionShipGame";
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
                { _id: "a1", text: "H2O", isCorrect: true },
                { _id: "a2", text: "O2", isCorrect: false },
                { _id: "a3", text: "CO2", isCorrect: false },
                { _id: "a4", text: "NaCl", isCorrect: false },
            ],
        },
        {
            id: "sci2",
            text: "What planet is known as the Red Planet?",
            answers: [
                { _id: "a1", text: "Mars", isCorrect: true },
                { _id: "a2", text: "Jupiter", isCorrect: false },
                { _id: "a3", text: "Saturn", isCorrect: false },
                { _id: "a4", text: "Venus", isCorrect: false },
            ],
        },
        {
            id: "sci3",
            text: "Which gas do plants absorb from the atmosphere?",
            answers: [
                { _id: "a1", text: "Oxygen", isCorrect: false },
                { _id: "a2", text: "Carbon dioxide", isCorrect: true },
                { _id: "a3", text: "Hydrogen", isCorrect: false },
                { _id: "a4", text: "Nitrogen", isCorrect: false },
            ],
        },
        {
            id: "sci4",
            text: "What part of the cell contains the genetic material?",
            answers: [
                { _id: "a1", text: "Cytoplasm", isCorrect: false },
                { _id: "a2", text: "Nucleus", isCorrect: true },
                { _id: "a3", text: "Cell wall", isCorrect: false },
                { _id: "a4", text: "Ribosome", isCorrect: false },
            ],
        },
        {
            id: "sci5",
            text: "What force keeps planets in orbit around the sun?",
            answers: [
                { _id: "a1", text: "Magnetism", isCorrect: false },
                { _id: "a2", text: "Inertia", isCorrect: false },
                { _id: "a3", text: "Gravity", isCorrect: true },
                { _id: "a4", text: "Friction", isCorrect: false },
            ],
        },
    ],
    history: [
        {
            id: "his1",
            text: "Who was the first President of the United States?",
            answers: [
                { _id: "a1", text: "Thomas Jefferson", isCorrect: false },
                { _id: "a2", text: "George Washington", isCorrect: true },
                { _id: "a3", text: "Abraham Lincoln", isCorrect: false },
                { _id: "a4", text: "John Adams", isCorrect: false },
            ],
        },
        {
            id: "his2",
            text: "In which year did World War II end?",
            answers: [
                { _id: "a1", text: "1940", isCorrect: false },
                { _id: "a2", text: "1945", isCorrect: true },
                { _id: "a3", text: "1939", isCorrect: false },
                { _id: "a4", text: "1950", isCorrect: false },
            ],
        },
        {
            id: "his3",
            text: "Which empire built the Colosseum?",
            answers: [
                { _id: "a1", text: "Greek", isCorrect: false },
                { _id: "a2", text: "Roman", isCorrect: true },
                { _id: "a3", text: "Ottoman", isCorrect: false },
                { _id: "a4", text: "Byzantine", isCorrect: false },
            ],
        },
        {
            id: "his4",
            text: "Who discovered America in 1492?",
            answers: [
                { _id: "a1", text: "Vasco da Gama", isCorrect: false },
                { _id: "a2", text: "Christopher Columbus", isCorrect: true },
                { _id: "a3", text: "Ferdinand Magellan", isCorrect: false },
                { _id: "a4", text: "Hernán Cortés", isCorrect: false },
            ],
        },
        {
            id: "his5",
            text: "Where did the Industrial Revolution begin?",
            answers: [
                { _id: "a1", text: "Germany", isCorrect: false },
                { _id: "a2", text: "France", isCorrect: false },
                { _id: "a3", text: "United Kingdom", isCorrect: true },
                { _id: "a4", text: "United States", isCorrect: false },
            ],
        },
    ],
    geography: [
        {
            id: "geo1",
            text: "What is the largest continent?",
            answers: [
                { _id: "a1", text: "Africa", isCorrect: false },
                { _id: "a2", text: "Asia", isCorrect: true },
                { _id: "a3", text: "Europe", isCorrect: false },
                { _id: "a4", text: "North America", isCorrect: false },
            ],
        },
        {
            id: "geo2",
            text: "What is the capital of Australia?",
            answers: [
                { _id: "a1", text: "Sydney", isCorrect: false },
                { _id: "a2", text: "Melbourne", isCorrect: false },
                { _id: "a3", text: "Canberra", isCorrect: true },
                { _id: "a4", text: "Brisbane", isCorrect: false },
            ],
        },
        {
            id: "geo3",
            text: "Which desert is the largest in the world?",
            answers: [
                { _id: "a1", text: "Sahara", isCorrect: true },
                { _id: "a2", text: "Gobi", isCorrect: false },
                { _id: "a3", text: "Kalahari", isCorrect: false },
                { _id: "a4", text: "Arctic", isCorrect: false },
            ],
        },
        {
            id: "geo4",
            text: "Through which continent does the Nile River flow?",
            answers: [
                { _id: "a1", text: "Asia", isCorrect: false },
                { _id: "a2", text: "Africa", isCorrect: true },
                { _id: "a3", text: "Europe", isCorrect: false },
                { _id: "a4", text: "South America", isCorrect: false },
            ],
        },
        {
            id: "geo5",
            text: "Which country has the most islands?",
            answers: [
                { _id: "a1", text: "Indonesia", isCorrect: false },
                { _id: "a2", text: "Canada", isCorrect: false },
                { _id: "a3", text: "Sweden", isCorrect: true },
                { _id: "a4", text: "Philippines", isCorrect: false },
            ],
        },
    ],
    sports: [
        {
            id: "spo1",
            text: "How many players are on a soccer team (on the field)?",
            answers: [
                { _id: "a1", text: "9", isCorrect: false },
                { _id: "a2", text: "10", isCorrect: false },
                { _id: "a3", text: "11", isCorrect: true },
                { _id: "a4", text: "12", isCorrect: false },
            ],
        },
        {
            id: "spo2",
            text: "In which sport do you use a shuttlecock?",
            answers: [
                { _id: "a1", text: "Tennis", isCorrect: false },
                { _id: "a2", text: "Badminton", isCorrect: true },
                { _id: "a3", text: "Squash", isCorrect: false },
                { _id: "a4", text: "Volleyball", isCorrect: false },
            ],
        },
        {
            id: "spo3",
            text: "What country has won the most World Cups in soccer?",
            answers: [
                { _id: "a1", text: "Germany", isCorrect: false },
                { _id: "a2", text: "Argentina", isCorrect: false },
                { _id: "a3", text: "Brazil", isCorrect: true },
                { _id: "a4", text: "Italy", isCorrect: false },
            ],
        },
        {
            id: "spo4",
            text: "What sport does Serena Williams play?",
            answers: [
                { _id: "a1", text: "Basketball", isCorrect: false },
                { _id: "a2", text: "Tennis", isCorrect: true },
                { _id: "a3", text: "Golf", isCorrect: false },
                { _id: "a4", text: "Swimming", isCorrect: false },
            ],
        },
        {
            id: "spo5",
            text: "Which country hosted the 2016 Summer Olympics?",
            answers: [
                { _id: "a1", text: "China", isCorrect: false },
                { _id: "a2", text: "Brazil", isCorrect: true },
                { _id: "a3", text: "UK", isCorrect: false },
                { _id: "a4", text: "Japan", isCorrect: false },
            ],
        },
    ],
    art: [
        {
            id: "art1",
            text: "Who painted the Mona Lisa?",
            answers: [
                { _id: "a1", text: "Vincent van Gogh", isCorrect: false },
                { _id: "a2", text: "Pablo Picasso", isCorrect: false },
                { _id: "a3", text: "Leonardo da Vinci", isCorrect: true },
                { _id: "a4", text: "Michelangelo", isCorrect: false },
            ],
        },
        {
            id: "art2",
            text: "Which artist is known for the painting 'Starry Night'?",
            answers: [
                { _id: "a1", text: "Vincent van Gogh", isCorrect: true },
                { _id: "a2", text: "Claude Monet", isCorrect: false },
                { _id: "a3", text: "Salvador Dalí", isCorrect: false },
                { _id: "a4", text: "Edvard Munch", isCorrect: false },
            ],
        },
        {
            id: "art3",
            text: "The sculpture 'David' was created by which artist?",
            answers: [
                { _id: "a1", text: "Donatello", isCorrect: false },
                { _id: "a2", text: "Michelangelo", isCorrect: true },
                { _id: "a3", text: "Raphael", isCorrect: false },
                { _id: "a4", text: "Bernini", isCorrect: false },
            ],
        },
        {
            id: "art4",
            text: "Which art movement is Salvador Dalí associated with?",
            answers: [
                { _id: "a1", text: "Cubism", isCorrect: false },
                { _id: "a2", text: "Impressionism", isCorrect: false },
                { _id: "a3", text: "Surrealism", isCorrect: true },
                { _id: "a4", text: "Baroque", isCorrect: false },
            ],
        },
        {
            id: "art5",
            text: "Which artist is known for 'The Persistence of Memory'?",
            answers: [
                { _id: "a1", text: "Dalí", isCorrect: true },
                { _id: "a2", text: "Picasso", isCorrect: false },
                { _id: "a3", text: "Kandinsky", isCorrect: false },
                { _id: "a4", text: "Warhol", isCorrect: false },
            ],
        },
    ],
}

const mockGame: Game = {
    _id: "game_001",
    name: "Trivia Battle",
    user: "admin_user_id",
    status: "in-progress",
    gameMode: "multiplayer",
    isDeleted: false,
    code: "XYZ123",
    currentRound: 1,
    currentPlayerDbId: "player_001",
    defaultTurnTime: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    questions: [],
    categorys: ["Science", "History", "Sports", "Movies", "Geography"],
    players: [
        {
            _id: "player_001",
            playerId: "u1",
            username: "Alice",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alice"
        },
        {
            _id: "player_002",
            playerId: "u2",
            username: "Bob",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Bob"
        },
        {
            _id: "player_003",
            playerId: "u3",
            username: "Charlie",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Charlie"
        },
        {
            _id: "player_004",
            playerId: "u4",
            username: "Diana",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Diana"
        },
        {
            _id: "player_005",
            playerId: "u5",
            username: "Eve",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Eve"
        },
        {
            _id: "player_006",
            playerId: "u6",
            username: "Frank",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Frank"
        },
        {
            _id: "player_007",
            playerId: "u7",
            username: "Grace",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Grace"
        },
        {
            _id: "player_008",
            playerId: "u8",
            username: "Hank",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Hank"
        },
        {
            _id: "player_009",
            playerId: "u9",
            username: "Ivy",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ivy"
        },
        {
            _id: "player_010",
            playerId: "u10",
            username: "Jack",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack"
        },
        {
            _id: "player_011",
            playerId: "u11",
            username: "Karen",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Karen"
        },
        {
            _id: "player_012",
            playerId: "u12",
            username: "Leo",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo"
        },
        {
            _id: "player_013",
            playerId: "u13",
            username: "Mona",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mona"
        },
        {
            _id: "player_014",
            playerId: "u14",
            username: "Nate",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Nate"
        },
        {
            _id: "player_015",
            playerId: "u15",
            username: "Olivia",
            score: 0,
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Olivia"
        }

    ],
    finalResults: {
        _id: "final_001",
        positions: [
            {
                _id: "pos_001",
                playerId: "u1",
                position: 1,
                score: 100
            },
            {
                _id: "pos_002",
                playerId: "u2",
                position: 2,
                score: 80
            },
            {
                _id: "pos_003",
                playerId: "u3",
                position: 3,
                score: 60
            },
            {
                _id: "pos_004",
                playerId: "u4",
                position: 4,
                score: 40
            },
            {
                _id: "pos_005",
                playerId: "u5",
                position: 5,
                score: 20
            }
        ]
    }
};
interface GamePlayer extends ChampionShipPlayer {
    scoreTimestamp?: number
}
const GamePage = () => {
    const { gameId } = useParams<{ gameId: string }>()
    const { data: GameData, isLoading } = useChampionShipGameById({
        id: gameId
    })
    const [championShipGame, setChampionShipGame] = useState<ChampioShipGame>()
    useEffect(() => {
        if (GameData) {
            console.log(GameData)
            setChampionShipGame(GameData);
            if (GameData.playersLocal) {
                const updatedPlayers = GameData.playersLocal.map((player) => ({
                    ...player,
                    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${player.username}`
                }));
                setChampionShipGame((prev) => {
                    if (!prev) return undefined;
                    return {
                        ...prev,
                        playersLocal: updatedPlayers
                    };
                });
            }
        }
    }, [GameData]);
    const sortedPlayers = [...(championShipGame?.playersLocal ?? [])].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (a.scoreTimestamp ?? 0) - (b.scoreTimestamp ?? 0);
    });
    const turnsPerRound = championShipGame?.playersLocal.length
    const maxRounds = championShipGame?.rounds
    const [currentRound, setCurrentRound] = useState(1)
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
    const handleUpdatePlayers = () => {
        setChampionShipGame((prevGame) => {
            if (!prevGame) return undefined;
            const updatedPlayers = [...prevGame.playersLocal];
            updatedPlayers[currentPlayerIndex].score += 100;
            updatedPlayers[currentPlayerIndex].scoreTimestamp = Date.now();
            return {
                ...prevGame,
                playersLocal: updatedPlayers,
            };
        });
    }
    const moveToNextPlayer = () => {
        setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % (championShipGame?.playersLocal?.length ?? 1))
    }
    const moveToNextRound = () => {
        if (currentPlayerIndex + 1 === turnsPerRound) {
            if (currentRound < (maxRounds ?? 0)) {
                setCurrentRound((prevRound) => prevRound + 1);
            } else {
                console.log("Game Over");
                // Handle end game logic here
            }
            // setUsedQuestions([])
            // resetCards()
        } else {
            // End Game
        }
    }

    const currentPlayer = championShipGame?.playersLocal[currentPlayerIndex]
    return (
        isLoading ? (
            <div className="w-full min-h-screen flex items-center justify-center relative">
                <div className='flex gap-2 items-end text-xl font-bold font-PressStart2P'>
                    <span>Loading</span>
                    <span className="text-blue-700 animate-bounce">.</span>
                    <span className="text-blue-700 animate-bounce [animation-delay:-.3s]">.</span>
                    <span className="text-blue-700 animate-bounce [animation-delay:-.5s]">.</span>
                </div>
            </div>
        ) : championShipGame && (
            <main className=" min-h-screen flex justify-center py-10 flex-wrap gap-6">
                <div className="mt-6 sm:mt-4 max-w-xl lg:max-w-2xl xl:max-w-3xl w-full px-3 xl:px-0">
                    <div className="sm:w-auto">
                        {/* Game Info Header */}
                        <GameStatus
                            countPlayers={championShipGame.playersLocal.length}
                            turnTime={championShipGame.defaultTurnTime}
                            gameName={championShipGame.name}
                            currentRound={championShipGame.currentRound}
                            currentPlayer={currentPlayer ?? { _id: "", username: "", score: 0, avatar: "" }}
                        />
                        <TurnIndicator players={championShipGame?.playersLocal} currentPlayerIndex={currentPlayerIndex} />
                    </div>
                    <GameBoard
                        currentRound={currentRound}
                        currentPlayer={currentPlayer ?? { _id: "", username: "", score: 0, avatar: "" }}
                        moveToNextPlayer={moveToNextPlayer}
                        handleUpdatePlayers={handleUpdatePlayers}
                        questions={championShipGame.questions}
                        categories={championShipGame.categorys}
                        moveToNextRound={moveToNextRound}
                    />
                </div>
                <section className="">
                    <div className="p-4 flex items-center justify-center">
                        <div className="container mx-auto flex flex-col items-center">
                            <Leaderboard
                                players={sortedPlayers}
                            />
                        </div>
                    </div>

                </section>

            </main>
        )
    );
}

export default GamePage;