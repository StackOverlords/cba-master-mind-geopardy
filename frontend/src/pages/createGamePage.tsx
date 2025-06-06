import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, X, Trophy, Users, Clock, Target, Check, CornerUpLeft } from "lucide-react"
import { usePaginatedCategories } from "../hooks/queries/category/useGetAllCategories"
import type { Category } from "../shared/types/category"
import InputField from "../components/ui/inputField"
import CategoryIcon from "../components/ui/icons/categoryIcon"
import { useNavigate } from "react-router"
import type { CreateGameChampionShipDto, PlayerChampionShip } from "../shared/types/game.dto"
import { useAuthStore } from "../stores/authStore"
import { useCreateChampionshipGame } from "../hooks/mutations/championshipGameMutations"
import toast from "react-hot-toast"
import ErrorToast from "../components/toastAlerts/errorAlert"
import SpinnerIcon from "../components/ui/icons/spinnerIcon"

const CreateGamePage = () => {
    const { data: categoriesData } = usePaginatedCategories({
        limit: -1,
    })
    const userId = useAuthStore((state) => state.user?._id)
    const navigate = useNavigate()
    const [gameSetup, setGameSetup] = useState<CreateGameChampionShipDto>({
        name: '',
        user: userId ? userId : '',
        status: 'playing',
        gameMode: 'championship',
        generateQuestions: true,
        playersLocal: [],
        categorys: [],
        rounds: 1,
        currentRound: 1,
        defaultTurnTime:20
    })
    useEffect(() => {
        if (userId) {
            setGameSetup((prev) => ({
                ...prev,
                user: userId
            }))
        }
    }, [userId])
    const { mutate: createChampionshipGame, isPending } = useCreateChampionshipGame()
    const [newPlayerName, setNewPlayerName] = useState("")
    const [timeLimit, setTimeLimit] = useState(30)
    const handleChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setGameSetup((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const addPlayer = () => {
        if (newPlayerName.trim() && gameSetup.playersLocal.length < 15) {
            const newPlayer: PlayerChampionShip = {
                _id: Date.now().toString(),
                username: newPlayerName.trim(),
                score: 0,
                avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${newPlayerName}`,
            }
            setGameSetup((prevSetup) => ({
                ...prevSetup,
                playersLocal: [...prevSetup.playersLocal, newPlayer]
            }))
            setNewPlayerName("")
        }
    }

    const removePlayer = (id: string) => {
        setGameSetup((prevSetup) => ({
            ...prevSetup,
            playersLocal: prevSetup.playersLocal.filter((player) => player._id !== id),
        }));
    }

    const toggleCategory = (category: Category) => {
        setGameSetup((prev) => ({
            ...prev,
            categorys: prev.categorys.includes(category._id)
                ? prev.categorys.filter((id) => id !== category._id)
                : [...prev.categorys, category._id],
        }))
    }

    const canStartGame = gameSetup.playersLocal.length >= 2 && gameSetup.categorys.length >= 1
    const handleGoBack = () => {
        navigate("/")
    }
    const handleStartGame = () => {
        if (canStartGame) {
            createChampionshipGame(
                gameSetup,
                {
                    onSuccess: (data) => {
                        const gameId = data._id
                        if (gameId) {
                            navigate(`/championship-game/${gameId}`)
                        }
                    },
                    onError: () => {
                        toast.custom((t) => (
                            <ErrorToast
                                t={t}
                                title="Error"
                                description="An error occurred while creating the game."
                            />
                        ))
                    }
                }
            )
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                <div className="text-center mb-8 relative">
                    <button onClick={handleGoBack} className="absolute left-0 flex items-center gap-2 p-1 text-sm text-purple-200 hover:text-white z-50 cursor-pointer">
                        <CornerUpLeft className="size-4" />
                        Back
                    </button>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-3 mb-4 mt-8 sm:mt-0"
                    >
                        <Trophy className="size-6 sm:size-10 text-yellow-400" />
                        <h1 className="text-2xl sm:text-4xl font-bold text-white">Game Setup</h1>
                    </motion.div>
                    <p className="sm:text-base text-xs text-purple-200">Configure your game and get ready to compete!</p>
                </div>

                <div className="grid grid-cols-1 mb-6">
                    {/* Game Configuration */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <div className="p-3 border border-dashboard-border/50 rounded-xl bg-gradient-to-br from-leaderboard-bg/50 to-black/20 backdrop-blur-sm mb-6">
                            <h2 className="text-white flex items-center gap-2 text-md sm:text-xl font-semibold mb-2">
                                <Target className="size-4 sm:size-5 text-yellow-400" />
                                Game Settings
                            </h2>
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <label htmlFor="gameTitle" className="text-purple-200 text-xs sm:text-sm">
                                        Game Title
                                    </label>
                                    <InputField
                                        id="name"
                                        name="name"
                                        placeholder="Trivia Battle"
                                        value={gameSetup.name}
                                        onChange={handleChangeData}
                                        className="max-w-md"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                                    <div>
                                        <label htmlFor="timeLimit" className="text-purple-200 flex items-center gap-1">
                                            <Clock className="w-4 h-4 hidden sm:block" />
                                            Time per Turn (seconds)
                                        </label>
                                        <InputField
                                            id="defaultTurnTime"
                                            name="defaultTurnTime"
                                            type="number"
                                            min="10"
                                            max="120"
                                            value={gameSetup.defaultTurnTime}
                                            onChange={handleChangeData}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="rounds" className="text-purple-200">
                                            Number of Rounds
                                        </label>
                                        <InputField
                                            id="rounds"
                                            type="number"
                                            min="1"
                                            max="20"
                                            name="rounds"
                                            value={gameSetup.rounds}
                                            onChange={handleChangeData}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Players */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                        <div className="p-3 border border-dashboard-border/50 rounded-xl bg-gradient-to-br from-leaderboard-bg/50 to-black/20 backdrop-blur-sm">
                            <h2 className="text-white flex items-center gap-2 text-md sm:text-xl font-semibold mb-2">
                                <Users className="size-4 sm:size-5 text-blue-400" />
                                Players ({gameSetup.playersLocal.length}/8)
                            </h2>
                            <div>
                                <div className="flex gap-2 mb-4">
                                    <InputField
                                        placeholder="Enter player name"
                                        value={newPlayerName}
                                        onChange={(e) => setNewPlayerName(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                                    />
                                    <button
                                        onClick={addPlayer}
                                        disabled={!newPlayerName.trim() || gameSetup.playersLocal.length >= 8}
                                        className="bg-dashboard-bg hover:bg-dashboard-border transition-colors ease-in-out duration-200 px-3 rounded-md mt-1 disabled:cursor-not-allowed border border-dashboard-border flex items-center w-max gap-2 text-nowrap"
                                    >
                                        <Plus className="size-4" />
                                        <span className="hidden sm:block text-sm">Add player</span>
                                    </button>
                                </div>

                                <div className="max-h-60 overflow-y-auto flex gap-2 flex-wrap items-center justify-center">
                                    {gameSetup.playersLocal.map((player, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex p-2 bg-slate-700/30 rounded-lg size-20 sm:size-28 relative overflow-hidden"
                                        >
                                            <div className="flex items-center flex-col w-full h-full">
                                                <img
                                                    src={player.avatar || "/placeholder.svg"}
                                                    alt={player.username}
                                                    className="sm:size-14 size-10 rounded-full"
                                                />
                                                <span className="text-white text-xs text-center">{player.username}</span>
                                            </div>
                                            <button
                                                onClick={() => removePlayer(player._id)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20 absolute right-1 top-1 rounded-sm"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Categories */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1"
                >
                    <div className="p-3 border border-dashboard-border/50 rounded-xl bg-gradient-to-br from-leaderboard-bg/50 to-black/20 backdrop-blur-sm">
                        <div className="flex gap-2 mb-6 flex-col">
                            <h2 className="text-md sm:text-xl font-semibold text-white flex items-center gap-2">
                                <CategoryIcon className="size-4 sm:size-5 text-purple-400" />
                                Categories ({gameSetup.categorys.length})
                            </h2>
                            <p className="text-purple-200 text-xs sm:text-sm">Choose at least one category for your game</p>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap justify-center mb-3">
                            {categoriesData && categoriesData.data.map((category) => {
                                const isSelected = gameSetup.categorys.includes(category._id)

                                return (
                                    category.questionCount > 0 &&
                                    <motion.button
                                        key={category._id}
                                        onClick={() => toggleCategory(category)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`relative p-3 size-24 sm:size-32 rounded-xl transition-all duration-300 border border-dashboard-border ${isSelected
                                            ? `bg-indigo-800 shadow-lg`
                                            : 'bg-gradient-to-b from-dashboard-bg to-indigo-800'
                                            }`}
                                    >
                                        <div className="sm:text-sm text-xs font-medium text-white">
                                            {category.name}
                                        </div>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-2 right-2 bg-emerald-200 rounded-full p-1"
                                            >
                                                <Check className="size-3 text-emerald-400" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* {selectedCategories.length === 0 && (
                            <p className="text-yellow-400 text-sm text-center mt-4">
                                Selecciona al menos una categoría para continuar
                            </p>
                        )} */}
                    </div>
                </motion.div>

                {/* Start Game button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 flex items-center justify-center flex-col"
                >
                    <button
                        onClick={handleStartGame}
                        disabled={!canStartGame || isPending}
                        className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 
                        text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed 
                        flex items-center justify-center rounded-md gap-2"
                    >
                        {
                            isPending ? (
                                <>
                                    <SpinnerIcon className="size-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Trophy className="size-5 text-yellow-400" />
                                    Start Game
                                </>
                            )
                        }
                    </button>

                    {!canStartGame && (
                        <p className="text-purple-300 text-sm mt-2">Add at least 2 players and select 1 category to start</p>
                    )}
                </motion.div>
            </motion.div>
        </div>
    )
}
export default CreateGamePage