"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  Target,
  Calendar,
  Trophy,
  Star,
  Dumbbell,
  TrendingUp,
  Timer,
  Award,
  BookOpen
} from "lucide-react"

const workoutPlans = [
  {
    id: "beginner-7day",
    title: "7-Day Beginner Plan",
    description: "Perfect starting point for fitness beginners. Build foundational strength and establish healthy habits with guided daily workouts.",
    duration: "1 week",
    difficulty: "beginner",
    exercises: 4,
    color: "from-green-500/20 to-emerald-500/20",
    dailyWorkouts: [
      {
        day: 1,
        title: "Foundation Day",
        exercises: ["posture-fix", "morning-stretch"],
        duration: "15 min",
        description: "Start with posture basics and gentle stretching"
      },
      {
        day: 2,
        title: "Strength Introduction",
        exercises: ["perfect-pushup", "squat-mastery"],
        duration: "20 min",
        description: "Learn proper form for basic strength exercises"
      },
      {
        day: 3,
        title: "Active Recovery",
        exercises: ["morning-stretch"],
        duration: "10 min",
        description: "Gentle movement and flexibility focus"
      },
      {
        day: 4,
        title: "Core Focus",
        exercises: ["plank-progression", "posture-fix"],
        duration: "18 min",
        description: "Build core strength and stability"
      },
      {
        day: 5,
        title: "Full Body",
        exercises: ["perfect-pushup", "squat-mastery", "plank-progression"],
        duration: "25 min",
        description: "Combine all learned movements"
      },
      {
        day: 6,
        title: "Flexibility & Recovery",
        exercises: ["morning-stretch", "posture-fix"],
        duration: "15 min",
        description: "Focus on mobility and recovery"
      },
      {
        day: 7,
        title: "Challenge Day",
        exercises: ["perfect-pushup", "squat-mastery", "plank-progression", "morning-stretch"],
        duration: "30 min",
        description: "Put it all together in a complete workout"
      }
    ],
    goals: [
      "Establish consistent exercise habit",
      "Learn proper form for basic exercises",
      "Improve posture awareness",
      "Build foundational strength"
    ],
    tips: [
      "Focus on form over speed or reps",
      "Listen to your body and rest when needed",
      "Stay consistent - even 10 minutes counts",
      "Track your progress daily"
    ]
  },
  {
    id: "posture-fix-14day",
    title: "Posture Fix Challenge",
    description: "Transform your posture in 2 weeks with targeted exercises designed for desk workers and anyone looking to improve their alignment.",
    duration: "2 weeks",
    difficulty: "beginner",
    exercises: 6,
    color: "from-blue-500/20 to-cyan-500/20",
    dailyWorkouts: [
      {
        day: 1,
        title: "Assessment Day",
        exercises: ["posture-fix"],
        duration: "10 min",
        description: "Establish baseline and learn basic corrections"
      },
      {
        day: 2,
        title: "Strength Foundation",
        exercises: ["posture-fix", "plank-progression"],
        duration: "15 min",
        description: "Build core strength for better posture"
      },
      {
        day: 3,
        title: "Flexibility Focus",
        exercises: ["morning-stretch", "posture-fix"],
        duration: "18 min",
        description: "Improve mobility and reduce stiffness"
      },
      {
        day: 4,
        title: "Active Recovery",
        exercises: ["morning-stretch"],
        duration: "8 min",
        description: "Gentle movement day"
      },
      {
        day: 5,
        title: "Integrated Training",
        exercises: ["posture-fix", "plank-progression", "squat-mastery"],
        duration: "22 min",
        description: "Combine posture work with functional strength"
      },
      {
        day: 6,
        title: "Desk Warrior",
        exercises: ["posture-fix", "morning-stretch"],
        duration: "15 min",
        description: "Specific focus on desk posture"
      },
      {
        day: 7,
        title: "Week 1 Review",
        exercises: ["posture-fix", "plank-progression", "morning-stretch"],
        duration: "20 min",
        description: "Assess progress and refine technique"
      }
      // Week 2 would continue with more advanced variations
    ],
    goals: [
      "Improve spinal alignment",
      "Reduce forward head posture",
      "Strengthen postural muscles",
      "Develop posture awareness"
    ],
    tips: [
      "Set hourly posture check reminders",
      "Adjust your workspace ergonomics",
      "Practice exercises during work breaks",
      "Be patient - lasting change takes time"
    ]
  },
  {
    id: "strength-30day",
    title: "30-Day Strength Builder",
    description: "Build functional strength progressively over 30 days. Perfect for those ready to challenge themselves and see real results.",
    duration: "1 month",
    difficulty: "intermediate",
    exercises: 8,
    color: "from-purple-500/20 to-pink-500/20",
    dailyWorkouts: [
      {
        day: 1,
        title: "Strength Assessment",
        exercises: ["perfect-pushup", "squat-mastery", "plank-progression"],
        duration: "25 min",
        description: "Test current strength levels"
      },
      {
        day: 2,
        title: "Upper Body Focus",
        exercises: ["perfect-pushup", "plank-progression"],
        duration: "20 min",
        description: "Build upper body strength"
      },
      {
        day: 3,
        title: "Lower Body Power",
        exercises: ["squat-mastery", "cardio-hiit"],
        duration: "30 min",
        description: "Develop leg strength and power"
      },
      {
        day: 4,
        title: "Active Recovery",
        exercises: ["morning-stretch", "posture-fix"],
        duration: "15 min",
        description: "Recovery and mobility work"
      },
      {
        day: 5,
        title: "Full Body Circuit",
        exercises: ["perfect-pushup", "squat-mastery", "plank-progression", "cardio-hiit"],
        duration: "35 min",
        description: "Combine all movements in circuits"
      },
      {
        day: 6,
        title: "Core Strength",
        exercises: ["plank-progression", "posture-fix"],
        duration: "18 min",
        description: "Advanced core stability work"
      },
      {
        day: 7,
        title: "Rest Day",
        exercises: ["morning-stretch"],
        duration: "10 min",
        description: "Complete rest with light stretching"
      }
      // Pattern continues for 30 days with progressive difficulty
    ],
    goals: [
      "Increase overall strength",
      "Improve muscular endurance",
      "Build functional movement patterns",
      "Achieve body composition goals"
    ],
    tips: [
      "Progressive overload is key to growth",
      "Track your reps and improvements",
      "Ensure adequate rest between sessions",
      "Fuel your body with proper nutrition"
    ]
  }
]

const exerciseDatabase = [
  { id: "perfect-pushup", title: "Perfect Push-up Form", duration: "3-5 min" },
  { id: "posture-fix", title: "Daily Posture Correction", duration: "10 min" },
  { id: "squat-mastery", title: "Squat Technique Mastery", duration: "4-6 min" },
  { id: "cardio-hiit", title: "10-Minute HIIT Cardio", duration: "10 min" },
  { id: "plank-progression", title: "Plank Progression Challenge", duration: "5-8 min" },
  { id: "morning-stretch", title: "Morning Flexibility Routine", duration: "8 min" }
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner": return "bg-green-500"
    case "intermediate": return "bg-yellow-500"
    case "advanced": return "bg-red-500"
    default: return "bg-gray-500"
  }
}

export default function WorkoutPlanPage() {
  const { currentUser, isAuthenticated } = useAuth()
  const params = useParams()
  const planId = params.id as string
  const [currentDay, setCurrentDay] = useState(1)
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set())
  const [isStarted, setIsStarted] = useState(false)

  const plan = workoutPlans.find(p => p.id === planId)

  useEffect(() => {
    // Load progress from localStorage with user scoping
    if (currentUser) {
      const storageKey = `plan-${planId}-progress-${currentUser.id}`
      const savedProgress = localStorage.getItem(storageKey)
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress)
          setCompletedDays(new Set(progress.completedDays || []))
          setCurrentDay(progress.currentDay || 1)
          setIsStarted(progress.isStarted || false)
        } catch (error) {
          console.error('Error loading plan progress:', error)
        }
      }
    } else {
      // Reset state for guest or no user
      setCompletedDays(new Set())
      setCurrentDay(1)
      setIsStarted(false)
    }
  }, [planId, currentUser])

  const saveProgress = () => {
    if (!currentUser) return

    const progress = {
      completedDays: Array.from(completedDays),
      currentDay,
      isStarted
    }
    const storageKey = `plan-${planId}-progress-${currentUser.id}`
    localStorage.setItem(storageKey, JSON.stringify(progress))
  }

  const completeDay = (day: number) => {
    const newCompleted = new Set(completedDays)
    newCompleted.add(day)
    setCompletedDays(newCompleted)

    if (day === currentDay && day < (plan?.dailyWorkouts.length || 0)) {
      setCurrentDay(day + 1)
    }

    setTimeout(saveProgress, 100)
  }

  const startPlan = () => {
    setIsStarted(true)
    setCurrentDay(1)
    setTimeout(saveProgress, 100)
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Workout Plan not found</h1>
          <Link href="/exercises">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Exercises
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const progressPercentage = (completedDays.size / plan.dailyWorkouts.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`bg-gradient-to-r ${plan.color} py-12`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/exercises">
              <Button variant="outline" className="hover:scale-105 transition-all">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Exercises
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className={getDifficultyColor(plan.difficulty)}>
                {plan.difficulty}
              </Badge>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{plan.duration}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{plan.title}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {plan.description}
            </p>

            {!isStarted ? (
              <Button size="lg" onClick={startPlan} className="bg-primary hover:bg-primary/90">
                <Play className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Your Progress</div>
                  <div className="text-3xl font-bold">{completedDays.size}/{plan.dailyWorkouts.length}</div>
                  <div className="text-sm text-muted-foreground">Days Completed</div>
                </div>
                <div className="max-w-md mx-auto">
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Workout */}
            {isStarted && (
              <Card className="p-6 border-primary">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Target className="w-6 h-6 mr-2 text-primary" />
                    {currentDay <= plan.dailyWorkouts.length ? `Day ${currentDay}` : 'Plan Complete!'}
                  </h2>
                  {currentDay <= plan.dailyWorkouts.length && (
                    <Badge variant="outline">Current</Badge>
                  )}
                </div>

                {currentDay <= plan.dailyWorkouts.length ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {plan.dailyWorkouts[currentDay - 1]?.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {plan.dailyWorkouts[currentDay - 1]?.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Timer className="w-4 h-4" />
                          <span>{plan.dailyWorkouts[currentDay - 1]?.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Dumbbell className="w-4 h-4" />
                          <span>{plan.dailyWorkouts[currentDay - 1]?.exercises.length} exercises</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Today's Exercises:</h4>
                      {plan.dailyWorkouts[currentDay - 1]?.exercises.map((exerciseId, index) => {
                        const exercise = exerciseDatabase.find(e => e.id === exerciseId)
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <span className="font-medium">{exercise?.title}</span>
                              <div className="text-sm text-muted-foreground">{exercise?.duration}</div>
                            </div>
                            <Link href={`/exercises/${exerciseId}`}>
                              <Button size="sm" variant="outline">
                                <BookOpen className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </div>
                        )
                      })}
                    </div>

                    {!completedDays.has(currentDay) && (
                      <Button
                        onClick={() => completeDay(currentDay)}
                        className="w-full mt-4"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Day {currentDay} Complete
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Congratulations! 🎉</h3>
                    <p className="text-muted-foreground">
                      You've completed the {plan.title}! Your dedication has paid off.
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* All Workouts */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {isStarted ? 'Your Schedule' : 'Workout Schedule'}
              </h2>
              <div className="space-y-4">
                {plan.dailyWorkouts.map((workout) => (
                  <div
                    key={workout.day}
                    className={`p-4 rounded-lg border transition-all ${
                      completedDays.has(workout.day)
                        ? 'border-green-500 bg-green-500/10'
                        : workout.day === currentDay && isStarted
                        ? 'border-primary bg-primary/10'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          completedDays.has(workout.day)
                            ? 'bg-green-500 text-white'
                            : workout.day === currentDay && isStarted
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}>
                          {completedDays.has(workout.day) ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            workout.day
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{workout.title}</h3>
                          <p className="text-sm text-muted-foreground">{workout.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{workout.duration}</div>
                        <div className="text-xs text-muted-foreground">
                          {workout.exercises.length} exercises
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Plan Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium">{plan.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                  <Badge className={getDifficultyColor(plan.difficulty)}>{plan.difficulty}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Exercises</span>
                  <span className="text-sm font-medium">{plan.exercises}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Workout Days</span>
                  <span className="text-sm font-medium">{plan.dailyWorkouts.length}</span>
                </div>
              </div>
            </Card>

            {/* Goals */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Goals</h3>
              <ul className="space-y-2">
                {plan.goals.map((goal, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Tips */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Success Tips</h3>
              <ul className="space-y-2">
                {plan.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Progress Stats */}
            {isStarted && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{progressPercentage.toFixed(0)}%</div>
                    <div className="text-sm text-muted-foreground">Complete</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">{completedDays.size}</div>
                      <div className="text-xs text-muted-foreground">Days Done</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold">{plan.dailyWorkouts.length - completedDays.size}</div>
                      <div className="text-xs text-muted-foreground">Days Left</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}