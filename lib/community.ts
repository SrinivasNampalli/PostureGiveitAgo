// Community service for managing posts, challenges, and interactions

export interface User {
  id: string
  name: string
  avatar: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Grandmaster"
  streak: number
  location: string
  score: number
  joinedDate: Date
}

export interface Post {
  id: string
  userId: string
  user: User
  type: "achievement" | "progress" | "question" | "workout" | "general"
  content: string
  timestamp: Date
  likes: number
  comments: Comment[]
  shares: number
  achievement?: {
    title: string
    description: string
    icon: string
  }
  progress?: {
    metric: string
    before: number
    after: number
    improvement: string
  }
  workout?: {
    type: string
    duration: string
    exercises: string[]
    score: number
  }
  tags?: string[]
  image?: string
  likedBy: string[]
}

export interface Comment {
  id: string
  userId: string
  user: User
  content: string
  timestamp: Date
  likes: number
}

export interface Challenge {
  id: string
  title: string
  description: string
  participants: string[]
  startDate: Date
  endDate: Date
  difficulty: "beginner" | "intermediate" | "advanced"
  reward: string
  progress: Record<string, number> // userId -> progress percentage
  type: "posture" | "pushup" | "squat" | "plank" | "general"
  target: {
    metric: string
    value: number
    unit: string
  }
}

export interface Group {
  id: string
  name: string
  description: string
  members: string[]
  posts: string[]
  category: string
  createdDate: Date
  activity: "Low" | "Moderate" | "Active" | "Very Active"
  admins: string[]
}

export interface CommunityStats {
  totalMembers: number
  onlineMembers: number
  postsToday: number
  activeChallenges: number
  countries: number
}

class CommunityService {
  private currentUserId: string | null = null
  private initialized = false

  constructor() {
    this.initializeService()
  }

  private initializeService(): void {
    if (this.initialized || typeof window === 'undefined') return

    // Clean up old user-scoped posts from previous implementation (browser only)
    this.clearOldUserScopedPosts()
    this.initialized = true
  }

  getStorageKeys(userId?: string) {
    const uid = userId || this.currentUserId || 'guest'
    return {
      posts: 'community-posts', // Global posts - all users see all posts
      users: 'community-users', // Global users list
      challenges: 'community-challenges', // Global challenges - all users see same challenges
      groups: 'community-groups', // Global groups - all users see same groups
      userProgress: `community-progress-${uid}`, // User-specific progress
      stats: 'community-stats' // Global stats
    }
  }

  setCurrentUser(userId: string | null) {
    this.currentUserId = userId
  }

  // Initialize the service in the browser (call this from client-side components)
  initializeInBrowser(): void {
    if (typeof window !== 'undefined' && !this.initialized) {
      this.clearOldUserScopedPosts()
      this.initialized = true
    }
  }

  // Get user by ID from auth system
  getUserById(userId: string): User | null {
    try {
      const users = this.getUsers()
      return users.find(u => u.id === userId) || null
    } catch {
      return null
    }
  }

  // Convert auth user to community user format
  createCommunityUser(authUser: { id: string; username: string; avatar: string; createdAt: Date }): User {
    const communityUser = {
      id: authUser.id,
      name: authUser.username,
      avatar: authUser.avatar,
      level: "Beginner" as const,
      streak: 0,
      location: "Your Location",
      score: 0,
      joinedDate: authUser.createdAt
    }

    // Add user to community users if not exists
    const users = this.getUsers()
    const existingUser = users.find(u => u.id === authUser.id)
    if (!existingUser) {
      users.push(communityUser)
      this.saveUsers(users)
    }

    return existingUser || communityUser
  }

  // Posts management
  getPosts(): Post[] {
    try {
      const storageKeys = this.getStorageKeys()
      const posts = localStorage.getItem(storageKeys.posts)
      if (!posts) return this.getDefaultPosts()

      return JSON.parse(posts).map((post: any) => ({
        ...post,
        timestamp: new Date(post.timestamp),
        user: {
          ...post.user,
          joinedDate: new Date(post.user.joinedDate)
        },
        comments: post.comments?.map((comment: any) => ({
          ...comment,
          timestamp: new Date(comment.timestamp),
          user: {
            ...comment.user,
            joinedDate: new Date(comment.user.joinedDate)
          }
        })) || []
      }))
    } catch {
      return this.getDefaultPosts()
    }
  }

  createPost(postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares' | 'likedBy'>): Post {
    const newPost: Post = {
      ...postData,
      id: this.generateId(),
      timestamp: new Date(),
      likes: 0,
      comments: [],
      shares: 0,
      likedBy: []
    }

    const posts = this.getPosts()
    posts.unshift(newPost)
    this.savePosts(posts)

    return newPost
  }

  likePost(postId: string, userId: string): void {
    const posts = this.getPosts()
    const post = posts.find(p => p.id === postId)

    if (post) {
      const isLiked = post.likedBy.includes(userId)
      if (isLiked) {
        post.likedBy = post.likedBy.filter(id => id !== userId)
        post.likes = Math.max(0, post.likes - 1)
      } else {
        post.likedBy.push(userId)
        post.likes += 1
      }
      this.savePosts(posts)
    }
  }

  addComment(postId: string, content: string, user: User): Comment {
    const posts = this.getPosts()
    const post = posts.find(p => p.id === postId)

    if (post) {
      const comment: Comment = {
        id: this.generateId(),
        userId: user.id,
        user,
        content,
        timestamp: new Date(),
        likes: 0
      }

      post.comments.push(comment)
      this.savePosts(posts)
      return comment
    }

    throw new Error('Post not found')
  }

  // Challenges management
  getChallenges(): Challenge[] {
    try {
      const storageKeys = this.getStorageKeys()
      const challenges = localStorage.getItem(storageKeys.challenges)
      if (!challenges) return this.getDefaultChallenges()

      return JSON.parse(challenges).map((challenge: any) => ({
        ...challenge,
        startDate: new Date(challenge.startDate),
        endDate: new Date(challenge.endDate)
      }))
    } catch {
      return this.getDefaultChallenges()
    }
  }

  joinChallenge(challengeId: string, userId: string): void {
    const challenges = this.getChallenges()
    const challenge = challenges.find(c => c.id === challengeId)

    if (challenge && !challenge.participants.includes(userId)) {
      challenge.participants.push(userId)
      challenge.progress[userId] = 0
      this.saveChallenges(challenges)
    }
  }

  updateChallengeProgress(challengeId: string, userId: string, progress: number): void {
    const challenges = this.getChallenges()
    const challenge = challenges.find(c => c.id === challengeId)

    if (challenge && challenge.participants.includes(userId)) {
      challenge.progress[userId] = Math.min(100, Math.max(0, progress))
      this.saveChallenges(challenges)
    }
  }

  // Groups management
  getGroups(): Group[] {
    try {
      const storageKeys = this.getStorageKeys()
      const groups = localStorage.getItem(storageKeys.groups)
      if (!groups) return this.getDefaultGroups()

      return JSON.parse(groups).map((group: any) => ({
        ...group,
        createdDate: new Date(group.createdDate)
      }))
    } catch {
      return this.getDefaultGroups()
    }
  }

  joinGroup(groupId: string, userId: string): void {
    const groups = this.getGroups()
    const group = groups.find(g => g.id === groupId)

    if (group && !group.members.includes(userId)) {
      group.members.push(userId)
      this.saveGroups(groups)
    }
  }

  leaveGroup(groupId: string, userId: string): void {
    const groups = this.getGroups()
    const group = groups.find(g => g.id === groupId)

    if (group) {
      group.members = group.members.filter(id => id !== userId)
      this.saveGroups(groups)
    }
  }

  // Leaderboard
  getLeaderboard(): User[] {
    const users = this.getUsers()
    return users
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
      .map((user, index) => ({ ...user, rank: index + 1 } as any))
  }

  // Community stats
  getCommunityStats(): CommunityStats {
    try {
      const stored = localStorage.getItem(this.storageKeys.stats)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {}

    // Generate dynamic stats
    const posts = this.getPosts()
    const users = this.getUsers()
    const challenges = this.getChallenges()

    const today = new Date().toISOString().split('T')[0]
    const postsToday = posts.filter(p =>
      p.timestamp.toISOString().split('T')[0] === today
    ).length

    const stats: CommunityStats = {
      totalMembers: users.length + 12800, // Add base number for realism
      onlineMembers: Math.floor((users.length + 2100) * 0.15), // ~15% online
      postsToday: postsToday + Math.floor(Math.random() * 50) + 200,
      activeChallenges: challenges.length + 21,
      countries: 89
    }

    localStorage.setItem(this.storageKeys.stats, JSON.stringify(stats))
    return stats
  }

  // Private helper methods
  private savePosts(posts: Post[]): void {
    const storageKeys = this.getStorageKeys()
    localStorage.setItem(storageKeys.posts, JSON.stringify(posts))
  }

  private saveChallenges(challenges: Challenge[]): void {
    const storageKeys = this.getStorageKeys()
    localStorage.setItem(storageKeys.challenges, JSON.stringify(challenges))
  }

  private saveGroups(groups: Group[]): void {
    const storageKeys = this.getStorageKeys()
    localStorage.setItem(storageKeys.groups, JSON.stringify(groups))
  }

  getUsers(): User[] {
    try {
      const storageKeys = this.getStorageKeys()
      const users = localStorage.getItem(storageKeys.users)
      if (users) {
        return JSON.parse(users).map((user: any) => ({
          ...user,
          joinedDate: new Date(user.joinedDate)
        }))
      }

      // Initialize with default users if none exist
      const defaultUsers = this.getDefaultUsers()
      this.saveUsers(defaultUsers)
      return defaultUsers
    } catch {
      return this.getDefaultUsers()
    }
  }

  saveUsers(users: User[]): void {
    const storageKeys = this.getStorageKeys()
    localStorage.setItem(storageKeys.users, JSON.stringify(users))
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  }

  // Default data generators
  private getDefaultPosts(): Post[] {
    const defaultUsers = this.getDefaultUsers()

    return [
      {
        id: "post1",
        userId: "user1",
        user: defaultUsers[0],
        type: "achievement",
        content: "Just hit my 100th workout session! 🎉 The posture analysis has been a game-changer for my daily routine. My back pain is completely gone!",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 47,
        comments: [],
        shares: 3,
        achievement: {
          title: "Century Club",
          description: "100 workout sessions completed",
          icon: "🏆"
        },
        likedBy: [],
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
      },
      {
        id: "post2",
        userId: "user2",
        user: defaultUsers[1],
        type: "progress",
        content: "Week 3 of the posture challenge and seeing amazing results! My average score went from 72 to 89. Here's my weekly breakdown:",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 23,
        comments: [],
        shares: 1,
        progress: {
          metric: "Average Posture Score",
          before: 72,
          after: 89,
          improvement: "+23%"
        },
        likedBy: []
      },
      {
        id: "post3",
        userId: "user3",
        user: defaultUsers[2],
        type: "question",
        content: "Tips for maintaining good posture while working from home? I keep slouching during long video calls 😅",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        likes: 15,
        comments: [],
        shares: 0,
        tags: ["tips", "work-from-home", "posture"],
        likedBy: []
      }
    ]
  }

  private getDefaultUsers(): User[] {
    return [
      {
        id: "user1",
        name: "Sarah Johnson",
        avatar: "S",
        level: "Advanced",
        streak: 28,
        location: "San Francisco, CA",
        score: 2456,
        joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      },
      {
        id: "user2",
        name: "Mike Chen",
        avatar: "M",
        level: "Intermediate",
        streak: 15,
        location: "New York, NY",
        score: 1834,
        joinedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      },
      {
        id: "user3",
        name: "Emma Wilson",
        avatar: "E",
        level: "Beginner",
        streak: 7,
        location: "London, UK",
        score: 892,
        joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    ]
  }

  private getDefaultChallenges(): Challenge[] {
    const now = new Date()

    return [
      {
        id: "challenge1",
        title: "30-Day Posture Perfect",
        description: "Improve your posture score by 20 points in 30 days",
        participants: [],
        startDate: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
        difficulty: "intermediate",
        reward: "🏆 Posture Master Badge",
        progress: {},
        type: "posture",
        target: {
          metric: "posture_score_improvement",
          value: 20,
          unit: "points"
        }
      },
      {
        id: "challenge2",
        title: "Weekly Push-up Challenge",
        description: "Complete 500 push-ups this week with perfect form",
        participants: [],
        startDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        difficulty: "advanced",
        reward: "💪 Iron Arms Badge",
        progress: {},
        type: "pushup",
        target: {
          metric: "pushup_count",
          value: 500,
          unit: "reps"
        }
      }
    ]
  }

  private getDefaultGroups(): Group[] {
    return [
      {
        id: "group1",
        name: "Desk Warriors",
        description: "For people looking to improve posture while working",
        members: [],
        posts: [],
        category: "Posture",
        createdDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        activity: "Very Active",
        admins: ["user1"]
      },
      {
        id: "group2",
        name: "Fitness Beginners",
        description: "Starting your fitness journey? This is the place!",
        members: [],
        posts: [],
        category: "General",
        createdDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        activity: "Active",
        admins: ["user2"]
      }
    ]
  }

  // Clear all data (for testing)
  clearAllData(): void {
    const storageKeys = this.getStorageKeys()
    Object.values(storageKeys).forEach(key => {
      localStorage.removeItem(key)
    })

    // Also clear any old user-scoped posts that might exist
    this.clearOldUserScopedPosts()
  }

  // Clear old user-scoped posts from previous implementation
  private clearOldUserScopedPosts(): void {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    const keysToRemove: string[] = []

    // Check all localStorage keys for old user-scoped data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        // Remove old user-scoped posts
        if (key.startsWith('community-posts-') && key !== 'community-posts') {
          keysToRemove.push(key)
        }
        // Remove old user-scoped challenges
        if (key.startsWith('community-challenges-') && key !== 'community-challenges') {
          keysToRemove.push(key)
        }
        // Remove old user-scoped groups
        if (key.startsWith('community-groups-') && key !== 'community-groups') {
          keysToRemove.push(key)
        }
      }
    }

    // Remove old user-scoped keys
    keysToRemove.forEach(key => localStorage.removeItem(key))
  }

  // Seed sample data
  seedSampleData(): void {
    this.clearAllData()

    // This will automatically populate with default data
    this.getPosts()
    this.getChallenges()
    this.getGroups()
    this.getCommunityStats()
  }
}

export const communityService = new CommunityService()