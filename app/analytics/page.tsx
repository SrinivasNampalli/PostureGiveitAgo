"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAnalytics } from "@/contexts/AnalyticsContext"
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Activity,
  Clock,
  Award,
  Users,
  Star,
  Flame,
  Zap,
  Download,
  RefreshCw,
  Settings,
  ChevronRight,
  Trophy,
  Timer,
  Heart,
  ArrowUp,
  ArrowDown,
  Filter,
  Eye
} from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("overall")
  const [currentTime, setCurrentTime] = useState(new Date())
  const { stats, recentSessions, refreshStats, seedSampleData, clearAllData, isLoading } = useAnalytics()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const timeRanges = [
    { id: "1d", label: "24 Hours" },
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "3 Months" }
  ]

  const overallStats = [
    {
      title: "Total Sessions",
      value: stats.totalSessions.toString(),
      change: "+23%",
      trend: "up",
      icon: <Activity className="w-6 h-6" />,
      color: "text-blue-500",
      description: "Workout sessions completed"
    },
    {
      title: "Average Score",
      value: stats.averageScore > 0 ? stats.averageScore.toFixed(1) : "0",
      change: "+5.2%",
      trend: "up",
      icon: <Target className="w-6 h-6" />,
      color: "text-green-500",
      description: "Posture analysis score"
    },
    {
      title: "Exercise Time",
      value: `${(stats.totalExerciseTime / 60).toFixed(1)}h`,
      change: "+12%",
      trend: "up",
      icon: <Clock className="w-6 h-6" />,
      color: "text-purple-500",
      description: "Total time exercising"
    },
    {
      title: "Streak Days",
      value: stats.currentStreak.toString(),
      change: `+${Math.max(0, stats.currentStreak - stats.bestStreak + stats.currentStreak)}`,
      trend: "up",
      icon: <Flame className="w-6 h-6" />,
      color: "text-orange-500",
      description: "Consecutive active days"
    }
  ]

  const weeklyData = stats.weeklyData.map((data, index) => {
    const date = new Date(data.date)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return {
      day: dayNames[date.getDay()],
      sessions: data.sessions,
      score: Math.round(data.score),
      time: Math.round(data.time)
    }
  })

  const exerciseBreakdown = Object.entries(stats.exerciseBreakdown).map(([exercise, sessions]) => {
    const total = Object.values(stats.exerciseBreakdown).reduce((sum, count) => sum + count, 0)
    const percentage = total > 0 ? Math.round((sessions / total) * 100) : 0

    const colors: Record<string, string> = {
      posture: "bg-blue-500",
      pushup: "bg-green-500",
      squat: "bg-purple-500",
      plank: "bg-orange-500"
    }

    return {
      exercise: exercise.charAt(0).toUpperCase() + exercise.slice(1),
      sessions,
      percentage,
      color: colors[exercise] || "bg-gray-500"
    }
  })

  const achievements = stats.achievements.slice(0, 4).map(achievement => ({
    title: achievement.title,
    description: achievement.description,
    icon: <Trophy className="w-8 h-8" />,
    earned: achievement.earned,
    date: achievement.earnedDate ? new Date(achievement.earnedDate).toLocaleDateString() : undefined,
    progress: achievement.progress
  }))

  const formattedRecentSessions = recentSessions.map(session => ({
    id: session.id,
    type: session.type.charAt(0).toUpperCase() + session.type.slice(1),
    date: session.endTime.toLocaleDateString(),
    duration: `${Math.round(session.duration / 60)} min`,
    score: session.score,
    improvements: session.improvements
  }))

  const getMaxValue = (data: any[], key: string) => {
    return Math.max(...data.map(item => item[key]))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button variant="outline" className="hover:scale-105 transition-all">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{currentTime.toLocaleDateString()}</span>
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Analytics <span className="text-primary">Dashboard</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Track your fitness progress and insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={seedSampleData} className="hover:scale-105 transition-all">
                <Zap className="w-4 h-4 mr-2" />
                Add Sample Data
              </Button>
              <Button variant="outline" onClick={refreshStats} className="hover:scale-105 transition-all">
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={clearAllData} className="hover:scale-105 transition-all">
                <Download className="w-4 h-4 mr-2" />
                Clear Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Time Range Selector */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Overview</h2>
            <div className="flex space-x-2">
              {timeRanges.map((range) => (
                <Button
                  key={range.id}
                  variant={timeRange === range.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range.id)}
                  className="transition-all hover:scale-105"
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </Badge>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overallStats.map((stat, index) => (
            <Card key={index} className="p-6 hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={stat.color}>{stat.icon}</div>
                <div className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span className="ml-1">{stat.change}</span>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.description}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Weekly Progress Chart */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Weekly Progress</h3>
              <div className="flex space-x-2">
                <Button
                  variant={selectedMetric === "sessions" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric("sessions")}
                >
                  Sessions
                </Button>
                <Button
                  variant={selectedMetric === "score" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric("score")}
                >
                  Score
                </Button>
                <Button
                  variant={selectedMetric === "time" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMetric("time")}
                >
                  Time
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {weeklyData.map((day, index) => {
                const value = selectedMetric === "sessions" ? day.sessions :
                             selectedMetric === "score" ? day.score : day.time
                const maxValue = getMaxValue(weeklyData, selectedMetric as keyof typeof day)
                const percentage = (value / maxValue) * 100

                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">{day.day}</div>
                    <div className="flex-1 bg-muted rounded-full h-4 relative overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(15, percentage)}%` }}
                      >
                        <span className="text-primary-foreground text-xs font-bold">
                          {value}{selectedMetric === "score" ? "" : selectedMetric === "time" ? "m" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground w-16 text-right">
                      {selectedMetric === "sessions" && `${day.sessions} sessions`}
                      {selectedMetric === "score" && `${day.score} score`}
                      {selectedMetric === "time" && `${day.time}min`}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Exercise Breakdown */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Exercise Breakdown</h3>
            <div className="space-y-4">
              {exerciseBreakdown.map((exercise, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{exercise.exercise}</span>
                    <span className="text-sm text-muted-foreground">{exercise.sessions}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${exercise.color} transition-all duration-1000`}
                        style={{ width: `${exercise.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{exercise.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Sessions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recent Sessions</h3>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {formattedRecentSessions.map((session) => (
                <div key={session.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{session.type}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant={session.score >= 90 ? "default" : session.score >= 80 ? "secondary" : "destructive"}>
                        {session.score}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>{session.date}</span>
                    <span>{session.duration}</span>
                  </div>
                  <div className="space-y-1">
                    {session.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center text-sm text-green-600">
                        <TrendingUp className="w-3 h-3 mr-2" />
                        {improvement}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Achievements</h3>
              <Button variant="outline" size="sm">
                <Trophy className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-all">
                  <div className={`${achievement.earned ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    {achievement.earned ? (
                      <p className="text-xs text-green-600 mt-1">Earned {achievement.date}</p>
                    ) : (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1">
                          <div
                            className="bg-primary h-1 rounded-full transition-all duration-1000"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Goals Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Weekly Goals</h3>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Edit Goals
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {stats.goals.map((goal, index) => {
              const percentage = (goal.current / goal.target) * 100
              const isCompleted = goal.current >= goal.target

              return (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{goal.title}</h4>
                    {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="text-2xl font-bold mb-2">
                    {goal.current} <span className="text-sm text-muted-foreground">/ {goal.target} {goal.unit}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        isCompleted ? 'bg-green-500' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {Math.round(percentage)}% complete
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

      </div>
    </div>
  )
}