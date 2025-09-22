"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface AuthUser {
  id: string
  username: string
  avatar: string
  createdAt: Date
}

interface AuthContextType {
  currentUser: AuthUser | null
  isAuthenticated: boolean
  login: (username: string) => Promise<{ success: boolean; message?: string }>
  signup: (username: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  getAllUsers: () => AuthUser[]
  switchUser: (userId: string) => boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCurrentUser()
  }, [])

  const loadCurrentUser = () => {
    try {
      const savedUserId = localStorage.getItem('current-user-id')
      if (savedUserId) {
        const users = getAllUsers()
        const user = users.find(u => u.id === savedUserId)
        if (user) {
          setCurrentUser(user)
        } else {
          localStorage.removeItem('current-user-id')
        }
      }
    } catch (error) {
      console.error('Error loading current user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAllUsers = (): AuthUser[] => {
    try {
      const users = localStorage.getItem('app-users')
      if (users) {
        return JSON.parse(users).map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt)
        }))
      }
      return []
    } catch {
      return []
    }
  }

  const saveUsers = (users: AuthUser[]) => {
    localStorage.setItem('app-users', JSON.stringify(users))
  }

  const generateUserId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  }

  const generateAvatar = (username: string) => {
    return username.charAt(0).toUpperCase()
  }

  const signup = async (username: string): Promise<{ success: boolean; message?: string }> => {
    if (!username || username.trim().length < 2) {
      return { success: false, message: "Username must be at least 2 characters long" }
    }

    const trimmedUsername = username.trim()
    const users = getAllUsers()

    // Check if username already exists
    if (users.some(user => user.username.toLowerCase() === trimmedUsername.toLowerCase())) {
      return { success: false, message: "Username already exists" }
    }

    // Create new user
    const newUser: AuthUser = {
      id: generateUserId(),
      username: trimmedUsername,
      avatar: generateAvatar(trimmedUsername),
      createdAt: new Date()
    }

    users.push(newUser)
    saveUsers(users)

    // Auto-login the new user
    setCurrentUser(newUser)
    localStorage.setItem('current-user-id', newUser.id)

    return { success: true }
  }

  const login = async (username: string): Promise<{ success: boolean; message?: string }> => {
    if (!username || username.trim().length === 0) {
      return { success: false, message: "Please enter a username" }
    }

    const trimmedUsername = username.trim()
    const users = getAllUsers()
    const user = users.find(u => u.username.toLowerCase() === trimmedUsername.toLowerCase())

    if (!user) {
      return { success: false, message: "User not found" }
    }

    setCurrentUser(user)
    localStorage.setItem('current-user-id', user.id)

    return { success: true }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('current-user-id')
  }

  const switchUser = (userId: string): boolean => {
    const users = getAllUsers()
    const user = users.find(u => u.id === userId)

    if (user) {
      setCurrentUser(user)
      localStorage.setItem('current-user-id', user.id)
      return true
    }

    return false
  }

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    signup,
    logout,
    getAllUsers,
    switchUser,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}