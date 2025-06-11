import { useEffect, useMemo, useRef, useState } from "react";
import GameBoard from "../components/game/gameBoard";
import GameStatus from "../components/game/gameStatus";
import Leaderboard from "../components/game/leaderboard/leaderboard";
import TurnIndicator from "../components/game/turnIndicator";
import { useChampionShipGameById } from "../hooks/queries/championshipGame/useChampionShipGameById";
import { useParams } from "react-router";
import type { AnswerData, ChampionShipPlayer, ChampioShipGame, SubmitAnswerPayload } from "../shared/types/ChampionShipGame";
import { useAnswerChampionshipGame, useUpdateChampionShipGame } from "../hooks/mutations/championshipGameMutations";
import AnimatedPodiumOverlay from "../components/game/animatedPodiumOverlay";
import useSound from "../hooks/useSound";
import winsound from "../assets/sounds/brass-fanfare-with-timpani-and-winchimes-reverberated-146260.mp3"
import { AnimatePresence, motion } from "motion/react";
import LeaderboardHeader from "../components/game/leaderboard/leaderboardHeader";
import ConfirmationModal from "../components/confirmationModal";
import { Flag, RotateCcw } from "lucide-react";

const GamePage = () => {
    const { play: playWinSound, stop: stopWinSound } = useSound(winsound)
    const { gameId } = useParams<{ gameId: string }>()
    const { data: GameData, isLoading } = useChampionShipGameById({ id: gameId })
    const { mutate: updateChampionShipGame } = useUpdateChampionShipGame()
    const [championShipGame, setChampionShipGame] = useState<ChampioShipGame>()
    const [hasUpdatedPlayers, setHasUpdatedPlayers] = useState<boolean>(false)
    const [showPodium, setShowPodium] = useState<boolean>(false);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [modalAction, setModalAction] = useState<"restart" | "finish" | null>(null);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);

    useEffect(() => {
        if (!GameData) return;

        const updatedPlayers = GameData.playersLocal?.map((player) => ({
            ...player,
            avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${player.username}`,
        })) ?? [];

        setChampionShipGame({
            ...GameData,
            playersLocal: updatedPlayers,
        });

        if (GameData.status === 'finished') {
            setShowPodium(true);
            return;
        }

        if (
            GameData.questionsLocalAnswered.length === (GameData.playersLocal.length * GameData.rounds) &&
            currentPlayerIndex === 0
        ) {
            updateChampionShipGame({
                id: GameData._id,
                data: {
                    status: 'finished',
                },
            });
            setShowPodium(true);
        }
    }, [GameData, currentPlayerIndex]);

    const sortedPlayers = useMemo(() => {
        return [...(championShipGame?.playersLocal ?? [])].sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return (a.scoreTimestamp ?? 0) - (b.scoreTimestamp ?? 0);
        });
    }, [championShipGame?.playersLocal]);

    const turnsPerRound = GameData?.playersLocal.length
    const maxRounds = GameData?.rounds
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
                const updatePlayers: ChampionShipPlayer[] = championShipGame?.playersLocal
                    .map(({ currentTurn, score, username, _id, scoreTimestamp }) => ({
                        currentTurn,
                        score,
                        username,
                        _id,
                        scoreTimestamp,
                    }))
                updatePlayers[currentPlayerIndex].currentTurn = true;
                updateChampionShipGame({
                    id: championShipGame?._id,
                    data: { playersLocal: updatePlayers }
                });
            }
            setHasUpdatedPlayers(false);
        }
    }, [championShipGame?.playersLocal, currentPlayerIndex]);
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
            }
            if (championShipGame?.questionsLocalAnswered.length === championShipGame?.questions.length) {
                console.log("Game Over");
                if (championShipGame) {
                    updateChampionShipGame({
                        id: championShipGame?._id,
                        data: {
                            status: 'finished',
                            finalResultsLocal: championShipGame.playersLocal
                        }
                    })
                    setShowPodium(true);
                }
            }
        } else {
            // End Game
        }
    }
    const { mutate: answerChampionshipGame } = useAnswerChampionshipGame()
    const handlePlayerAnswered = (questionId: string, answerData: AnswerData) => {
        if (championShipGame && !championShipGame?.questionsLocalAnswered.find((q) => q.questionId === questionId)) {
            const payload: SubmitAnswerPayload = {
                gameId: championShipGame?._id ?? "",
                answerData,
                questionId
            }
            answerChampionshipGame(
                payload
            )
        }
    }

    useEffect(() => {
        if (showPodium) {
            stopWinSound()
            playWinSound()
        }
    }, [showPodium])

    const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)
    const currentPlayer = championShipGame?.playersLocal.find((p) => p.currentTurn === true) || championShipGame?.playersLocal[currentPlayerIndex]
    const gameBoardRef = useRef<HTMLDivElement>(null);
    const [gameBoardHeight, setGameBoardHeight] = useState<number | null>(null);
    useEffect(() => {
        const div = document.getElementById('game-board')
        if (div?.offsetHeight === gameBoardHeight) return

        const updateHeight = () => {
            if (div) {
                setGameBoardHeight(div.offsetHeight);
                setShowLeaderboard(true)
            }
        };

        updateHeight(); // Medir inicialmente

        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);

    }, [championShipGame, showLeaderboard])

    const handleRestartGame = () => {
        if (championShipGame) {
            const resetPlayers: ChampionShipPlayer[] = championShipGame.playersLocal.map(({ _id, username }, index) => ({
                _id,
                username,
                score: 0,
                currentTurn: index === 0,
                scoreTimestamp: 0
            }));

            updateChampionShipGame({
                id: championShipGame._id,
                data: {
                    playersLocal: resetPlayers,
                    questionsLocalAnswered: [],
                    finalResultsLocal: [],
                    currentRound: 1,
                    status: "playing",
                },
            });
            setShowPodium(false)
            // window.location.reload();
        }
    };
    const handleFinishGame = () => {
        if (championShipGame) {
            updateChampionShipGame({
                id: championShipGame._id,
                data: {
                    status: 'finished',
                    finalResultsLocal: championShipGame.playersLocal,
                },
            });
            setShowPodium(true);
        }
    }

    const handleModalCancelConfirm = () => {
        setShowModalConfirm(false);
        setModalAction(null);
    };

    const handleModalConfirm = () => {
        if (modalAction === "restart") {
            handleRestartGame();
        } else if (modalAction === "finish") {
            handleFinishGame();
        }
        setShowModalConfirm(false);
        setModalAction(null);
    };
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
            <>
                <main className="min-h-dvh flex justify-center pb-4 flex-wrap gap-6">
                    <div
                        ref={gameBoardRef}
                        id="game-board"
                        className="mt-6 sm:mt-4 max-w-xl md:min-w-3xl md:w-3xl w-full px-3 xl:px-0 flex-1">
                        <div className="sm:w-auto">
                            {/* <div className="xl:hidden xl:h-0">
                                <LeaderboardHeader/>
                            </div> */}
                            {/* Game Info Header */}
                            <GameStatus
                                handleFinishGame={() => {
                                    updateChampionShipGame({
                                        id: championShipGame._id,
                                        data: {
                                            status: 'finished',
                                            finalResultsLocal: championShipGame.playersLocal,
                                        },
                                    });
                                }}
                                rounds={championShipGame.rounds}
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
                    <AnimatePresence>
                        {showLeaderboard && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="flex px-3 xl:px-0 flex-col gap-2 w-full max-w-xl md:max-w-3xl xl:max-w-sm mt-4 h-full"
                                style={{
                                    maxHeight: gameBoardHeight ? `${gameBoardHeight}px` : "",
                                }}
                            >
                                <div className="xl:block hidden">
                                    <LeaderboardHeader />
                                </div>
                                <Leaderboard players={sortedPlayers} />
                                <div className="flex flex-col gap-3 w-full mt-2">
                                    <button
                                        onClick={() => {
                                            setModalAction("restart");
                                            setShowModalConfirm(true);
                                        }}
                                        className="w-full py-3 text-white font-semibold rounded-md bg-dashboard-bg hover:bg-dashboard-border ease-in-out duration-200 hover:brightness-110 transition-all shadow-md border border-dashboard-border cursor-pointer text-xs sm:text-base flex items-center justify-center gap-3 group"
                                    >
                                        <RotateCcw className="sm:size-5 size-3" />
                                        Restart Game
                                    </button>
                                    <button
                                        onClick={() => {
                                            setModalAction("finish");
                                            setShowModalConfirm(true);
                                        }}
                                        className="w-full py-3 text-white font-semibold rounded-md bg-gradient-to-r from-purple-400 to-blue-400 hover:brightness-110 transition-all shadow-md cursor-pointe text-xs sm:text-base flex items-center justify-center gap-3 group"
                                    >
                                        <Flag className="size-3 sm:size-5 text-red-400 group-hover:text-red-500" />
                                        End Game
                                    </button>
                                </div>

                            </motion.section>
                        )}
                    </AnimatePresence>
                </main>
                {showPodium &&
                    <AnimatedPodiumOverlay players={championShipGame.playersLocal ?? []} />
                }
                {
                    showModalConfirm && (
                        <ConfirmationModal
                            title={modalAction === "restart" ? "Restart game?" : "End game?"}
                            message={
                                modalAction === "restart"
                                    ? "Current progress will be lost. Are you sure you want to restart?"
                                    : "Are you sure you want to end the game?"
                            }
                            onCancel={handleModalCancelConfirm}
                            onConfirm={handleModalConfirm}
                            confirmButtonText={modalAction === "restart" ? "Restart" : "End"}
                            type={modalAction === "restart" ? "warning" : "danger"}
                        />
                    )
                }
            </>
        )
    );
}

export default GamePage;