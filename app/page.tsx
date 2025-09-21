"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PostureAnalyzer from "@/components/PostureAnalyzer"
import {
  ArrowRight,
  Target,
  Star,
  Camera,
  Activity,
  BarChart3,
  Users,
  Shield,
  Brain,
  Dumbbell,
  Eye,
} from "lucide-react"

export default function HomePage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [liveUsers, setLiveUsers] = useState(247)
  const [totalUsers, setTotalUsers] = useState(12847)
  const [showPostureAnalyzer, setShowPostureAnalyzer] = useState(false)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add delay for more dramatic effect
            setTimeout(() => {
              entry.target.classList.add("revealed")
            }, 200)
          }
        })
      },
      { threshold: 0.05, rootMargin: "0px 0px -150px 0px" },
    )

    const elements = document.querySelectorAll(".scroll-reveal")
    elements.forEach((el) => observerRef.current?.observe(el))

    const interval = setInterval(() => {
      setLiveUsers((prev) => prev + Math.floor(Math.random() * 3) - 1)
      setTotalUsers((prev) => prev + Math.floor(Math.random() * 5))
    }, 3000)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {showPostureAnalyzer && (
        <div className="fixed inset-0 bg-background z-50 p-4 overflow-y-auto animate-fade-in-up">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6 animate-fade-in-left">
              <h1 className="text-3xl font-bold gradient-text">AI Fitness Tracker</h1>
              <Button
                variant="outline"
                onClick={() => setShowPostureAnalyzer(false)}
                className="transition-all duration-300 hover:scale-105"
              >
                ← Back to Home
              </Button>
            </div>
            <PostureAnalyzer />
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 animate-fade-in-up">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered Fitness Tracking
            </Badge>

            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-balance mb-8 animate-fade-in-up [animation-delay:0.2s]">
              Your <span className="text-primary">AI Fitness</span> Journey Starts Here
            </h1>

            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-12 text-pretty animate-fade-in-up [animation-delay:0.4s]">
              Real-time posture analysis, exercise counting, and form correction powered by advanced computer vision.
              Transform your fitness routine with intelligent motion tracking that adapts to your body.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:0.6s]">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                onClick={() => setShowPostureAnalyzer(true)}
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Camera Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent"
                onClick={() => setShowPostureAnalyzer(true)}
              >
                <Activity className="w-5 h-5 mr-2" />
                View Live Demo
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up [animation-delay:0.8s]">
              {[
                { number: `${liveUsers}`, label: "Users Online Now", icon: <Users className="w-5 h-5" /> },
                {
                  number: `${totalUsers.toLocaleString()}`,
                  label: "Total Users",
                  icon: <Target className="w-5 h-5" />,
                },
                { number: "95%", label: "Accuracy Rate", icon: <Eye className="w-5 h-5" /> },
                { number: "4.9★", label: "User Rating", icon: <Star className="w-5 h-5" /> },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2 text-primary">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posture Analysis Section */}
      <section id="posture" className="py-40 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="scroll-reveal slide-in-left-dramatic">
              <Badge variant="outline" className="mb-6">
                <Target className="w-4 h-4 mr-2" />
                Posture Analysis
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                Perfect your posture with <span className="text-primary">AI precision</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Our advanced MediaPipe technology analyzes your spine alignment, shoulder balance, and head position in
                real-time. Get instant feedback and personalized corrections to improve your posture naturally.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  { label: "Spine Alignment", value: "92°", status: "Excellent" },
                  { label: "Shoulder Balance", value: "Perfect", status: "Balanced" },
                  { label: "Head Position", value: "15°", status: "Good" },
                  { label: "Overall Score", value: "87/100", status: "Great" },
                ].map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                    <div>
                      <div className="font-semibold">{metric.label}</div>
                      <div className="text-sm text-muted-foreground">{metric.status}</div>
                    </div>
                    <div className="text-2xl font-bold text-primary">{metric.value}</div>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() => setShowPostureAnalyzer(true)}
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Posture Analysis
              </Button>
            </div>

            <div className="scroll-reveal slide-in-right-dramatic">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-lg font-semibold">Live Camera Feed</p>
                    <p className="text-muted-foreground">Real-time posture detection</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-card rounded-lg">
                    <div className="text-2xl font-bold text-green-500">✓</div>
                    <div className="text-sm">Spine OK</div>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg">
                    <div className="text-2xl font-bold text-yellow-500">⚠</div>
                    <div className="text-sm">Shoulders</div>
                  </div>
                  <div className="text-center p-3 bg-card rounded-lg">
                    <div className="text-2xl font-bold text-green-500">✓</div>
                    <div className="text-sm">Head OK</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Exercise Tracking Section */}
      <section id="exercises" className="py-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <Badge variant="outline" className="mb-8 scroll-reveal scale-in-dramatic">
              <Dumbbell className="w-4 h-4 mr-2" />
              Exercise Tracking
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-12 scroll-reveal slide-in-down-dramatic">
              Count every rep with <span className="text-primary">AI accuracy</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto scroll-reveal fade-in-dramatic">
              From push-ups to squats, planks to pull-ups - our AI counts your reps and analyzes your form to help you
              get the most out of every workout.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: "Push-ups",
                icon: "💪",
                count: "0",
                status: "Get ready in push-up position",
                color: "from-blue-500/20 to-cyan-500/20",
                animation: "slide-in-left-dramatic",
              },
              {
                title: "Squats",
                icon: "🏋️",
                count: "0",
                status: "Stand up straight to begin",
                color: "from-purple-500/20 to-pink-500/20",
                animation: "slide-in-up-dramatic",
              },
              {
                title: "Plank Timer",
                icon: "🤸",
                count: "00:00",
                status: "Get into plank position",
                color: "from-green-500/20 to-emerald-500/20",
                animation: "slide-in-right-dramatic",
              },
            ].map((exercise, index) => (
              <Card
                key={index}
                className={`p-8 scroll-reveal ${exercise.animation} bg-gradient-to-br ${exercise.color} border-primary/20`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{exercise.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{exercise.title}</h3>
                  <div className="text-5xl font-bold text-primary mb-4">{exercise.count}</div>
                  <p className="text-muted-foreground mb-6">{exercise.status}</p>
                  <Button className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Start {exercise.title}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="scroll-reveal rotate-in-dramatic">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Form Analysis</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                <div className="space-y-4">
                  {[
                    { metric: "Depth", value: "Perfect", color: "text-green-500" },
                    { metric: "Speed", value: "Good", color: "text-blue-500" },
                    { metric: "Alignment", value: "Excellent", color: "text-green-500" },
                    { metric: "Range of Motion", value: "95%", color: "text-primary" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg">
                      <span className="font-medium">{item.metric}</span>
                      <span className={`font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="scroll-reveal slide-in-right-dramatic">
              <h3 className="text-3xl font-bold mb-6">Real-time Feedback</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Get instant corrections and tips as you exercise. Our AI analyzes your movement patterns and provides
                personalized feedback to help you maintain perfect form.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-green-700 dark:text-green-400 font-medium">Great form! Keep it up</span>
                  </div>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-yellow-700 dark:text-yellow-400 font-medium">
                      Go a bit deeper on your squats
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="py-40 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="scroll-reveal slide-in-right-dramatic">
              <Badge variant="outline" className="mb-6">
                <BarChart3 className="w-4 h-4 mr-2" />
                Progress Analytics
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                Track your progress with <span className="text-primary">detailed insights</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Comprehensive analytics dashboard showing your improvement over time. Export your data, view detailed
                reports, and celebrate your milestones.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { label: "Sessions This Week", value: "12", change: "+3" },
                  { label: "Average Score", value: "87%", change: "+5%" },
                  { label: "Total Exercises", value: "1,247", change: "+89" },
                  { label: "Streak Days", value: "15", change: "+1" },
                ].map((stat, index) => (
                  <Card key={index} className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-xs text-green-500">{stat.change}</div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4">
                <Button size="lg">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Full Analytics
                </Button>
                <Button variant="outline" size="lg">
                  Export Data
                </Button>
              </div>
            </div>

            <div className="scroll-reveal slide-in-left-dramatic">
              <Card className="p-8">
                <h3 className="text-xl font-bold mb-6">Weekly Progress</h3>
                <div className="space-y-4">
                  {[
                    { day: "Mon", score: 85, exercises: 15 },
                    { day: "Tue", score: 92, exercises: 22 },
                    { day: "Wed", score: 78, exercises: 18 },
                    { day: "Thu", score: 95, exercises: 28 },
                    { day: "Fri", score: 88, exercises: 20 },
                    { day: "Sat", score: 91, exercises: 25 },
                    { day: "Sun", score: 87, exercises: 19 },
                  ].map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 text-center font-medium">{day.day}</div>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${day.score}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground ml-4">{day.exercises} exercises</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <Badge variant="outline" className="mb-8 scroll-reveal scale-in-dramatic">
              <Users className="w-4 h-4 mr-2" />
              Join the Community
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-12 scroll-reveal slide-in-down-dramatic">
              You're not alone in this <span className="text-primary">journey</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="scroll-reveal slide-in-left-dramatic">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Live Community Stats</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-primary mb-2">{liveUsers}</div>
                  <div className="text-muted-foreground">Users Online Now</div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between">
                    <span>Total Users</span>
                    <span className="font-bold text-primary">{totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sessions Today</span>
                    <span className="font-bold text-primary">3,291</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Improvements Made</span>
                    <span className="font-bold text-primary">89,234</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Recently Joined</h4>
                  {[
                    { name: "Alex Chen", time: "2 minutes ago", avatar: "A" },
                    { name: "Sarah Kim", time: "5 minutes ago", avatar: "S" },
                    { name: "Mike Johnson", time: "8 minutes ago", avatar: "M" },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {user.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.time}</div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="scroll-reveal slide-in-right-dramatic">
              <h3 className="text-3xl font-bold mb-8">Ready to start your journey?</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users who have transformed their fitness routine with AI-powered tracking. Your data
                stays private and secure - all processing happens locally in your browser.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  { icon: <Shield className="w-5 h-5" />, title: "Privacy First", desc: "All data processed locally" },
                  { icon: <Brain className="w-5 h-5" />, title: "AI Powered", desc: "Advanced computer vision" },
                  { icon: <Target className="w-5 h-5" />, title: "Accurate Tracking", desc: "95% accuracy rate" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-primary mt-1">{feature.icon}</div>
                    <div>
                      <div className="font-semibold">{feature.title}</div>
                      <div className="text-muted-foreground">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setShowPostureAnalyzer(true)}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button variant="outline" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-12 scroll-reveal slide-in-down-dramatic">
            Ready to transform your fitness?
          </h2>
          <p className="text-2xl mb-16 opacity-90 scroll-reveal fade-in-dramatic">
            Experience the future of AI-powered fitness tracking with real-time analysis and personalized insights.
          </p>
          <div className="scroll-reveal scale-in-dramatic">
            <Button
              size="lg"
              variant="secondary"
              className="text-2xl px-12 py-8 rounded-2xl"
              onClick={() => setShowPostureAnalyzer(true)}
            >
              <Camera className="w-6 h-6 mr-3" />
              Test It Out Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FitTrack AI</span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 FitTrack AI. All rights reserved. Powered by MediaPipe & Advanced Computer Vision.
          </div>
        </div>
      </footer>
    </div>
  )
}
