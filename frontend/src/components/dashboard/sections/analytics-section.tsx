"use client"

import { TrendingUp, Users, Target, Trophy } from "lucide-react"

export function AnalyticsSection() {
  const analyticsData = {
    totalUsers: 1234,
    activeUsers: 456,
    totalGames: 5678,
    averageScore: 78.5,
    popularCategories: [
      { name: "Science", games: 1234, percentage: 22 },
      { name: "History", games: 1098, percentage: 19 },
      { name: "Geography", games: 987, percentage: 17 },
      { name: "Sports", games: 876, percentage: 15 },
      { name: "Art", games: 765, percentage: 14 },
      { name: "Technology", games: 718, percentage: 13 },
    ],
    userEngagement: {
      dailyActive: 89,
      weeklyActive: 234,
      monthlyActive: 456,
      retention: 67,
    },
    performanceMetrics: {
      averageTime: "2:34",
      completionRate: 85,
      accuracyRate: 78,
      difficultyDistribution: {
        easy: 45,
        medium: 35,
        hard: 20,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Game Analytics</h1>
        <p className="text-slate-400">Comprehensive insights into quiz performance and user engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
          <div className="flex flex-row items-center justify-between p-4 pb-2">
            <h3 className="text-sm font-medium text-slate-300">Total Users</h3>
            <Users className="h-4 w-4 text-purple-400" />
          </div>
          <div className="p-4 pt-2">
            <div className="text-2xl font-bold text-white">{analyticsData.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-green-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </div>
        </div>

        <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
          <div className="flex flex-row items-center justify-between p-4 pb-2">
            <h3 className="text-sm font-medium text-slate-300">Active Users</h3>
            <Target className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="p-4 pt-2">
            <div className="text-2xl font-bold text-white">{analyticsData.activeUsers}</div>
            <p className="text-xs text-green-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8% from yesterday
            </p>
          </div>
        </div>

        <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
          <div className="flex flex-row items-center justify-between p-4 pb-2">
            <h3 className="text-sm font-medium text-slate-300">Total Games</h3>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="p-4 pt-2">
            <div className="text-2xl font-bold text-white">{analyticsData.totalGames.toLocaleString()}</div>
            <p className="text-xs text-green-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +156 today
            </p>
          </div>
        </div>

        <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
          <div className="flex flex-row items-center justify-between p-4 pb-2">
            <h3 className="text-sm font-medium text-slate-300">Avg Score</h3>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <div className="p-4 pt-2">
            <div className="text-2xl font-bold text-white">{analyticsData.averageScore}%</div>
            <p className="text-xs text-green-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2.1% improvement
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Popular Categories */}
        <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#2a2550]/50">
            <h3 className="text-lg font-medium text-white">Popular Categories</h3>
            <p className="text-sm text-slate-400">Game distribution across quiz categories</p>
          </div>
          <div className="p-4 space-y-4">
            {analyticsData.popularCategories.map((category, index) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">{category.name}</span>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                      {category.games} games
                    </span>
                  </div>
                  <span className="text-white font-medium">{category.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-[#1a1836] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#9f6bff] rounded-full" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#2a2550]/50">
            <h3 className="text-lg font-medium text-white">User Engagement</h3>
            <p className="text-sm text-slate-400">Active user metrics and retention rates</p>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-[#1a1836]/70">
                <div>
                  <p className="text-white font-medium">Daily Active Users</p>
                  <p className="text-sm text-slate-400">Users active in last 24h</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{analyticsData.userEngagement.dailyActive}</p>
                  <p className="text-xs text-green-400">+5.2%</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-[#1a1836]/70">
                <div>
                  <p className="text-white font-medium">Weekly Active Users</p>
                  <p className="text-sm text-slate-400">Users active in last 7 days</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{analyticsData.userEngagement.weeklyActive}</p>
                  <p className="text-xs text-green-400">+8.1%</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-[#1a1836]/70">
                <div>
                  <p className="text-white font-medium">Monthly Active Users</p>
                  <p className="text-sm text-slate-400">Users active in last 30 days</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{analyticsData.userEngagement.monthlyActive}</p>
                  <p className="text-xs text-green-400">+12.3%</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-[#1a1836]/70">
                <div>
                  <p className="text-white font-medium">User Retention</p>
                  <p className="text-sm text-slate-400">7-day retention rate</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{analyticsData.userEngagement.retention}%</p>
                  <p className="text-xs text-red-400">-2.1%</p>
                </div>
              </div>
              </div>
              </div>
              </div>
              </div>
              </div>
  )}
  
              
