"use client"

import { useState, useEffect } from "react"
import { useCommunity } from "@/contexts/CommunityContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Trophy,
  Star,
  Flame,
  Target,
  Clock,
  TrendingUp,
  Award,
  ThumbsUp,
  Calendar,
  MapPin,
  Camera,
  Send,
  Filter,
  Search,
  MoreHorizontal,
  BookOpen,
  Play,
  CheckCircle,
  Zap,
  Globe,
  X
} from "lucide-react"

export default function CommunityPage() {
  const {
    currentUser,
    posts,
    createPost,
    likePost,
    addComment,
    challenges,
    joinChallenge,
    groups,
    joinGroup,
    leaveGroup,
    leaderboard,
    communityStats,
    seedSampleData,
    clearAllData,
    isLoading
  } = useCommunity()

  const [activeTab, setActiveTab] = useState("feed")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [newPostText, setNewPostText] = useState("")

  // Show loading if user is not yet loaded
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading community...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "feed", label: "Community Feed", icon: <Users className="w-4 h-4" /> },
    { id: "challenges", label: "Challenges", icon: <Trophy className="w-4 h-4" /> },
    { id: "leaderboard", label: "Leaderboard", icon: <Award className="w-4 h-4" /> },
    { id: "groups", label: "Groups", icon: <Globe className="w-4 h-4" /> }
  ]

  const communityStatsDisplay = [
    { label: "Active Members", value: (communityStats.totalMembers / 1000).toFixed(1) + "K", icon: <Users className="w-5 h-5" /> },
    { label: "Posts Today", value: communityStats.postsToday.toString(), icon: <MessageCircle className="w-5 h-5" /> },
    { label: "Challenges Active", value: communityStats.activeChallenges.toString(), icon: <Trophy className="w-5 h-5" /> },
    { label: "Countries", value: communityStats.countries.toString(), icon: <Globe className="w-5 h-5" /> }
  ]

  const feedPosts = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "S",
        level: "Advanced",
        streak: 28,
        location: "San Francisco, CA"
      },
      type: "achievement",
      content: "Just hit my 100th workout session! 🎉 The posture analysis has been a game-changer for my daily routine. My back pain is completely gone!",
      timestamp: "2 hours ago",
      likes: 47,
      comments: 12,
      shares: 3,
      achievement: {
        title: "Century Club",
        description: "100 workout sessions completed",
        icon: "🏆"
      },
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        avatar: "M",
        level: "Intermediate",
        streak: 15,
        location: "New York, NY"
      },
      type: "progress",
      content: "Week 3 of the posture challenge and seeing amazing results! My average score went from 72 to 89. Here's my weekly breakdown:",
      timestamp: "4 hours ago",
      likes: 23,
      comments: 8,
      shares: 1,
      progress: {
        metric: "Average Posture Score",
        before: 72,
        after: 89,
        improvement: "+23%"
      }
    },
    {
      id: 3,
      user: {
        name: "Emma Wilson",
        avatar: "E",
        level: "Beginner",
        streak: 7,
        location: "London, UK"
      },
      type: "question",
      content: "Tips for maintaining good posture while working from home? I keep slouching during long video calls 😅",
      timestamp: "6 hours ago",
      likes: 15,
      comments: 24,
      shares: 0,
      tags: ["tips", "work-from-home", "posture"]
    },
    {
      id: 4,
      user: {
        name: "David Park",
        avatar: "D",
        level: "Expert",
        streak: 45,
        location: "Seoul, South Korea"
      },
      type: "workout",
      content: "Just completed an intense 20-minute HIIT session! The AI tracking helped me maintain perfect form throughout. Push-up count: 87 💪",
      timestamp: "8 hours ago",
      likes: 56,
      comments: 18,
      shares: 7,
      workout: {
        type: "HIIT Cardio",
        duration: "20 min",
        exercises: ["Push-ups", "Squats", "Plank"],
        score: 94
      }
    }
  ]



  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇"
      case 2: return "🥈"
      case 3: return "🥉"
      default: return `#${rank}`
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500"
      case "intermediate": return "bg-yellow-500"
      case "advanced": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "text-green-500"
      case "Intermediate": return "text-blue-500"
      case "Advanced": return "text-purple-500"
      case "Expert": return "text-orange-500"
      case "Grandmaster": return "text-red-500"
      default: return "text-gray-500"
    }
  }

  const formatTimestamp = (timestamp: string | Date) => {
    if (timestamp instanceof Date) {
      const now = new Date()
      const diff = now.getTime() - timestamp.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(hours / 24)

      if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
      } else {
        const minutes = Math.floor(diff / (1000 * 60))
        return `${Math.max(1, minutes)} minute${minutes > 1 ? 's' : ''} ago`
      }
    }
    return timestamp
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
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">{(communityStats.onlineMembers / 1000).toFixed(1)}K members online</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Fitness <span className="text-primary">Community</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with thousands of fitness enthusiasts, share your progress, and stay motivated together
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            {communityStatsDisplay.map((stat, index) => (
              <Card key={index} className="p-4 text-center hover:scale-105 transition-all">
                <div className="flex items-center justify-center mb-2 text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Demo Data Controls - Remove in production */}
          <div className="flex justify-center space-x-4 mt-6">
            <Button onClick={seedSampleData} variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Load Sample Data
            </Button>
            <Button onClick={clearAllData} variant="outline" size="sm">
              <X className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 p-1 bg-muted rounded-lg">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 transition-all hover:scale-105"
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Community Feed */}
        {activeTab === "feed" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* New Post */}
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {currentUser?.avatar || "U"}
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Share your fitness journey, ask questions, or celebrate achievements..."
                      className="w-full p-3 border border-border rounded-lg resize-none bg-background"
                      rows={3}
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Photo
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trophy className="w-4 h-4 mr-2" />
                          Achievement
                        </Button>
                      </div>
                      <Button
                        disabled={!newPostText.trim()}
                        onClick={() => {
                          if (newPostText.trim()) {
                            createPost({
                              type: "general",
                              content: newPostText
                            })
                            setNewPostText("")
                          }
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Feed Posts */}
              {posts.map((post) => (
                <Card key={post.id} className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {post.user?.avatar || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{post.user?.name || "User"}</h4>
                        <Badge className={getLevelColor(post.user?.level || "Beginner")} variant="outline">
                          {post.user?.level || "Beginner"}
                        </Badge>
                        {(post.user?.streak || 0) > 0 && (
                          <div className="flex items-center text-orange-500">
                            <Flame className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">{post.user?.streak || 0}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{post.user?.location || "Unknown"}</span>
                        <span className="mx-2">•</span>
                        <span>{formatTimestamp(post.timestamp)}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm leading-relaxed">{post.content}</p>

                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {post.achievement && (
                      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{post.achievement.icon}</span>
                          <div>
                            <h5 className="font-semibold text-yellow-700 dark:text-yellow-400">
                              {post.achievement.title}
                            </h5>
                            <p className="text-sm text-yellow-600 dark:text-yellow-500">
                              {post.achievement.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {post.progress && (
                      <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2">
                          {post.progress.metric}
                        </h5>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Before: {post.progress.before}</span>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm">After: {post.progress.after}</span>
                          <Badge className="bg-green-500">{post.progress.improvement}</Badge>
                        </div>
                      </div>
                    )}

                    {post.workout && (
                      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-blue-700 dark:text-blue-400">
                            {post.workout.type}
                          </h5>
                          <Badge className="bg-blue-500">Score: {post.workout.score}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-blue-600 dark:text-blue-400">
                          <span>⏱️ {post.workout.duration}</span>
                          <span>💪 {post.workout.exercises.join(", ")}</span>
                        </div>
                      </div>
                    )}

                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post content"
                        className="mt-4 w-full h-64 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`hover:text-red-500 ${post.likedBy.includes(currentUser?.id || '') ? 'text-red-500' : ''}`}
                        onClick={() => currentUser && likePost(post.id)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:text-blue-500">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments.length}
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:text-green-500">
                        <Share2 className="w-4 h-4 mr-2" />
                        {post.shares}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Challenges */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-primary" />
                  Trending Challenges
                </h3>
                <div className="space-y-3">
                  {challenges.slice(0, 3).map((challenge) => {
                    const daysLeft = Math.ceil((challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    const isJoined = challenge.participants.includes(currentUser?.id || '')
                    return (
                    <div key={challenge.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-all">
                      <h4 className="font-medium text-sm">{challenge.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{challenge.participants.length} participants</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs">{Math.max(0, daysLeft)} days left</span>
                        <Button
                          size="sm"
                          variant={isJoined ? "default" : "outline"}
                          onClick={() => !isJoined && currentUser && joinChallenge(challenge.id)}
                          disabled={isJoined}
                        >
                          {isJoined ? "Joined" : "Join"}
                        </Button>
                      </div>
                    </div>
                  )})}
                </div>
              </Card>

              {/* Top Contributors */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-primary" />
                  Top Contributors
                </h3>
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((user) => (
                    <div key={user.rank} className="flex items-center space-x-3">
                      <span className="text-lg">{getRankIcon(user.rank)}</span>
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {user?.avatar || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{user?.name || "User"}</div>
                        <div className="text-xs text-muted-foreground">{user?.score || 0} points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === "challenges" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Active Challenges</h2>
              <Button>
                <Trophy className="w-4 h-4 mr-2" />
                Create Challenge
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="p-6 hover:scale-105 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{challenge.daysLeft} days left</span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                  <p className="text-muted-foreground mb-4">{challenge.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span>Participants</span>
                      <span className="font-semibold">{challenge.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Reward</span>
                      <span className="font-semibold">{challenge.reward}</span>
                    </div>
                    {challenge.joined && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-semibold">{challenge.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${challenge.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    variant={challenge.joined ? "outline" : "default"}
                  >
                    {challenge.joined ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Joined
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4 mr-2" />
                        Join Challenge
                      </>
                    )}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Global Leaderboard</h2>
              <p className="text-muted-foreground">Top performers this month</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div key={user.rank} className={`flex items-center space-x-4 p-4 rounded-lg ${
                    user.rank <= 3 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10' : 'hover:bg-muted/50'
                  } transition-all`}>
                    <div className="text-2xl font-bold w-12 text-center">
                      {getRankIcon(user.rank)}
                    </div>
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {user?.avatar || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{user?.name || "User"}</h4>
                        <Badge className={getLevelColor(user?.level || "Beginner")} variant="outline">
                          {user?.level || "Beginner"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{user?.location || "Unknown"}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{user?.score || 0}</div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-orange-500">
                        <Flame className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{user?.streak || 0}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">day streak</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === "groups" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Fitness Groups</h2>
              <Button>
                <Users className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className="p-6 hover:scale-105 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">{group.category}</Badge>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      group.activity === "Very Active" ? "bg-green-500/20 text-green-600" :
                      group.activity === "Active" ? "bg-blue-500/20 text-blue-600" :
                      "bg-yellow-500/20 text-yellow-600"
                    }`}>
                      {group.activity}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                  <p className="text-muted-foreground mb-4">{group.description}</p>

                  <div className="flex items-center justify-between text-sm mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span>{group.members.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span>{group.posts}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    variant={group.joined ? "outline" : "default"}
                  >
                    {group.joined ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Joined
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 mr-2" />
                        Join Group
                      </>
                    )}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}