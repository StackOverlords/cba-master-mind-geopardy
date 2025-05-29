"use client"

import { useState } from "react"
import { Trophy, Medal, Award, TrendingUp, Crown } from "lucide-react"

export function LeaderboardSection() {
  const [selectedCategory, setSelectedCategory] = useState("overall")
  const [selectedPeriod, setSelectedPeriod] = useState("all-time")

  const leaderboardData = [
    {
      rank: 1,
      name: "Darlene",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 7791,
      gamesPlayed: 156,
      accuracy: 94,
      category: "Science",
      trend: "up",
    },
    {
      rank: 2,
      name: "Darlene",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 9374,
      gamesPlayed: 203,
      accuracy: 91,
      category: "Overall",
      trend: "up",
    },
    {
      rank: 3,
      name: "Kyle",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 1439,
      gamesPlayed: 89,
      accuracy: 87,
      category: "History",
      trend: "down",
    },
    {
      rank: 4,
      name: "Arlene",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 9359,
      gamesPlayed: 178,
      accuracy: 89,
      category: "Geography",
      trend: "up",
    },
    {
      rank: 5,
      name: "Dianne",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 2798,
      gamesPlayed: 134,
      accuracy: 85,
      category: "Sports",
      trend: "same",
    },
    {
      rank: 6,
      name: "Arlene",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 4349,
      gamesPlayed: 167,
      accuracy: 82,
      category: "Art",
      trend: "up",
    },
    {
      rank: 7,
      name: "Ronald Gallardo",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 9374,
      gamesPlayed: 47,
      accuracy: 84,
      category: "Overall",
      trend: "up",
      isCurrentUser: true,
    },
    {
      rank: 25,
      name: "Aubrey",
      avatar: "/placeholder.svg?height=40&width=40",
      score: 4152,
      gamesPlayed: 92,
      accuracy: 78,
      category: "Technology",
      trend: "down",
    },
  ]

  const categories = ["overall", "science", "history", "geography", "sports", "art", "technology"]
  const periods = ["all-time", "this-month", "this-week", "today"]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />
      default:
        return <span className="text-slate-400 font-bold">#{rank}</span>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
      default:
        return <div className="w-4 h-4" />
    }
  }

  const getRankBackground = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return "bg-[#2a2550]/50 border-[#9f6bff]"
    if (rank === 1) return "bg-[#ffce22]/10 border-[#ffce22]/50"
    if (rank === 2) return "bg-[#94a3b8]/10 border-[#94a3b8]/50"
    if (rank === 3) return "bg-[#f59e0b]/10 border-[#f59e0b]/50"
    return "bg-[#1a1836]/50 border-[#2a2550]"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-slate-400">See how you rank against other players</p>
        </div>
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-48 bg-[#1a1836] border border-[#2a2550] text-white rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#9f6bff]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-48 bg-[#1a1836] border border-[#2a2550] text-white rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#9f6bff]"
            >
              {periods.map((period) => (
                <option key={period} value={period}>
                  {period
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2a2550]/50 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <div>
            <h3 className="text-lg font-medium text-white">Top Performers</h3>
            <p className="text-sm text-slate-400">The highest scoring players in the selected category and period</p>
          </div>
        </div>
        <div className="p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {leaderboardData.slice(0, 3).map((player) => (
              <div
                key={player.rank}
                className={`border-2 rounded-lg p-6 text-center ${getRankBackground(player.rank, player.isCurrentUser || false)}`}
              >
                <div className="flex justify-center mb-4">{getRankIcon(player.rank)}</div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl">
                  {player.name.charAt(0)}
                </div>
                <h3 className="text-white font-semibold mb-2">{player.name}</h3>
                <p className="text-2xl font-bold text-white mb-1">{player.score.toLocaleString()}</p>
                <p className="text-sm text-slate-400 mb-2">{player.accuracy}% accuracy</p>
                <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                  {player.gamesPlayed} games
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2a2550]/50">
          <h3 className="text-lg font-medium text-white">Full Rankings</h3>
          <p className="text-sm text-slate-400">Complete leaderboard with detailed player statistics</p>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {leaderboardData.map((player) => (
              <div
                key={`${player.rank}-${player.name}`}
                className={`flex items-center justify-between p-4 rounded-lg border ${getRankBackground(player.rank, player.isCurrentUser || false)}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 flex justify-center">{getRankIcon(player.rank)}</div>
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{player.name}</p>
                      {player.isCurrentUser && (
                        <span className="px-2 py-0.5 border border-purple-400 text-purple-400 rounded-full text-xs">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{player.gamesPlayed} games played</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">{player.score.toLocaleString()}</p>
                    <p className="text-sm text-slate-400">{player.accuracy}% accuracy</p>
                  </div>
                  <div className="w-6 flex justify-center">{getTrendIcon(player.trend)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Your Stats */}
      <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2a2550]/50">
          <h3 className="text-lg font-medium text-white">Your Performance</h3>
          <p className="text-sm text-slate-400">Your current standing and recent performance metrics</p>
        </div>
        <div className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 rounded-lg bg-[#1a1836]/70">
              <p className="text-slate-400 text-sm mb-1">Current Rank</p>
              <p className="text-2xl font-bold text-white">#7</p>
              <p className="text-xs text-green-400">↑ 3 positions</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-[#1a1836]/70">
              <p className="text-slate-400 text-sm mb-1">Best Rank</p>
              <p className="text-2xl font-bold text-white">#2</p>
              <p className="text-xs text-slate-400">Science category</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-[#1a1836]/70">
              <p className="text-slate-400 text-sm mb-1">Points to #1</p>
              <p className="text-2xl font-bold text-white">1,583</p>
              <p className="text-xs text-slate-400">Keep playing!</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-[#1a1836]/70">
              <p className="text-slate-400 text-sm mb-1">Percentile</p>
              <p className="text-2xl font-bold text-white">92nd</p>
              <p className="text-xs text-green-400">Top 8%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
