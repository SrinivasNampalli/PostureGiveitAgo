"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Target,
  Dumbbell,
  Users,
  Star,
  Filter,
  Search,
  Heart,
  Flame,
  Trophy,
  Timer,
  TrendingUp,
  Zap,
  Activity,
  CheckCircle,
  BookOpen,
  VideoIcon,
  Calendar
} from "lucide-react"

export default function ExercisesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  const categories = [
    { id: "all", label: "All Exercises", icon: <Activity className="w-4 h-4" /> },
    { id: "posture", label: "Posture", icon: <Target className="w-4 h-4" /> },
    { id: "strength", label: "Strength", icon: <Dumbbell className="w-4 h-4" /> },
    { id: "cardio", label: "Cardio", icon: <Heart className="w-4 h-4" /> },
    { id: "flexibility", label: "Flexibility", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "core", label: "Core", icon: <Zap className="w-4 h-4" /> }
  ]

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
      ]
    }
  ]

  const workoutPlans = [
    {
      id: "beginner-7day",
      title: "7-Day Beginner Plan",
      description: "Perfect starting point for fitness beginners",
      duration: "1 week",
      difficulty: "beginner",
      exercises: 4,
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      id: "posture-fix-14day",
      title: "Posture Fix Challenge",
      description: "Transform your posture in 2 weeks",
      duration: "2 weeks",
      difficulty: "beginner",
      exercises: 6,
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      id: "strength-30day",
      title: "30-Day Strength Builder",
      description: "Build functional strength progressively",
      duration: "1 month",
      difficulty: "intermediate",
      exercises: 8,
      color: "from-purple-500/20 to-pink-500/20"
    }
  ]

  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty

    return matchesCategory && matchesSearch && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500"
      case "intermediate": return "bg-yellow-500"
      case "advanced": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button variant="outline" className="hover:scale-105 transition-all">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>2.1K active learners</span>
              </div>
              <div className="flex items-center space-x-2">
                <VideoIcon className="w-4 h-4" />
                <span>150+ exercises</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Exercise <span className="text-primary">Library</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master proper form with our comprehensive video library. From posture correction to strength building,
              find the perfect exercises for your fitness journey.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {[
              { label: "Exercise Videos", value: "150+", icon: <VideoIcon className="w-5 h-5" /> },
              { label: "Active Users", value: "2.1K", icon: <Users className="w-5 h-5" /> },
              { label: "Workout Plans", value: "25+", icon: <Calendar className="w-5 h-5" /> },
              { label: "Average Rating", value: "4.8★", icon: <Star className="w-5 h-5" /> }
            ].map((stat, index) => (
              <Card key={index} className="p-4 text-center hover:scale-105 transition-all">
                <div className="flex items-center justify-center mb-2 text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Workout Plans */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Popular <span className="text-primary">Workout Plans</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {workoutPlans.map((plan) => (
              <Card key={plan.id} className={`p-6 bg-gradient-to-br ${plan.color} hover:scale-105 transition-all cursor-pointer`}>
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-8 h-8 text-primary" />
                  <Badge variant="secondary">{plan.duration}</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span>{plan.exercises} exercises</span>
                  <Badge className={getDifficultyColor(plan.difficulty)}>{plan.difficulty}</Badge>
                </div>
                <Button className="w-full mt-4">
                  <Play className="w-4 h-4 mr-2" />
                  Start Plan
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              Exercise <span className="text-primary">Videos</span>
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all hover:scale-105"
              >
                {category.icon}
                <span className="ml-2">{category.label}</span>
              </Button>
            ))}
          </div>
        </section>

        {/* Exercise Grid */}
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="overflow-hidden hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <img
                    src={exercise.thumbnail}
                    alt={exercise.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                    <Button
                      size="lg"
                      className="bg-white/20 backdrop-blur-sm"
                      onClick={() => setPlayingVideo(playingVideo === exercise.id ? null : exercise.id)}
                    >
                      {playingVideo === exercise.id ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </Button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-black/50 text-white">
                      {exercise.duration}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold">{exercise.title}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{exercise.rating}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">{exercise.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Instructor</span>
                      <span className="font-medium">{exercise.instructor}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Views</span>
                      <span className="font-medium">{exercise.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Equipment</span>
                      <span className="font-medium">{exercise.equipment}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-2">Target Muscles</div>
                    <div className="flex flex-wrap gap-1">
                      {exercise.targetMuscles.map((muscle, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {playingVideo === exercise.id && (
                    <div className="mb-4">
                      <iframe
                        width="100%"
                        height="200"
                        src={exercise.videoUrl}
                        title={exercise.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      ></iframe>
                    </div>
                  )}

                  <Button className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Exercise Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No exercises found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}