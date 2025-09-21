// Analytics service for tracking real user data
export interface SessionData {
  id: string
  type: 'posture' | 'pushup' | 'squat' | 'plank'
  startTime: Date
  endTime: Date
  duration: number // in seconds
  score: number
  exerciseCount?: number
  formQuality?: number
  improvements: string[]
  date: string // YYYY-MM-DD format
}

export interface UserStats {
  totalSessions: number
  totalExerciseTime: number // in minutes
  averageScore: number
  currentStreak: number
  bestStreak: number
  exerciseBreakdown: Record<string, number>
  weeklyData: WeeklyData[]
  achievements: Achievement[]
  goals: UserGoal[]
}

export interface WeeklyData {
  date: string
  sessions: number
  score: number
  time: number // in minutes
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: Date
  progress?: number
  target?: number
}

export interface UserGoal {
  id: string
  title: string
  current: number
  target: number
  unit: string
  timeframe: 'daily' | 'weekly' | 'monthly'
  startDate: Date
}

class AnalyticsService {
  private storageKey = 'fitness-analytics'
  private sessionsKey = 'fitness-sessions'

  // Save session data
  saveSession(sessionData: Omit<SessionData, 'id' | 'date'>): SessionData {
    const session: SessionData = {
      ...sessionData,
      id: this.generateId(),
      date: new Date().toISOString().split('T')[0]
    }

    const sessions = this.getSessions()
    sessions.push(session)
    localStorage.setItem(this.sessionsKey, JSON.stringify(sessions))

    // Update stats
    this.updateStats(session)

    return session
  }

  // Get all sessions
  getSessions(): SessionData[] {
    try {
      const sessions = localStorage.getItem(this.sessionsKey)
      if (!sessions) return []
      return JSON.parse(sessions).map((s: any) => ({
        ...s,
        startTime: new Date(s.startTime),
        endTime: new Date(s.endTime)
      }))
    } catch {
      return []
    }
  }

  // Get user stats
  getStats(): UserStats {
    try {
      const stats = localStorage.getItem(this.storageKey)
      if (!stats) return this.getDefaultStats()

      const parsed = JSON.parse(stats)
      return {
        ...parsed,
        goals: parsed.goals?.map((g: any) => ({
          ...g,
          startDate: new Date(g.startDate)
        })) || []
      }
    } catch {
      return this.getDefaultStats()
    }
  }

  // Update stats after new session
  private updateStats(session: SessionData) {
    const stats = this.getStats()
    const sessions = this.getSessions()

    // Update basic stats
    stats.totalSessions = sessions.length
    stats.totalExerciseTime = sessions.reduce((total, s) => total + (s.duration / 60), 0)
    stats.averageScore = sessions.reduce((total, s) => total + s.score, 0) / sessions.length

    // Update exercise breakdown
    stats.exerciseBreakdown[session.type] = (stats.exerciseBreakdown[session.type] || 0) + 1

    // Update streak
    stats.currentStreak = this.calculateCurrentStreak(sessions)
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak)

    // Update weekly data
    stats.weeklyData = this.calculateWeeklyData(sessions)

    // Check achievements
    stats.achievements = this.updateAchievements(stats, sessions)

    // Update goals
    stats.goals = this.updateGoals(stats.goals, session)

    localStorage.setItem(this.storageKey, JSON.stringify(stats))
  }

  private calculateCurrentStreak(sessions: SessionData[]): number {
    if (sessions.length === 0) return 0

    const today = new Date().toISOString().split('T')[0]
    const sortedSessions = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    let streak = 0
    let currentDate = today

    for (const session of sortedSessions) {
      if (session.date === currentDate) {
        streak++
        // Move to previous day
        const date = new Date(currentDate)
        date.setDate(date.getDate() - 1)
        currentDate = date.toISOString().split('T')[0]
      } else if (session.date < currentDate) {
        break
      }
    }

    return streak
  }

  private calculateWeeklyData(sessions: SessionData[]): WeeklyData[] {
    const weekData: Record<string, WeeklyData> = {}

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      weekData[dateStr] = {
        date: dateStr,
        sessions: 0,
        score: 0,
        time: 0
      }
    }

    // Populate with actual data
    sessions.forEach(session => {
      if (weekData[session.date]) {
        weekData[session.date].sessions++
        weekData[session.date].score = (weekData[session.date].score * (weekData[session.date].sessions - 1) + session.score) / weekData[session.date].sessions
        weekData[session.date].time += session.duration / 60
      }
    })

    return Object.values(weekData)
  }

  private updateAchievements(stats: UserStats, sessions: SessionData[]): Achievement[] {
    const achievements = [...stats.achievements]

    // Define all possible achievements
    const allAchievements = [
      {
        id: 'first-session',
        title: 'Getting Started',
        description: 'Complete your first session',
        icon: '🚀',
        target: 1
      },
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: '7 days of consistent workouts',
        icon: '🔥',
        target: 7
      },
      {
        id: 'form-master',
        title: 'Form Master',
        description: 'Achieve 95%+ average score',
        icon: '🎯',
        target: 95
      },
      {
        id: 'century-club',
        title: 'Century Club',
        description: '100 total sessions completed',
        icon: '💯',
        target: 100
      },
      {
        id: 'marathon',
        title: 'Marathon',
        description: '50 hours total exercise time',
        icon: '⏱️',
        target: 50
      },
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieve a perfect 100 score',
        icon: '⭐',
        target: 100
      }
    ]

    allAchievements.forEach(achDef => {
      let existing = achievements.find(a => a.id === achDef.id)

      if (!existing) {
        existing = {
          ...achDef,
          earned: false,
          progress: 0
        }
        achievements.push(existing)
      }

      if (!existing.earned) {
        let progress = 0

        switch (achDef.id) {
          case 'first-session':
            progress = Math.min(sessions.length, achDef.target)
            break
          case 'week-warrior':
            progress = Math.min(stats.currentStreak, achDef.target)
            break
          case 'form-master':
            progress = Math.min(stats.averageScore, achDef.target)
            break
          case 'century-club':
            progress = Math.min(sessions.length, achDef.target)
            break
          case 'marathon':
            progress = Math.min(stats.totalExerciseTime, achDef.target)
            break
          case 'perfectionist':
            const perfectSessions = sessions.filter(s => s.score >= 100)
            progress = perfectSessions.length > 0 ? achDef.target : 0
            break
        }

        existing.progress = progress

        if (progress >= achDef.target) {
          existing.earned = true
          existing.earnedDate = new Date()
        }
      }
    })

    return achievements
  }

  private updateGoals(goals: UserGoal[], session: SessionData): UserGoal[] {
    const today = new Date().toISOString().split('T')[0]

    // Update weekly goals
    return goals.map(goal => {
      if (goal.timeframe === 'weekly') {
        const weekStart = this.getWeekStart(new Date())
        const weekStartStr = weekStart.toISOString().split('T')[0]

        if (goal.startDate.toISOString().split('T')[0] === weekStartStr) {
          // Count sessions this week
          const sessions = this.getSessions()
          const thisWeekSessions = sessions.filter(s => {
            const sessionDate = new Date(s.date)
            return sessionDate >= weekStart
          })

          switch (goal.id) {
            case 'weekly-sessions':
              goal.current = thisWeekSessions.length
              break
            case 'weekly-time':
              goal.current = Math.round(thisWeekSessions.reduce((total, s) => total + (s.duration / 60), 0))
              break
            case 'weekly-score':
              goal.current = thisWeekSessions.length > 0
                ? Math.round(thisWeekSessions.reduce((total, s) => total + s.score, 0) / thisWeekSessions.length)
                : 0
              break
          }
        }
      }
      return goal
    })
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  private getDefaultStats(): UserStats {
    const weekStart = this.getWeekStart(new Date())

    return {
      totalSessions: 0,
      totalExerciseTime: 0,
      averageScore: 0,
      currentStreak: 0,
      bestStreak: 0,
      exerciseBreakdown: {},
      weeklyData: [],
      achievements: [],
      goals: [
        {
          id: 'weekly-sessions',
          title: 'Exercise Sessions',
          current: 0,
          target: 7,
          unit: 'sessions',
          timeframe: 'weekly',
          startDate: weekStart
        },
        {
          id: 'weekly-time',
          title: 'Exercise Time',
          current: 0,
          target: 300,
          unit: 'minutes',
          timeframe: 'weekly',
          startDate: weekStart
        },
        {
          id: 'weekly-score',
          title: 'Average Score',
          current: 0,
          target: 90,
          unit: 'points',
          timeframe: 'weekly',
          startDate: weekStart
        }
      ]
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  }

  // Get recent sessions for dashboard
  getRecentSessions(limit = 5): SessionData[] {
    return this.getSessions()
      .sort((a, b) => b.endTime.getTime() - a.endTime.getTime())
      .slice(0, limit)
  }

  // Clear all data (for testing)
  clearAllData() {
    localStorage.removeItem(this.storageKey)
    localStorage.removeItem(this.sessionsKey)
  }

  // Seed with sample data for demo
  seedSampleData() {
    const sampleSessions: Omit<SessionData, 'id' | 'date'>[] = [
      {
        type: 'posture',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 12 * 60 * 1000),
        duration: 720,
        score: 92,
        improvements: ['Shoulder alignment +3%', 'Spine posture +5%']
      },
      {
        type: 'pushup',
        startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 6 * 60 * 60 * 1000 + 8 * 60 * 1000),
        duration: 480,
        score: 88,
        exerciseCount: 25,
        formQuality: 85,
        improvements: ['Form consistency +7%', 'Rep count +2']
      },
      {
        type: 'squat',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
        duration: 600,
        score: 95,
        exerciseCount: 30,
        formQuality: 92,
        improvements: ['Depth accuracy +4%', 'Balance +6%']
      }
    ]

    sampleSessions.forEach(session => this.saveSession(session))
  }
}

export const analyticsService = new AnalyticsService()