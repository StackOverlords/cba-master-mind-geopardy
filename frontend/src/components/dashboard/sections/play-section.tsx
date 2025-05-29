import { useState } from "react"
import ClockIcon from "../../ui/icons/clockIcon"

export function PlaySection() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const categories = [
        {
            name: "Science",
            description: "Physics, Chemistry, Biology",
            questionCount: 456,
            difficulty: "Mixed",
            icon: "🧪",
            color: "from-[#4ade80] to-[#22c55e]",
            averageScore: 85,
        },
        {
            name: "History",
            description: "World History, Ancient Civilizations",
            questionCount: 389,
            difficulty: "Medium",
            icon: "📚",
            color: "from-[#42c6ff] to-[#3b82f6]",
            averageScore: 78,
        },
        {
            name: "Geography",
            description: "Countries, Capitals, Landmarks",
            questionCount: 312,
            difficulty: "Easy",
            icon: "🌍",
            color: "from-[#ffce22] to-[#f59e0b]",
            averageScore: 72,
        },
        {
            name: "Sports",
            description: "Athletes, Records, Events",
            questionCount: 278,
            difficulty: "Medium",
            icon: "⚽",
            color: "from-[#9f6bff] to-[#8b5cf6]",
            averageScore: 81,
        },
        {
            name: "Art",
            description: "Artists, Paintings, Movements",
            questionCount: 234,
            difficulty: "Hard",
            icon: "🎨",
            color: "from-[#ff4d6d] to-[#e11d48]",
            averageScore: 76,
        },
        {
            name: "Technology",
            description: "Programming, Modern Tech",
            questionCount: 198,
            difficulty: "Hard",
            icon: "💻",
            color: "from-[#42c6ff] to-[#06b6d4]",
            averageScore: 69,
        },
    ]

    const quickPlayOptions = [
        {
            name: "Quick Quiz",
            description: "5 random questions",
            duration: "2-3 min",
            icon: "⚡",
            color: "from-yellow-500 to-orange-500",
        },
        {
            name: "Challenge Mode",
            description: "10 hard questions",
            duration: "5-7 min",
            icon: "🔥",
            color: "from-red-500 to-pink-500",
        },
        {
            name: "Marathon",
            description: "25 mixed questions",
            duration: "15-20 min",
            icon: "🏃",
            color: "from-purple-500 to-indigo-500",
        },
    ]

    const getDifficultyBadge = (difficulty: string) => {
        switch (difficulty) {
            case "Easy":
                return "bg-green-500/20 text-green-300"
            case "Medium":
                return "bg-yellow-500/20 text-yellow-300"
            case "Hard":
                return "bg-red-500/20 text-red-300"
            default:
                return "bg-purple-500/20 text-purple-300"
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Play Quiz</h1>
                <p className="text-slate-400">Choose a category or game mode to start playing</p>
            </div>

            {/* Quick Play Options */}
            <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#2a2550]/50">
                    <h3 className="text-lg font-medium text-white">Quick Play</h3>
                    <p className="text-sm text-slate-400">Jump into a game instantly with these preset options</p>
                </div>
                <div className="p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        {quickPlayOptions.map((option) => (
                            <div
                                key={option.name}
                                className="bg-[#1a1836]/70 border border-[#2a2550]/50 rounded-lg p-4 hover:bg-[#1a1836] transition-colors cursor-pointer"
                            >
                                <div
                                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center text-2xl mb-3`}
                                >
                                    {option.icon}
                                </div>
                                <h3 className="text-white font-semibold mb-1">{option.name}</h3>
                                <p className="text-slate-400 text-sm mb-2">{option.description}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-slate-400 text-xs">
                                        <ClockIcon className="w-3 h-3 mr-1" />
                                        {option.duration}
                                    </div>
                                    <button className="px-3 py-1 bg-[#9f6bff] hover:bg-[#8b5cf6] text-white rounded-md text-sm flex items-center transition-colors">
                                        {/* <Play className="w-3 h-3 mr-1" /> */}
                                        Play
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category Selection */}
            <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#2a2550]/50">
                    <h3 className="text-lg font-medium text-white">Choose Category</h3>
                    <p className="text-sm text-slate-400">Select a specific category to focus your quiz session</p>
                </div>
                <div className="p-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <div
                                key={category.name}
                                className={`bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg p-4 hover:bg-[#1a1836]/70 transition-colors cursor-pointer ${selectedCategory === category.name ? "ring-2 ring-[#9f6bff]" : ""
                                    }`}
                                onClick={() => setSelectedCategory(category.name)}
                            >
                                <div
                                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl mb-3`}
                                >
                                    {category.icon}
                                </div>
                                <h3 className="text-white font-semibold mb-1">{category.name}</h3>
                                <p className="text-slate-400 text-sm mb-3">{category.description}</p>

                                <div className="space-y-2 mb-3">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Average Score</span>
                                        <span className="text-white">{category.averageScore}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-[#1a1836] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#9f6bff] rounded-full"
                                            style={{ width: `${category.averageScore}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                                            {category.questionCount} questions
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyBadge(category.difficulty)}`}>
                                            {category.difficulty}
                                        </span>
                                    </div>
                                    <button className="px-3 py-1 bg-[#9f6bff] hover:bg-[#8b5cf6] text-white rounded-md text-sm flex items-center transition-colors">
                                        {/* <Play className="w-3 h-3 mr-1" /> */}
                                        Play
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
