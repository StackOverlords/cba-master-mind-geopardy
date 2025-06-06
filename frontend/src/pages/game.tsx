import { useEffect, useState } from "react";
import GameBoard from "../components/game/gameBoard";
import GameStatus from "../components/game/gameStatus";
import Leaderboard from "../components/game/leaderboard/leaderboard";
import TurnIndicator from "../components/game/turnIndicator";
import { useChampionShipGameById } from "../hooks/queries/championshipGame/useChampionShipGameById";
import { useParams } from "react-router";
import type { AnswerData, ChampionShipPlayer, ChampioShipGame, SubmitAnswerPayload } from "../shared/types/ChampionShipGame";
import { useAnswerChampionshipGame, useUpdateChampionShipGame } from "../hooks/mutations/championshipGameMutations";

const GamePage = () => {
    const { gameId } = useParams<{ gameId: string }>()
    const { data: GameData, isLoading } = useChampionShipGameById({
        id: gameId
    })
    const { mutate: updateChampionShipGame } = useUpdateChampionShipGame()
    const [championShipGame, setChampionShipGame] = useState<ChampioShipGame>()
    const [hasUpdatedPlayers, setHasUpdatedPlayers] = useState<boolean>(false)
    useEffect(() => {
        if (GameData) {
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
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
    useEffect(() => {
        if (championShipGame) {
            const currentTurnIndex = championShipGame.playersLocal.findIndex(player => player.currentTurn);
            setCurrentPlayerIndex(currentTurnIndex !== -1 ? currentTurnIndex : 0);
        }
    }, [championShipGame?.playersLocal]);

    const handleUpdatePlayers = (isCorrect: boolean, points: number) => {
        setChampionShipGame((prevGame) => {
            if (!prevGame) return undefined;
            const updatedPlayers = [...prevGame.playersLocal];
            console.log(currentPlayerIndex)
            if (isCorrect) {
                updatedPlayers[currentPlayerIndex].score += points;
                updatedPlayers[currentPlayerIndex].scoreTimestamp = Date.now();
            }
            updatedPlayers[currentPlayerIndex].currentTurn = false
            return {
                ...prevGame,
                playersLocal: updatedPlayers,
            };
        });

    }
    useEffect(() => {
        if (hasUpdatedPlayers) {
            if (championShipGame) {
                const updatePlayers: ChampionShipPlayer[] = championShipGame?.playersLocal.map(({ currentTurn, score, username, _id }) => ({
                    currentTurn,
                    score,
                    username,
                    _id,
                }));
                updatePlayers[currentPlayerIndex].currentTurn = true
                updateChampionShipGame({
                    id: championShipGame?._id,
                    data: { playersLocal: updatePlayers }
                })
            }
            setHasUpdatedPlayers(false);
        }

    }, [championShipGame?.playersLocal, currentPlayerIndex])
    const moveToNextPlayer = () => {
        setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % (championShipGame?.playersLocal?.length ?? 1))
    }
    const moveToNextRound = () => {
        if (currentPlayerIndex + 1 === turnsPerRound) {
            if (championShipGame && championShipGame?.currentRound < (maxRounds ?? 0)) {
                if (championShipGame) {
                    const currentRound = championShipGame.currentRound + 1
                    updateChampionShipGame({ id: championShipGame._id, data: { currentRound } })
                }
            } else if (championShipGame?.questionsLocalAnswered === championShipGame?.questions.length) {
                console.log("Game Over");
                if (championShipGame) {
                    updateChampionShipGame({
                        id: championShipGame?._id,
                        data: { status: 'finished' }
                    })
                }
            }
            // setUsedQuestions([])
            // resetCards()
        } else {
            // End Game
        }
    }
    const { mutate: answerChampionshipGame } = useAnswerChampionshipGame()
    const handlePlayerAnswered = (questionId: string, answerData: AnswerData) => {
        const payload: SubmitAnswerPayload = {
            gameId: championShipGame?._id ?? "",
            answerData,
            questionId
        }
        answerChampionshipGame(
            payload
        )
    }
    useEffect(() => {
        console.log(GameData)
    }, [GameData])
    const currentPlayer = championShipGame?.playersLocal.find((p) => p.currentTurn === true) || championShipGame?.playersLocal[currentPlayerIndex]
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
                            currentPlayer={currentPlayer ?? { _id: "", username: "", score: 0, avatar: "", currentTurn: false }}
                        />
                        <TurnIndicator players={championShipGame?.playersLocal} currentPlayerIndex={currentPlayerIndex} />
                    </div>
                    <GameBoard
                        time={championShipGame.defaultTurnTime}
                        questionsAnswered={championShipGame.questionsLocalAnswered}
                        handlePlayerAnswered={handlePlayerAnswered}
                        hasUpdatedPlayers={() => setHasUpdatedPlayers(true)}
                        currentRound={championShipGame.currentRound}
                        currentPlayer={currentPlayer ?? { _id: "", username: "", score: 0, avatar: "", currentTurn: false }}
                        moveToNextPlayer={moveToNextPlayer}
                        handleUpdatePlayers={handleUpdatePlayers}
                        questions={championShipGame.questions}
                        categories={championShipGame.categorys}
                        moveToNextRound={moveToNextRound}
                    />
                </div>
                <section className="w-full max-w-xl lg:max-w-2xl xl:max-w-sm">
                    <div className="p-4 flex items-center justify-center w-full">
                        <div className="container mx-auto flex flex-col items-center w-full">
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