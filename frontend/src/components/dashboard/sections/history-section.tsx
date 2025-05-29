"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Trophy, Clock, Target, Calendar } from "lucide-react"

export function HistorySection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("all")

  const gameHistory = [
    {
      id: 1,
      date: "2024-01-20",
      time: "14:30",
      category: "Science",
      score: 9374,
      accuracy: 94,
      timeSpent: "2:45",
      questionsAnswered: 10,
      rank: 1,
    },
    {
      id: 2,
      date: "2024-01-20",
      time: "10:15",
      category: "History",
      score: 7891,
      accuracy: 87,
      timeSpent: "3:12",
      questionsAnswered: 10,
      rank: 3,
    },
    {
      id: 3,
      date: "2024-01-19",
      time: "16:45",
      category: "Geography",
      score: 6542,
      accuracy: 81,
      timeSpent: "2:58",
      questionsAnswered: 8,
      rank: 5,
    },
    {
      id: 4,
      date: "2024-01-19",
      time: "09:20",
      category: "Sports",
      score: 8234,
      accuracy: 92,
      timeSpent: "2:23",
      questionsAnswered: 10,
      rank: 2,
    },
    {
      id: 5,
      date: "2024-01-18",
      time: "20:10",
      category: "Art",
      score: 5678,
      accuracy: 76,
      timeSpent: "4:15",
      questionsAnswered: 10,
      rank: 8,
    },
    {
      id: 6,
      date: "2024-01-18",
      time: "15:30",
      category: "Technology",
      score: 7123,
      accuracy: 83,
      timeSpent: "3:45",
      questionsAnswered: 9,
      rank: 6,
    },
  ]

  const categories = ["Science", "History", "Geography", "Sports", "Art", "Technology"]

  const filteredHistory = gameHistory.filter((game) => {
    const matchesSearch = game.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || game.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getScoreColor = (score: number) => {
    if (score >= 9000) return "text-green-400"
    if (score >= 7000) return "text-yellow-400"
    return "text-slate-300"
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-yellow-500"
    if (rank <= 3) return "bg-gray-400"
    if (rank <= 10) return "bg-orange-500"
    return "bg-slate-500"
  }

  const totalGames = gameHistory.length
  const averageScore = Math.round(gameHistory.reduce((sum, game) => sum + game.score, 0) / totalGames)
  const averageAccuracy = Math.round(gameHistory.reduce((sum, game) => sum + game.accuracy, 0) / totalGames)
  const bestScore = Math.max(...gameHistory.map((game) => game.score))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Game History</h1>
        <p className="text-slate-400">Track your quiz performance and progress over time</p>
      </div>

      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-slate-800/50 border-purple-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Games</p>
                <p className="text-2xl font-bold text-white">{totalGames}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Best Score</p>
                <p className="text-2xl font-bold text-white">{bestScore.toLocaleString()}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Score</p>
                <p className="text-2xl font-bold text-white">{averageScore.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-800/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Accuracy</p>
                <p className="text-2xl font-bold text-white">{averageAccuracy}%</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game History Table */}
      <Card className="bg-slate-800/50 border-purple-800/50">
        <CardHeader>
          <CardTitle className="text-white">Recent Games</CardTitle>
          <CardDescription className="text-slate-400">
            Detailed history of your quiz sessions and performance
          </CardDescription>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">Date & Time</TableHead>
                <TableHead className="text-slate-300">Category</TableHead>
                <TableHead className="text-slate-300">Score</TableHead>
                <TableHead className="text-slate-300">Accuracy</TableHead>
                <TableHead className="text-slate-300">Time</TableHead>
                <TableHead className="text-slate-300">Questions</TableHead>
                <TableHead className="text-slate-300">Rank</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((game) => (
                <TableRow key={game.id} className="border-slate-700">
                  <TableCell className="font-medium">
                    <div className="text-white">{game.date}</div>
                    <div className="text-sm text-slate-400">{game.time}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{game.category}</Badge>
                  </TableCell>
                  <TableCell className={`font-bold ${getScoreColor(game.score)}`}>
                    {game.score.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-slate-300">{game.accuracy}%</TableCell>
                  <TableCell className="text-slate-300">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {game.timeSpent}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-300">{game.questionsAnswered}</TableCell>
                  <TableCell>
                    <Badge className={getRankBadge(game.rank)}>#{game.rank}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card className="bg-slate-800/50 border-purple-800/50">
        <CardHeader>
          <CardTitle className="text-white">Performance by Category</CardTitle>
          <CardDescription className="text-slate-400">
            Your average performance across different quiz categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryGames = gameHistory.filter((game) => game.category === category)
              if (categoryGames.length === 0) return null

              const avgScore = Math.round(
                categoryGames.reduce((sum, game) => sum + game.score, 0) / categoryGames.length,
              )
              const avgAccuracy = Math.round(
                categoryGames.reduce((sum, game) => sum + game.accuracy, 0) / categoryGames.length,
              )
              const gamesPlayed = categoryGames.length

              return (
                <div key={category} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{category[0]}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{category}</p>
                      <p className="text-sm text-slate-400">{gamesPlayed} games played</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{avgScore.toLocaleString()}</p>
                    <p className="text-sm text-green-400">{avgAccuracy}% accuracy</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
