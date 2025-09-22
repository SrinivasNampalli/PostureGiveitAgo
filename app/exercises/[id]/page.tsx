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
  Pause,
  Clock,
  Target,
  Dumbbell,
  Star,
  CheckCircle,
  Timer,
  TrendingUp,
  User,
  Eye,
  Award
} from "lucide-react"

const exercises = [
  {
    id: "perfect-pushup",
    title: "Perfect Push-up Form",
    category: "strength",
    difficulty: "intermediate",
    duration: "3-5 min",
    description: "Master the perfect push-up with proper form and technique",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
    instructor: "Mike Johnson",
    rating: 4.8,
    views: 15420,
    equipment: "None",
    targetMuscles: ["Chest", "Triceps", "Shoulders", "Core"],
    benefits: ["Upper body strength", "Core stability", "Functional fitness"],
    steps: [
      "Start in plank position with hands slightly wider than shoulders",
      "Keep your body in a straight line from head to heels",
      "Lower your chest until it nearly touches the ground",
      "Push back up to starting position with control",
      "Maintain core engagement throughout the movement"
    ],
    tips: [
      "Keep your core tight throughout the movement",
      "Don't let your hips sag or pike up",
      "Focus on controlled movement rather than speed",
      "Breathe out as you push up, breathe in as you lower down"
    ],
    modifications: [
      { level: "Beginner", description: "Perform push-ups on your knees or against a wall" },
      { level: "Advanced", description: "Add elevation to feet or try single-arm variations" }
    ]
  },
  {
    id: "posture-fix",
    title: "Daily Posture Correction",
    category: "posture",
    difficulty: "beginner",
    duration: "10 min",
    description: "Simple exercises to improve your daily posture and reduce back pain",
    thumbnail: "https://images.unsplash.com/photo-1506629905607-bae2b1e23246?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/RqcOCBb4arc",
    instructor: "Sarah Kim",
    rating: 4.9,
    views: 23100,
    equipment: "None",
    targetMuscles: ["Back", "Shoulders", "Neck", "Core"],
    benefits: ["Better posture", "Reduced back pain", "Improved confidence"],
    steps: [
      "Perform shoulder blade squeezes",
      "Do chin tucks to align your head",
      "Stretch your chest and hip flexors",
      "Strengthen your core and glutes",
      "Practice wall angels for shoulder mobility"
    ],
    tips: [
      "Perform these exercises throughout your workday",
      "Hold each position for 10-15 seconds",
      "Focus on quality over quantity",
      "Set reminders to check your posture hourly"
    ],
    modifications: [
      { level: "Office Worker", description: "Can be done at your desk during breaks" },
      { level: "Advanced", description: "Hold positions longer and add resistance bands" }
    ]
  },
  {
    id: "squat-mastery",
    title: "Squat Technique Mastery",
    category: "strength",
    difficulty: "beginner",
    duration: "4-6 min",
    description: "Learn proper squat form for maximum results and injury prevention",
    thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/Dy28eq2PjcM",
    instructor: "Alex Chen",
    rating: 4.7,
    views: 18750,
    equipment: "None",
    targetMuscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
    benefits: ["Lower body strength", "Improved mobility", "Daily function"],
    steps: [
      "Stand with feet shoulder-width apart",
      "Keep your chest up and core engaged",
      "Lower down as if sitting in a chair",
      "Go until thighs are parallel to floor",
      "Drive through heels to return to standing"
    ],
    tips: [
      "Keep your weight on your heels",
      "Don't let your knees cave inward",
      "Maintain a neutral spine throughout",
      "Go only as low as you can with good form"
    ],
    modifications: [
      { level: "Beginner", description: "Use a chair behind you as a guide" },
      { level: "Advanced", description: "Add weight or try single-leg variations" }
    ]
  },
  {
    id: "cardio-hiit",
    title: "10-Minute HIIT Cardio",
    category: "cardio",
    difficulty: "advanced",
    duration: "10 min",
    description: "High-intensity interval training for maximum calorie burn",
    thumbnail: "https://images.unsplash.com/photo-1554344728-1d7de37fd5ab?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/ml6cT4AZdqI",
    instructor: "Maria Rodriguez",
    rating: 4.6,
    views: 31200,
    equipment: "None",
    targetMuscles: ["Full Body", "Cardiovascular"],
    benefits: ["Fat burning", "Cardiovascular health", "Time efficient"],
    steps: [
      "Warm up with light movement",
      "Perform 30 seconds high intensity",
      "Rest for 30 seconds",
      "Repeat for 8 rounds",
      "Cool down with stretching"
    ],
    tips: [
      "Push yourself during work intervals",
      "Use rest periods to catch your breath",
      "Modify exercises if needed to maintain form",
      "Stay hydrated throughout the workout"
    ],
    modifications: [
      { level: "Beginner", description: "Extend rest periods to 45 seconds" },
      { level: "Expert", description: "Reduce rest to 15 seconds or add weights" }
    ]
  },
  {
    id: "plank-progression",
    title: "Plank Progression Challenge",
    category: "core",
    difficulty: "intermediate",
    duration: "5-8 min",
    description: "Build core strength with progressive plank variations",
    thumbnail: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/pSHjTRCQxIw",
    instructor: "David Park",
    rating: 4.8,
    views: 12890,
    equipment: "None",
    targetMuscles: ["Core", "Shoulders", "Glutes"],
    benefits: ["Core stability", "Posture support", "Functional strength"],
    steps: [
      "Start with basic forearm plank",
      "Progress to single-arm planks",
      "Add leg lifts for extra challenge",
      "Try side planks for obliques",
      "Finish with plank-to-push-up transitions"
    ],
    tips: [
      "Keep your body in a straight line",
      "Don't hold your breath",
      "Start with shorter holds and build up",
      "Focus on form over duration"
    ],
    modifications: [
      { level: "Beginner", description: "Start on knees or against an incline" },
      { level: "Advanced", description: "Add instability with a stability ball" }
    ]
  },
  {
    id: "morning-stretch",
    title: "Morning Flexibility Routine",
    category: "flexibility",
    difficulty: "beginner",
    duration: "8 min",
    description: "Gentle stretches to start your day feeling refreshed and mobile",
    thumbnail: "https://images.unsplash.com/photo-1506629905607-bae2b1e23246?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/g_tea8ZNk5A",
    instructor: "Emma Wilson",
    rating: 4.9,
    views: 27650,
    equipment: "None",
    targetMuscles: ["Full Body", "Joints"],
    benefits: ["Improved mobility", "Reduced stiffness", "Better mood"],
    steps: [
      "Start with gentle neck rolls",
      "Stretch your arms and shoulders",
      "Do standing forward folds",
      "Open up your hips and legs",
      "Finish with spinal twists"
    ],
    tips: [
      "Move slowly and gently",
      "Listen to your body",
      "Hold each stretch for 15-30 seconds",
      "Breathe deeply throughout"
    ],
    modifications: [
      { level: "Bed", description: "Many stretches can be done in bed" },
      { level: "Advanced", description: "Hold stretches longer or add yoga flows" }
    ]
  }
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner": return "bg-green-500"
    case "intermediate": return "bg-yellow-500"
    case "advanced": return "bg-red-500"
    default: return "bg-gray-500"
  }
}

export default function ExerciseDetailPage() {
  const { currentUser } = useAuth()
  const params = useParams()
  const exerciseId = params.id as string
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const exercise = exercises.find(ex => ex.id === exerciseId)

  // Load/save user progress for exercise steps
  useEffect(() => {
    if (currentUser && exerciseId) {
      const storageKey = `exercise-${exerciseId}-progress-${currentUser.id}`
      const savedProgress = localStorage.getItem(storageKey)
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress)
          setCompletedSteps(new Set(progress.completedSteps || []))
        } catch (error) {
          console.error('Error loading exercise progress:', error)
        }
      }
    } else {
      setCompletedSteps(new Set())
    }
  }, [currentUser, exerciseId])

  const saveExerciseProgress = (steps: Set<number>) => {
    if (!currentUser) return

    const progress = {
      completedSteps: Array.from(steps)
    }
    const storageKey = `exercise-${exerciseId}-progress-${currentUser.id}`
    localStorage.setItem(storageKey, JSON.stringify(progress))
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Exercise not found</h1>
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

  const toggleStep = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex)
    } else {
      newCompleted.add(stepIndex)
    }
    setCompletedSteps(newCompleted)
    saveExerciseProgress(newCompleted)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/exercises">
              <Button variant="outline" className="hover:scale-105 transition-all">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Exercises
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge className={getDifficultyColor(exercise.difficulty)}>
                {exercise.difficulty}
              </Badge>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{exercise.duration}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{exercise.title}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              {exercise.description}
            </p>

            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{exercise.instructor}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{exercise.rating}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>{exercise.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={exercise.thumbnail}
                  alt={exercise.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-white/20 backdrop-blur-sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8" />
                    )}
                  </Button>
                </div>
              </div>
              {isPlaying && (
                <div className="p-4">
                  <iframe
                    width="100%"
                    height="400"
                    src={exercise.videoUrl}
                    title={exercise.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              )}
            </Card>

            {/* Exercise Steps */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2 text-primary" />
                Exercise Steps
              </h2>
              <div className="space-y-4">
                {exercise.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`min-w-8 h-8 rounded-full ${
                        completedSteps.has(index) ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => toggleStep(index)}
                    >
                      {completedSteps.has(index) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </Button>
                    <p className={`text-sm leading-relaxed pt-1 ${
                      completedSteps.has(index) ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-primary" />
                Pro Tips
              </h2>
              <ul className="space-y-3">
                {exercise.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <TrendingUp className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Modifications */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Dumbbell className="w-6 h-6 mr-2 text-primary" />
                Modifications
              </h2>
              <div className="space-y-4">
                {exercise.modifications.map((mod, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{mod.level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{mod.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Exercise Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Exercise Info</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="text-sm font-medium">{exercise.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Equipment</span>
                  <span className="text-sm font-medium">{exercise.equipment}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Instructor</span>
                  <span className="text-sm font-medium">{exercise.instructor}</span>
                </div>
              </div>
            </Card>

            {/* Target Muscles */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Target Muscles</h3>
              <div className="flex flex-wrap gap-2">
                {exercise.targetMuscles.map((muscle, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Benefits */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Benefits</h3>
              <ul className="space-y-2">
                {exercise.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Progress */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Steps Completed</span>
                  <span className="font-medium">{completedSteps.size}/{exercise.steps.length}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedSteps.size / exercise.steps.length) * 100}%` }}
                  ></div>
                </div>
                {completedSteps.size === exercise.steps.length && (
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      Exercise Completed! 🎉
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}