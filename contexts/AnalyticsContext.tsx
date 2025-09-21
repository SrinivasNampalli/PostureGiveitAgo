"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { analyticsService, SessionData, UserStats } from '@/lib/analytics'

interface AnalyticsContextType {
  stats: UserStats
  recentSessions: SessionData[]
  saveSession: (sessionData: Omit<SessionData, 'id' | 'date'>) => SessionData
  refreshStats: () => void
  seedSampleData: () => void
  clearAllData: () => void
  isLoading: boolean
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<UserStats>(analyticsService.getStats())
  const [recentSessions, setRecentSessions] = useState<SessionData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshStats = () => {
    setIsLoading(true)
    try {
      const newStats = analyticsService.getStats()
      const newRecentSessions = analyticsService.getRecentSessions()

      setStats(newStats)
      setRecentSessions(newRecentSessions)
    } catch (error) {
      console.error('Error refreshing stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSession = (sessionData: Omit<SessionData, 'id' | 'date'>): SessionData => {
    const session = analyticsService.saveSession(sessionData)
    refreshStats()
    return session
  }

  const seedSampleData = () => {
    analyticsService.seedSampleData()
    refreshStats()
  }

  const clearAllData = () => {
    analyticsService.clearAllData()
    refreshStats()
  }

  useEffect(() => {
    refreshStats()
  }, [])

  const value: AnalyticsContextType = {
    stats,
    recentSessions,
    saveSession,
    refreshStats,
    seedSampleData,
    clearAllData,
    isLoading
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

// Hook for easy session tracking
export function useSessionTracker() {
  const { saveSession } = useAnalytics()

  const startSession = (type: SessionData['type']) => {
    const startTime = new Date()

    return {
      complete: (score: number, improvements: string[] = [], exerciseCount?: number, formQuality?: number) => {
        const endTime = new Date()
        const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

        return saveSession({
          type,
          startTime,
          endTime,
          duration,
          score,
          improvements,
          exerciseCount,
          formQuality
        })
      }
    }
  }

  return { startSession }
}