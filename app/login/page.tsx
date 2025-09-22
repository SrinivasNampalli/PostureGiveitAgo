"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  ArrowRight,
  LogIn,
  UserPlus,
  Users,
  Zap,
  Shield,
  Target
} from "lucide-react"

export default function LoginPage() {
  const { login, signup, getAllUsers, switchUser } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const existingUsers = getAllUsers()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = mode === 'login'
        ? await login(username)
        : await signup(username)

      if (result.success) {
        router.push('/')
      } else {
        setError(result.message || 'Something went wrong')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = (userId: string) => {
    if (switchUser(userId)) {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to <span className="text-primary">PosturePro</span>
          </h1>
          <p className="text-muted-foreground">
            {mode === 'login' ? 'Sign in to continue your journey' : 'Create your account to get started'}
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: <Target className="w-5 h-5" />, label: "Track Progress" },
            { icon: <Users className="w-5 h-5" />, label: "Join Community" },
            { icon: <Zap className="w-5 h-5" />, label: "AI Analysis" }
          ].map((benefit, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 p-3">
              <div className="text-primary">{benefit.icon}</div>
              <span className="text-xs text-muted-foreground">{benefit.label}</span>
            </div>
          ))}
        </div>

        {/* Main Form */}
        <Card className="p-6">
          <div className="flex rounded-lg bg-muted p-1 mb-6">
            <Button
              variant={mode === 'login' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => {
                setMode('login')
                setError('')
              }}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button
              variant={mode === 'signup' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => {
                setMode('signup')
                setError('')
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={2}
                  maxLength={20}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {mode === 'signup'
                  ? '2-20 characters, letters and numbers only'
                  : 'Enter your existing username'
                }
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || username.trim().length < 2}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : mode === 'login' ? (
                <LogIn className="w-4 h-4 mr-2" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-primary hover:underline">
              Continue as guest (limited features)
            </Link>
          </div>
        </Card>

        {/* Quick Login for Existing Users */}
        {existingUsers.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Quick Login
            </h3>
            <div className="space-y-2">
              {existingUsers.slice(0, 5).map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleQuickLogin(user.id)}
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm mr-3">
                    {user.avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-muted-foreground">
                      Joined {user.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Privacy Note */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>All data is stored locally on your device</span>
          </div>
        </div>
      </div>
    </div>
  )
}