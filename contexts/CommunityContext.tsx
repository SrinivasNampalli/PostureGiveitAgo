"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  communityService,
  Post,
  User,
  Challenge,
  Group,
  CommunityStats,
  Comment
} from '@/lib/community'
import { useAuth } from '@/contexts/AuthContext'

interface CommunityContextType {
  // User
  currentUser: User | null
  updateCurrentUser: (user: Partial<User>) => void

  // Posts
  posts: Post[]
  createPost: (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares' | 'likedBy' | 'user' | 'userId'>) => void
  likePost: (postId: string) => void
  addComment: (postId: string, content: string) => void
  refreshPosts: () => void

  // Challenges
  challenges: Challenge[]
  joinChallenge: (challengeId: string) => void
  updateChallengeProgress: (challengeId: string, progress: number) => void
  refreshChallenges: () => void

  // Groups
  groups: Group[]
  joinGroup: (groupId: string) => void
  leaveGroup: (groupId: string) => void
  refreshGroups: () => void

  // Leaderboard
  leaderboard: User[]
  refreshLeaderboard: () => void

  // Stats
  communityStats: CommunityStats
  refreshStats: () => void

  // Utility
  seedSampleData: () => void
  clearAllData: () => void
  isLoading: boolean
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)

export function CommunityProvider({ children }: { children: ReactNode }) {
  const { currentUser: authUser, isAuthenticated } = useAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [leaderboard, setLeaderboard] = useState<User[]>([])
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalMembers: 0,
    onlineMembers: 0,
    postsToday: 0,
    activeChallenges: 0,
    countries: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Initialize data when auth user changes
  useEffect(() => {
    // Initialize the service in the browser
    communityService.initializeInBrowser()

    if (authUser) {
      // Set the current user for the community service
      communityService.setCurrentUser(authUser.id)

      // Create or get community user profile
      let communityUser = communityService.getUserById(authUser.id)
      if (!communityUser) {
        communityUser = communityService.createCommunityUser(authUser)
      }

      setCurrentUser(communityUser)
      refreshAll()
    } else {
      // Guest mode
      communityService.setCurrentUser(null)
      setCurrentUser(null)
      refreshAll()
    }
  }, [authUser])

  const refreshAll = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        refreshPosts(),
        refreshChallenges(),
        refreshGroups(),
        refreshLeaderboard(),
        refreshStats()
      ])
    } catch (error) {
      console.error('Error refreshing community data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateCurrentUser = (userData: Partial<User>) => {
    if (!currentUser) return

    const updatedUser = { ...currentUser, ...userData }
    setCurrentUser(updatedUser)

    // Save to community users storage
    try {
      const users = communityService.getUsers()
      const userIndex = users.findIndex(u => u.id === updatedUser.id)
      if (userIndex >= 0) {
        users[userIndex] = updatedUser
        communityService.saveUsers(users)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const refreshPosts = async () => {
    try {
      const newPosts = communityService.getPosts()
      setPosts(newPosts)
    } catch (error) {
      console.error('Error refreshing posts:', error)
    }
  }

  const createPost = (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares' | 'likedBy' | 'user' | 'userId'>) => {
    try {
      const newPost = communityService.createPost({
        ...postData,
        userId: currentUser.id,
        user: currentUser
      })
      setPosts(prev => [newPost, ...prev])

      // Update user score for creating content
      updateCurrentUser({ score: currentUser.score + 10 })
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const likePost = (postId: string) => {
    try {
      communityService.likePost(postId, currentUser.id)
      refreshPosts()
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const addComment = (postId: string, content: string) => {
    try {
      communityService.addComment(postId, content, currentUser)
      refreshPosts()

      // Update user score for engagement
      updateCurrentUser({ score: currentUser.score + 5 })
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const refreshChallenges = async () => {
    try {
      const newChallenges = communityService.getChallenges()
      setChallenges(newChallenges)
    } catch (error) {
      console.error('Error refreshing challenges:', error)
    }
  }

  const joinChallenge = (challengeId: string) => {
    try {
      communityService.joinChallenge(challengeId, currentUser.id)
      refreshChallenges()

      // Update user score for joining challenge
      updateCurrentUser({ score: currentUser.score + 25 })
    } catch (error) {
      console.error('Error joining challenge:', error)
    }
  }

  const updateChallengeProgress = (challengeId: string, progress: number) => {
    try {
      communityService.updateChallengeProgress(challengeId, currentUser.id, progress)
      refreshChallenges()

      // Bonus points for completing challenges
      if (progress >= 100) {
        updateCurrentUser({ score: currentUser.score + 100 })
      }
    } catch (error) {
      console.error('Error updating challenge progress:', error)
    }
  }

  const refreshGroups = async () => {
    try {
      const newGroups = communityService.getGroups()
      setGroups(newGroups)
    } catch (error) {
      console.error('Error refreshing groups:', error)
    }
  }

  const joinGroup = (groupId: string) => {
    try {
      communityService.joinGroup(groupId, currentUser.id)
      refreshGroups()

      // Update user score for joining group
      updateCurrentUser({ score: currentUser.score + 15 })
    } catch (error) {
      console.error('Error joining group:', error)
    }
  }

  const leaveGroup = (groupId: string) => {
    try {
      communityService.leaveGroup(groupId, currentUser.id)
      refreshGroups()
    } catch (error) {
      console.error('Error leaving group:', error)
    }
  }

  const refreshLeaderboard = async () => {
    try {
      const newLeaderboard = communityService.getLeaderboard()
      setLeaderboard(newLeaderboard)
    } catch (error) {
      console.error('Error refreshing leaderboard:', error)
    }
  }

  const refreshStats = async () => {
    try {
      const newStats = communityService.getCommunityStats()
      setCommunityStats(newStats)
    } catch (error) {
      console.error('Error refreshing stats:', error)
    }
  }

  const seedSampleData = () => {
    communityService.seedSampleData()
    refreshAll()
  }

  const clearAllData = () => {
    communityService.clearAllData()
    setCurrentUser(communityService.getCurrentUser())
    refreshAll()
  }

  const value: CommunityContextType = {
    currentUser,
    updateCurrentUser,
    posts,
    createPost,
    likePost,
    addComment,
    refreshPosts,
    challenges,
    joinChallenge,
    updateChallengeProgress,
    refreshChallenges,
    groups,
    joinGroup,
    leaveGroup,
    refreshGroups,
    leaderboard,
    refreshLeaderboard,
    communityStats,
    refreshStats,
    seedSampleData,
    clearAllData,
    isLoading
  }

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity(): CommunityContextType {
  const context = useContext(CommunityContext)
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider')
  }
  return context
}