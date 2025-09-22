"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useAnalytics } from "@/contexts/AnalyticsContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ArrowLeft,
  Camera,
  Upload,
  Scan,
  Home,
  Lightbulb,
  Monitor,
  Ruler,
  Palette,
  Eye,
  CheckCircle,
  AlertTriangle,
  Star,
  ShoppingCart,
  Users,
  Zap,
  Target,
  TrendingUp,
  Award,
  RefreshCw,
  Download,
  Share2
} from "lucide-react"

interface WorkspaceAnalysis {
  id: string
  userId: string
  imageUrl: string
  timestamp: Date
  issues: AnalysisIssue[]
  recommendations: Recommendation[]
  score: number
  type: 'before' | 'after'
  improvements?: string[]
}

interface AnalysisIssue {
  type: 'monitor' | 'lighting' | 'chair' | 'desk' | 'posture' | 'color'
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  position?: { x: number; y: number }
}

interface Recommendation {
  id: string
  category: 'furniture' | 'lighting' | 'accessories' | 'color' | 'layout'
  title: string
  description: string
  price: string
  priceRange: 'budget' | 'mid-range' | 'premium'
  image: string
  link: string
  priority: 'high' | 'medium' | 'low'
  reason: string
}

const furnitureDatabase: Recommendation[] = [
  // Premium Ergonomic Chairs
  {
    id: 'herman-miller-aeron',
    category: 'furniture',
    title: 'Herman Miller Aeron Chair',
    description: 'Premium ergonomic chair with PostureFit SL lumbar support and breathable mesh',
    price: '$1,395',
    priceRange: 'premium',
    image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=300&h=300&fit=crop',
    link: '#',
    priority: 'high',
    reason: 'Excellent lumbar support and breathability for 8+ hour workdays'
  },
  {
    id: 'steelcase-leap',
    category: 'furniture',
    title: 'Steelcase Leap V2',
    description: 'Ergonomic chair with LiveBack technology that mimics spine movement',
    price: '$996',
    priceRange: 'premium',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop',
    link: '#',
    priority: 'high',
    reason: 'Dynamic back support adapts to your movement patterns'
  },
  {
    id: 'okamura-contessa',
    category: 'furniture',
    title: 'Okamura Contessa II',
    description: 'Japanese-engineered chair with mesh back and advanced lumbar support',
    price: '$789',
    priceRange: 'mid-range',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop',
    link: '#',
    priority: 'high',
    reason: 'Superior build quality and precise ergonomic adjustments'
  },

  // Standing Desks & Desk Solutions
  {
    id: 'uplift-v2-desk',
    category: 'furniture',
    title: 'UPLIFT V2 Standing Desk',
    description: 'Electric height-adjustable desk with memory presets (48" x 30")',
    price: '$699',
    priceRange: 'mid-range',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop',
    link: '#',
    priority: 'high',
    reason: 'Alternating sitting/standing reduces back strain and boosts energy'
  },
  {
    id: 'jarvis-bamboo-desk',
    category: 'furniture',
    title: 'Jarvis Bamboo Standing Desk',
    description: 'Eco-friendly bamboo surface with programmable height adjustment',
    price: '$499',
    priceRange: 'mid-range',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=300&h=300&fit=crop',
    link: '#',
    priority: 'medium',
    reason: 'Sustainable materials with smooth electric adjustment mechanism'
  },
  {
    id: 'flexispot-e7',
    category: 'furniture',
    title: 'FlexiSpot E7 Pro',
    description: 'Budget-friendly electric standing desk with anti-collision feature',
    price: '$349',
    priceRange: 'budget',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop',
    link: '#',
    priority: 'medium',
    reason: 'Affordable entry into standing desk benefits'
  },

  // Budget-Friendly Chairs
  {
    id: 'ikea-markus-chair',
    category: 'furniture',
    title: 'IKEA MARKUS Office Chair',
    description: 'Affordable ergonomic chair with high back and mesh fabric',
    price: '$229',
    priceRange: 'budget',
    image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=300&h=300&fit=crop',
    link: '#',
    priority: 'medium',
    reason: 'Great starter ergonomic chair with basic lumbar support'
  },
  {
    id: 'staples-hyken-chair',
    category: 'furniture',
    title: 'Staples Hyken Technical Mesh Chair',
    description: 'Budget mesh chair with adjustable lumbar support and headrest',
    price: '$179',
    priceRange: 'budget',
    image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=300&h=300&fit=crop',
    link: '#',
    priority: 'medium',
    reason: 'Excellent value for money with decent ergonomic features'
  },

  // Budget Desk Options
  {
    id: 'ikea-bekant-desk',
    category: 'furniture',
    title: 'IKEA BEKANT Desk',
    description: 'Simple rectangular desk with cable management and sturdy build',
    price: '$89',
    priceRange: 'budget',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop',
    link: '#',
    priority: 'low',
    reason: 'Affordable desk with clean design and adequate space'
  },
  {
    id: 'amazon-basics-desk',
    category: 'furniture',
    title: 'Amazon Basics Computer Desk',
    description: 'Basic computer desk with pull-out keyboard tray',
    price: '$65',
    priceRange: 'budget',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop',
    link: '#',
    priority: 'low',
    reason: 'Ultra-budget option for basic workspace needs'
  },

  // Monitor Arms & Display Solutions
  {
    id: 'ergotron-lx',
    category: 'accessories',
    title: 'Ergotron LX Monitor Arm',
    description: 'Single monitor arm with 25" extension and portrait/landscape rotation',
    price: '$189',
    priceRange: 'mid-range',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    link: '#',
    priority: 'high',
    reason: 'Perfect monitor positioning prevents neck strain and eye fatigue'
  },
  {
    id: 'humanscale-m-connect',
    category: 'accessories',
    title: 'Humanscale M/Connect Dual Arm',
    description: 'Dual monitor arm with independent height and angle adjustment',
    price: '$425',
    priceRange: 'premium',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    link: '#',
    priority: 'high',
    reason: 'Seamless dual monitor setup for productivity workflows'
  },
  {
    id: 'vivo-dual-monitor',
    category: 'accessories',
    title: 'VIVO Dual Monitor Mount',
    description: 'Budget dual monitor stand with full articulation',
    price: '$89',
    priceRange: 'budget',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    link: '#',
    priority: 'medium',
    reason: 'Affordable solution for proper monitor alignment'
  },

  // Lighting Solutions
  {
    id: 'benq-screenbar-plus',
    category: 'lighting',
    title: 'BenQ ScreenBar Plus',
    description: 'Monitor light bar with asymmetric lighting and wireless controller',
    price: '$119',
    priceRange: 'mid-range',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop',
    link: '#',
    priority: 'high',
    reason: 'Eliminates screen glare while providing optimal task lighting'
  },
  {
    id: 'philips-hue-go',
    category: 'lighting',
    title: 'Philips Hue Go Portable Light',
    description: 'Smart LED light with customizable colors and brightness',
    price: '$79',
    priceRange: 'mid-range',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop',
    link: '#',
    priority: 'medium',
    reason: 'Dynamic lighting adapts to time of day for circadian health'
  },
  {
    id: 'ikea-forsa-lamp',
    category: 'lighting',
    title: 'IKEA FORSÅ Work Lamp',
    description: 'Adjustable brass desk lamp with focused light beam',
    price: '$25',
    priceRange: 'budget',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop',
    link: '#',
    priority: 'low',
    reason: 'Budget-friendly directional lighting for reading tasks'
  },

  // Keyboard & Input Accessories
  {
    id: 'kinesis-freestyle',
    category: 'accessories',
    title: 'Kinesis Freestyle2 Ergonomic Keyboard',
    description: 'Split ergonomic keyboard with adjustable separation',
    price: '$99',
    priceRange: 'mid-range',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop',
    link: '#',
    priority: 'high',
    reason: 'Natural hand positioning reduces wrist strain and RSI risk'
  },
  {
    id: 'logitech-mx-ergo',
    category: 'accessories',
    title: 'Logitech MX ERGO Trackball',
    description: 'Advanced wireless trackball with precision tracking',
    price: '$79',
    priceRange: 'mid-range',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop',
    link: '#',
    priority: 'medium',
    reason: 'Reduces arm movement and shoulder strain during mouse use'
  },
  {
    id: 'humanscale-keyboard-tray',
    category: 'accessories',
    title: 'Humanscale 6G Keyboard Tray',
    description: 'Under-desk keyboard platform with mouse extension',
    price: '$179',
    priceRange: 'mid-range',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop',
    link: '#',
    priority: 'high',
    reason: 'Proper keyboard height prevents shoulder elevation and wrist extension'
  },

  // Support Accessories
  {
    id: 'humanscale-footrest',
    category: 'accessories',
    title: 'Humanscale FR300 Footrest',
    description: 'Ergonomic footrest with rocking motion and massage surface',
    price: '$89',
    priceRange: 'mid-range',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    link: '#',
    priority: 'medium',
    reason: 'Supports proper leg positioning and improves circulation'
  },
  {
    id: 'tempur-lumbar-cushion',
    category: 'accessories',
    title: 'Tempur-Pedic Lumbar Support Cushion',
    description: 'Memory foam lumbar pillow with ergonomic contour design',
    price: '$69',
    priceRange: 'mid-range',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    link: '#',
    priority: 'medium',
    reason: 'Adds lumbar support to existing chairs without replacement'
  },
  {
    id: 'varidesk-anti-fatigue',
    category: 'accessories',
    title: 'VARIDESK Standing Desk Mat',
    description: 'Anti-fatigue mat with contoured surface for standing desks',
    price: '$59',
    priceRange: 'budget',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    link: '#',
    priority: 'low',
    reason: 'Reduces leg fatigue and encourages micro-movements while standing'
  },

  // Organization & Cable Management
  {
    id: 'uplift-wire-management',
    category: 'accessories',
    title: 'UPLIFT Wire Management Tray',
    description: 'Under-desk cable management system with power strip holder',
    price: '$49',
    priceRange: 'budget',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    link: '#',
    priority: 'low',
    reason: 'Clean cable organization reduces visual clutter and improves focus'
  },
  {
    id: 'ikea-signum-rack',
    category: 'accessories',
    title: 'IKEA SIGNUM Cable Management',
    description: 'Horizontal cable rack that mounts under desk',
    price: '$15',
    priceRange: 'budget',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    link: '#',
    priority: 'low',
    reason: 'Budget-friendly solution for organizing power cables'
  },

  // Air Quality & Environment
  {
    id: 'dyson-pure-cool',
    category: 'accessories',
    title: 'Dyson Pure Cool Air Purifier',
    description: 'HEPA air purifier with bladeless fan design',
    price: '$399',
    priceRange: 'premium',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    link: '#',
    priority: 'low',
    reason: 'Clean air improves cognitive function and reduces fatigue'
  },
  {
    id: 'snake-plant',
    category: 'accessories',
    title: 'Snake Plant (Sansevieria)',
    description: 'Low-maintenance air-purifying plant in decorative pot',
    price: '$25',
    priceRange: 'budget',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
    link: '#',
    priority: 'low',
    reason: 'Natural air purification and stress reduction through biophilia'
  }
]

const colorRecommendations = [
  {
    name: 'Focus Blue',
    color: '#2563eb',
    description: 'Enhances concentration and productivity',
    usage: 'Accent wall behind monitor'
  },
  {
    name: 'Calm Green',
    color: '#16a34a',
    description: 'Reduces eye strain and promotes wellness',
    usage: 'Plants or wall accents'
  },
  {
    name: 'Warm Neutral',
    color: '#f5f5f4',
    description: 'Creates clean, minimalist environment',
    usage: 'Main wall color'
  },
  {
    name: 'Energy Orange',
    color: '#ea580c',
    description: 'Boosts creativity and motivation',
    usage: 'Small decorative elements'
  }
]

export default function WorkspacePage() {
  const { currentUser, isAuthenticated } = useAuth()
  const { saveSession } = useAnalytics()
  const [analyses, setAnalyses] = useState<WorkspaceAnalysis[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<WorkspaceAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState<'scan' | 'gallery' | 'recommendations'>('scan')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [analysisStartTime, setAnalysisStartTime] = useState<Date | null>(null)
  const [lastImageAnalysis, setLastImageAnalysis] = useState<{
    isWorkspace: boolean,
    detectedObjects: string[],
    workspaceScore: number,
    confidence: number
  } | null>(null)

  useEffect(() => {
    if (currentUser) {
      loadUserAnalyses()
    }
  }, [currentUser])

  const loadUserAnalyses = () => {
    const storageKey = `workspace-analyses-${currentUser?.id}`
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((analysis: any) => ({
          ...analysis,
          timestamp: new Date(analysis.timestamp)
        }))
        setAnalyses(parsed)
      } catch (error) {
        console.error('Error loading analyses:', error)
      }
    }
  }

  const saveAnalysis = (analysis: WorkspaceAnalysis) => {
    const storageKey = `workspace-analyses-${currentUser?.id}`
    const updated = [analysis, ...analyses]
    setAnalyses(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  const analyzeImageContent = async (imageUrl: string): Promise<{
    isWorkspace: boolean,
    detectedObjects: string[],
    workspaceScore: number,
    confidence: number
  }> => {
    // Create image element to analyze
    const img = new Image()
    img.crossOrigin = 'anonymous'

    return new Promise((resolve) => {
      img.onload = () => {
        // Create canvas for analysis
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        // Get image data for analysis
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Analyze image characteristics
        const analysis = performImageAnalysis(data, canvas.width, canvas.height)
        resolve(analysis)
      }

      img.onerror = () => {
        // If image fails to load, assume it's not a workspace
        resolve({ isWorkspace: false, detectedObjects: [], workspaceScore: 0, confidence: 0 })
      }

      img.src = imageUrl
    })
  }

  const performImageAnalysis = (data: Uint8ClampedArray, width: number, height: number) => {
    let workspaceIndicators = 0
    let confidence = 0
    const detectedObjects: string[] = []

    // Analyze color distribution and patterns
    const colorAnalysis = analyzeColors(data)
    const edgeAnalysis = detectEdges(data, width, height)
    const geometryAnalysis = detectGeometry(data, width, height)

    // Check for workspace indicators

    // 1. Monitor detection (dark rectangular regions with consistent edges)
    if (edgeAnalysis.rectangularShapes > 2 && colorAnalysis.darkRegions > 0.1) {
      workspaceIndicators += 25
      detectedObjects.push('monitor')
      confidence += 20
    }

    // 2. Desk detection (horizontal surfaces, brown/wood colors)
    if (geometryAnalysis.horizontalLines > 3 && colorAnalysis.brownTones > 0.05) {
      workspaceIndicators += 20
      detectedObjects.push('desk')
      confidence += 15
    }

    // 3. Chair detection (curved shapes, fabric textures)
    if (geometryAnalysis.curvedShapes > 1 && colorAnalysis.fabricTextures > 0.08) {
      workspaceIndicators += 15
      detectedObjects.push('chair')
      confidence += 10
    }

    // 4. Keyboard/mouse detection (small rectangular objects on horizontal surface)
    if (edgeAnalysis.smallRectangles > 1 && geometryAnalysis.horizontalLines > 2) {
      workspaceIndicators += 10
      detectedObjects.push('keyboard')
      confidence += 8
    }

    // 5. Lighting detection (bright regions, lamp shapes)
    if (colorAnalysis.brightRegions > 0.15 && geometryAnalysis.verticalLines > 2) {
      workspaceIndicators += 10
      detectedObjects.push('lighting')
      confidence += 7
    }

    // 6. Cable detection (thin lines, dark connections)
    if (edgeAnalysis.thinLines > 5) {
      workspaceIndicators += 5
      detectedObjects.push('cables')
      confidence += 5
    }

    // 7. Indoor environment detection
    if (colorAnalysis.wallColors > 0.3 && geometryAnalysis.roomStructure) {
      workspaceIndicators += 15
      confidence += 10
    }

    const isWorkspace = workspaceIndicators >= 30 && confidence >= 25
    const workspaceScore = Math.min(100, workspaceIndicators)

    return {
      isWorkspace,
      detectedObjects,
      workspaceScore,
      confidence: Math.min(100, confidence)
    }
  }

  const analyzeColors = (data: Uint8ClampedArray) => {
    let darkPixels = 0, brightPixels = 0, brownPixels = 0, wallPixels = 0, fabricPixels = 0
    const total = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2]
      const brightness = (r + g + b) / 3

      if (brightness < 50) darkPixels++
      if (brightness > 200) brightPixels++

      // Brown/wood detection
      if (r > g && g > b && r > 100 && r < 200) brownPixels++

      // Wall color detection (light grays, whites, pastels)
      if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && brightness > 150) wallPixels++

      // Fabric texture detection (mid-range colors with variation)
      if (brightness > 80 && brightness < 180) fabricPixels++
    }

    return {
      darkRegions: darkPixels / total,
      brightRegions: brightPixels / total,
      brownTones: brownPixels / total,
      wallColors: wallPixels / total,
      fabricTextures: fabricPixels / total
    }
  }

  const detectEdges = (data: Uint8ClampedArray, width: number, height: number) => {
    let rectangularShapes = 0, smallRectangles = 0, thinLines = 0

    // Simple edge detection using brightness differences
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4
        const current = (data[idx] + data[idx + 1] + data[idx + 2]) / 3

        const neighbors = [
          (data[idx - 4] + data[idx - 3] + data[idx - 2]) / 3, // left
          (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3, // right
          (data[(y - 1) * width * 4 + x * 4] + data[(y - 1) * width * 4 + x * 4 + 1] + data[(y - 1) * width * 4 + x * 4 + 2]) / 3, // up
          (data[(y + 1) * width * 4 + x * 4] + data[(y + 1) * width * 4 + x * 4 + 1] + data[(y + 1) * width * 4 + x * 4 + 2]) / 3  // down
        ]

        const maxDiff = Math.max(...neighbors.map(n => Math.abs(current - n)))

        if (maxDiff > 50) {
          // Detected an edge
          if (x % 10 === 0 && y % 10 === 0) { // Sample every 10 pixels
            rectangularShapes++
          }
          if (maxDiff > 100) {
            thinLines++
          }
        }
      }
    }

    smallRectangles = Math.floor(rectangularShapes * 0.3)

    return { rectangularShapes, smallRectangles, thinLines }
  }

  const detectGeometry = (data: Uint8ClampedArray, width: number, height: number) => {
    let horizontalLines = 0, verticalLines = 0, curvedShapes = 0
    let roomStructure = false

    // Detect horizontal and vertical patterns
    for (let y = 0; y < height; y += 20) {
      let horizontalConsistency = 0
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4
        const current = (data[idx] + data[idx + 1] + data[idx + 2]) / 3
        const prev = (data[idx - 4] + data[idx - 3] + data[idx - 2]) / 3

        if (Math.abs(current - prev) < 20) horizontalConsistency++
      }
      if (horizontalConsistency > width * 0.6) horizontalLines++
    }

    for (let x = 0; x < width; x += 20) {
      let verticalConsistency = 0
      for (let y = 1; y < height - 1; y++) {
        const idx = (y * width + x) * 4
        const current = (data[idx] + data[idx + 1] + data[idx + 2]) / 3
        const prev = (data[(y - 1) * width * 4 + x * 4] + data[(y - 1) * width * 4 + x * 4 + 1] + data[(y - 1) * width * 4 + x * 4 + 2]) / 3

        if (Math.abs(current - prev) < 20) verticalConsistency++
      }
      if (verticalConsistency > height * 0.6) verticalLines++
    }

    // Detect curved shapes (simple curvature detection)
    curvedShapes = Math.floor((horizontalLines + verticalLines) * 0.2)

    // Room structure detection
    roomStructure = horizontalLines >= 2 && verticalLines >= 2

    return { horizontalLines, verticalLines, curvedShapes, roomStructure }
  }

  const analyzeWorkspace = async (imageUrl: string) => {
    const startTime = new Date()
    setAnalysisStartTime(startTime)
    setIsAnalyzing(true)

    // Real image analysis
    const imageAnalysis = await analyzeImageContent(imageUrl)
    setLastImageAnalysis(imageAnalysis)

    // If not a workspace image, return zero scores
    if (!imageAnalysis.isWorkspace) {
      const endTime = new Date()
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

      const analysis: WorkspaceAnalysis = {
        id: Date.now().toString(),
        userId: currentUser?.id || '',
        imageUrl,
        timestamp: new Date(),
        issues: [{
          type: 'posture',
          severity: 'high',
          title: 'No Workspace Detected',
          description: 'This image does not appear to contain a workspace. Please upload a photo of your desk, chair, and monitor setup.'
        }],
        recommendations: [],
        score: 0,
        type: 'before'
      }

      saveSession({
        type: 'workspace',
        startTime,
        endTime,
        duration,
        score: 0,
        workspaceIssues: 1,
        workspaceRecommendations: 0,
        improvements: ['Upload a workspace image for analysis']
      })

      setCurrentAnalysis(analysis)
      saveAnalysis(analysis)
      setIsAnalyzing(false)
      setActiveTab('recommendations')
      return
    }

    // Simulate processing time for real analysis
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Advanced AI analysis with comprehensive workspace evaluation based on detected objects
    const allPossibleIssues: AnalysisIssue[] = [
      // Monitor & Display Issues
      {
        type: 'monitor',
        severity: 'high',
        title: 'Monitor Distance Incorrect',
        description: 'Screen should be 20-26 inches from eyes (arm\'s length)',
        position: { x: 55, y: 35 }
      },
      {
        type: 'monitor',
        severity: 'high',
        title: 'Screen Height Too Low',
        description: 'Top of monitor should be at or slightly below eye level',
        position: { x: 60, y: 25 }
      },
      {
        type: 'monitor',
        severity: 'medium',
        title: 'Screen Tilt Angle Issues',
        description: 'Monitor should be tilted 10-20 degrees back to reduce glare',
        position: { x: 58, y: 30 }
      },
      {
        type: 'monitor',
        severity: 'medium',
        title: 'Multiple Monitor Misalignment',
        description: 'Secondary monitors should be at same height and distance',
        position: { x: 75, y: 35 }
      },

      // Lighting & Visual Environment
      {
        type: 'lighting',
        severity: 'high',
        title: 'Screen Glare Detected',
        description: 'Direct light source behind monitor causing reflections',
        position: { x: 45, y: 15 }
      },
      {
        type: 'lighting',
        severity: 'medium',
        title: 'Insufficient Task Lighting',
        description: 'Add dedicated desk lamp for reading/writing tasks',
        position: { x: 25, y: 45 }
      },
      {
        type: 'lighting',
        severity: 'medium',
        title: 'Harsh Overhead Lighting',
        description: 'Overhead fluorescent creates shadows and eye strain',
        position: { x: 50, y: 10 }
      },
      {
        type: 'lighting',
        severity: 'low',
        title: 'Blue Light Exposure',
        description: 'Consider blue light filtering for evening work',
        position: { x: 60, y: 40 }
      },

      // Seating & Posture
      {
        type: 'chair',
        severity: 'high',
        title: 'No Lumbar Support',
        description: 'Chair lacks proper lower back curve support',
        position: { x: 35, y: 60 }
      },
      {
        type: 'chair',
        severity: 'high',
        title: 'Incorrect Seat Height',
        description: 'Feet should be flat on floor, thighs parallel to ground',
        position: { x: 40, y: 70 }
      },
      {
        type: 'chair',
        severity: 'medium',
        title: 'Armrest Position',
        description: 'Armrests should support elbows at 90-degree angle',
        position: { x: 30, y: 55 }
      },
      {
        type: 'chair',
        severity: 'medium',
        title: 'Seat Depth Issues',
        description: 'Should be 2-4 inches between knee back and seat edge',
        position: { x: 45, y: 65 }
      },

      // Desk & Workspace Layout
      {
        type: 'desk',
        severity: 'medium',
        title: 'Desk Height Incorrect',
        description: 'Desk should allow 90-degree elbow angle when typing',
        position: { x: 50, y: 50 }
      },
      {
        type: 'desk',
        severity: 'medium',
        title: 'Insufficient Legroom',
        description: 'Need 24+ inches depth under desk for leg movement',
        position: { x: 45, y: 75 }
      },
      {
        type: 'desk',
        severity: 'low',
        title: 'Clutter Reduces Focus',
        description: 'Clear workspace improves productivity and reduces stress',
        position: { x: 70, y: 55 }
      },
      {
        type: 'desk',
        severity: 'low',
        title: 'Cable Management Needed',
        description: 'Organize cables to prevent tangling and visual distraction',
        position: { x: 55, y: 60 }
      },

      // Input Devices & Ergonomics
      {
        type: 'posture',
        severity: 'high',
        title: 'Keyboard Position Too High',
        description: 'Keyboard should be at elbow height or lower',
        position: { x: 50, y: 55 }
      },
      {
        type: 'posture',
        severity: 'medium',
        title: 'Mouse Distance Issues',
        description: 'Mouse should be at same level as keyboard, close to body',
        position: { x: 65, y: 55 }
      },
      {
        type: 'posture',
        severity: 'medium',
        title: 'Wrist Support Missing',
        description: 'Add wrist rest to maintain neutral wrist position',
        position: { x: 52, y: 58 }
      },

      // Color Psychology & Environment
      {
        type: 'color',
        severity: 'low',
        title: 'Colors Reduce Productivity',
        description: 'Red/orange walls can increase stress; try blue/green',
        position: { x: 15, y: 30 }
      },
      {
        type: 'color',
        severity: 'low',
        title: 'Lack of Natural Elements',
        description: 'Add plants or nature imagery to reduce mental fatigue',
        position: { x: 80, y: 45 }
      },
      {
        type: 'color',
        severity: 'low',
        title: 'Wall Color Too Stimulating',
        description: 'Bright colors can cause distraction; neutral tones work better',
        position: { x: 10, y: 50 }
      }
    ]

    // Smart issue selection based on detected objects and analysis confidence
    const issues: AnalysisIssue[] = []
    const { detectedObjects, confidence } = imageAnalysis

    // Select issues based on what was actually detected in the image
    const relevantIssues = allPossibleIssues.filter(issue => {
      if (!detectedObjects.includes('monitor') && issue.type === 'monitor') return false
      if (!detectedObjects.includes('chair') && issue.type === 'chair') return false
      if (!detectedObjects.includes('desk') && issue.type === 'desk') return false
      if (!detectedObjects.includes('lighting') && issue.type === 'lighting') return false
      return true
    })

    // Add issues based on confidence and detected objects
    const numberOfIssues = Math.max(2, Math.min(8, Math.floor(confidence / 15)))

    // Always include high-priority issues for detected objects
    detectedObjects.forEach(objectType => {
      const objectIssues = relevantIssues.filter(issue =>
        issue.type === objectType && issue.severity === 'high'
      )
      if (objectIssues.length > 0 && issues.length < numberOfIssues) {
        issues.push(objectIssues[Math.floor(Math.random() * objectIssues.length)])
      }
    })

    // Fill remaining slots with other relevant issues
    const remainingIssues = relevantIssues.filter(issue => !issues.includes(issue))
    while (issues.length < numberOfIssues && remainingIssues.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingIssues.length)
      issues.push(remainingIssues.splice(randomIndex, 1)[0])
    }

    // Smart recommendations based on detected issues and budget preferences
    const recommendations: Recommendation[] = []
    const priceRanges = ['budget', 'mid-range', 'premium'] as const

    // Group products by price range for smart recommendations
    const budgetItems = furnitureDatabase.filter(item => item.priceRange === 'budget')
    const midRangeItems = furnitureDatabase.filter(item => item.priceRange === 'mid-range')
    const premiumItems = furnitureDatabase.filter(item => item.priceRange === 'premium')

    // Add recommendations based on detected issues
    issues.forEach(issue => {
      const relevantProducts = furnitureDatabase.filter(product => {
        if (issue.type === 'monitor' && product.category === 'accessories' && product.title.toLowerCase().includes('monitor')) return true
        if (issue.type === 'chair' && product.category === 'furniture' && product.title.toLowerCase().includes('chair')) return true
        if (issue.type === 'desk' && product.category === 'furniture' && product.title.toLowerCase().includes('desk')) return true
        if (issue.type === 'lighting' && product.category === 'lighting') return true
        if (issue.type === 'posture' && (product.category === 'accessories' || product.title.toLowerCase().includes('ergonomic'))) return true
        return false
      })

      // Add one recommendation per price range if available
      priceRanges.forEach(priceRange => {
        const availableProducts = relevantProducts.filter(p => p.priceRange === priceRange && !recommendations.includes(p))
        if (availableProducts.length > 0 && recommendations.length < 6) {
          recommendations.push(availableProducts[Math.floor(Math.random() * availableProducts.length)])
        }
      })
    })

    // Fill remaining slots with popular items across price ranges
    if (recommendations.length < 6) {
      const remainingProducts = furnitureDatabase.filter(p => !recommendations.includes(p))
      while (recommendations.length < 6 && remainingProducts.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingProducts.length)
        recommendations.push(remainingProducts.splice(randomIndex, 1)[0])
      }
    }

    // Calculate workspace score based on real analysis
    const baseScore = Math.min(100, imageAnalysis.workspaceScore)
    const issueDeductions = issues.reduce((total, issue) => {
      switch (issue.severity) {
        case 'high': return total - 15
        case 'medium': return total - 8
        case 'low': return total - 3
        default: return total
      }
    }, 0)
    const workspaceScore = Math.max(20, baseScore + issueDeductions)
    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

    const analysis: WorkspaceAnalysis = {
      id: Date.now().toString(),
      userId: currentUser?.id || '',
      imageUrl,
      timestamp: new Date(),
      issues,
      recommendations,
      score: workspaceScore,
      type: 'before'
    }

    // Save to analytics
    const improvementSuggestions = issues.map(issue => `${issue.title}: ${issue.description}`)
    saveSession({
      type: 'workspace',
      startTime,
      endTime,
      duration,
      score: workspaceScore,
      workspaceIssues: issues.length,
      workspaceRecommendations: recommendations.length,
      improvements: improvementSuggestions
    })

    setCurrentAnalysis(analysis)
    saveAnalysis(analysis)
    setIsAnalyzing(false)
    setActiveTab('recommendations')
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setSelectedImage(imageUrl)
        analyzeWorkspace(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'monitor': return <Monitor className="w-4 h-4" />
      case 'lighting': return <Lightbulb className="w-4 h-4" />
      case 'chair': return <Home className="w-4 h-4" />
      case 'desk': return <Home className="w-4 h-4" />
      case 'posture': return <Target className="w-4 h-4" />
      case 'color': return <Palette className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Home className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Workspace Analysis</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to analyze your workspace and get personalized interior design recommendations for better posture and productivity.
          </p>
          <Link href="/login">
            <Button className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Sign In to Start
            </Button>
          </Link>
        </div>
      </div>
    )
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
                <Scan className="w-4 h-4" />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Interior Design Tips</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Workspace <span className="text-primary">Analyzer</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your workspace with AI-powered analysis and professional interior design recommendations.
              Improve your posture, productivity, and well-being through smart design choices.
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {[
              { label: "Workspaces Analyzed", value: "1.2K+", icon: <Scan className="w-5 h-5" /> },
              { label: "Design Issues Fixed", value: "3.4K", icon: <CheckCircle className="w-5 h-5" /> },
              { label: "Furniture Recommended", value: "500+", icon: <ShoppingCart className="w-5 h-5" /> },
              { label: "User Satisfaction", value: "4.9★", icon: <Star className="w-5 h-5" /> }
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
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 p-1 bg-muted rounded-lg">
          {[
            { id: 'scan', label: 'Scan Workspace', icon: <Scan className="w-4 h-4" /> },
            { id: 'recommendations', label: 'Recommendations', icon: <ShoppingCart className="w-4 h-4" /> },
            { id: 'gallery', label: 'My Gallery', icon: <Users className="w-4 h-4" /> }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-1 transition-all hover:scale-105"
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Scan Workspace Tab */}
        {activeTab === 'scan' && (
          <div className="space-y-8">
            {!selectedImage ? (
              <Card className="p-12 text-center">
                <Camera className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Upload Your Workspace Photo</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Take a photo of your workspace and our AI will analyze it for ergonomic issues,
                  lighting problems, and design opportunities to improve your posture and productivity.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                />

                <div className="space-y-4">
                  <Button
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Workspace Photo
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Supports JPG, PNG • Max 10MB • Best results with full workspace view
                  </div>
                </div>

                {/* Tips */}
                <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
                  <div className="p-4 bg-muted rounded-lg">
                    <Camera className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Good Lighting</h3>
                    <p className="text-sm text-muted-foreground">Take photo with good natural light for best analysis</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <Eye className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Full View</h3>
                    <p className="text-sm text-muted-foreground">Include desk, chair, monitor, and surrounding area</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <Ruler className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">Clear Shot</h3>
                    <p className="text-sm text-muted-foreground">Avoid blurry images for accurate measurements</p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Analysis Progress */}
                {isAnalyzing && (
                  <Card className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <div>
                        <h3 className="font-semibold">Analyzing Your Workspace...</h3>
                        <p className="text-sm text-muted-foreground">Our AI is examining your setup for ergonomic and design opportunities</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Uploaded Image */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Workspace</h3>
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Workspace"
                      className="w-full h-64 md:h-96 object-cover rounded-lg"
                    />

                    {/* Analysis Overlays */}
                    {currentAnalysis && currentAnalysis.issues.map((issue, index) => (
                      issue.position && (
                        <div
                          key={index}
                          className="absolute w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse cursor-pointer"
                          style={{
                            left: `${issue.position.x}%`,
                            top: `${issue.position.y}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                          title={issue.title}
                        >
                          !
                        </div>
                      )
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null)
                        setCurrentAnalysis(null)
                      }}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Analyze New Photo
                    </Button>

                    {currentAnalysis && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Workspace Score:</span>
                        <Badge className={`${currentAnalysis.score >= 80 ? 'bg-green-500' : currentAnalysis.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                          {currentAnalysis.score}/100
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Analysis Summary */}
                {currentAnalysis && lastImageAnalysis && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">AI Detection Summary</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="font-medium text-sm mb-1">Objects Detected</div>
                        <div className="text-xs text-muted-foreground">
                          {lastImageAnalysis.detectedObjects.length > 0
                            ? lastImageAnalysis.detectedObjects.map(obj =>
                                obj.charAt(0).toUpperCase() + obj.slice(1)
                              ).join(', ')
                            : 'No workspace objects found'
                          }
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="font-medium text-sm mb-1">Analysis Confidence</div>
                        <div className="text-xs text-muted-foreground">{lastImageAnalysis.confidence}%</div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Analysis Results */}
                {currentAnalysis && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Ergonomic Issues Found</h3>
                    <div className="space-y-4">
                      {currentAnalysis.issues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getSeverityColor(issue.severity)}`}>
                            {getIssueIcon(issue.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium">{issue.title}</h4>
                              <Badge variant="outline" className={`text-xs ${getSeverityColor(issue.severity)} text-white`}>
                                {issue.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Personalized Recommendations</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Based on your workspace analysis, here are our top recommendations to improve your posture, productivity, and workspace aesthetics.
              </p>
            </div>

            {/* Furniture Recommendations */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
                Furniture & Accessories
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {furnitureDatabase.slice(0, 6).map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:scale-105 transition-all">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex space-x-2">
                          <Badge className={`${item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                            {item.priority} priority
                          </Badge>
                          <Badge variant="outline" className={`${item.priceRange === 'budget' ? 'border-green-500 text-green-700' : item.priceRange === 'mid-range' ? 'border-yellow-500 text-yellow-700' : 'border-purple-500 text-purple-700'}`}>
                            {item.priceRange === 'budget' ? '💰 Budget' : item.priceRange === 'mid-range' ? '💎 Mid-Range' : '👑 Premium'}
                          </Badge>
                        </div>
                        <span className="font-bold text-primary">{item.price}</span>
                      </div>
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg mb-4">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          💡 {item.reason}
                        </p>
                      </div>
                      <Button className="w-full" variant="outline">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        View Product
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Color Recommendations */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-primary" />
                Color Psychology
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {colorRecommendations.map((color, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg hover:scale-105 transition-all">
                    <div
                      className="w-full h-16 rounded-lg mb-3"
                      style={{ backgroundColor: color.color }}
                    ></div>
                    <h4 className="font-semibold mb-1">{color.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{color.description}</p>
                    <Badge variant="outline" className="text-xs">{color.usage}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Tips */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                Quick Improvement Tips
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Monitor Positioning",
                    tip: "Top of screen should be at or below eye level, 20-26 inches away",
                    icon: <Monitor className="w-5 h-5" />
                  },
                  {
                    title: "Lighting Setup",
                    tip: "Use task lighting to reduce screen glare and eye strain",
                    icon: <Lightbulb className="w-5 h-5" />
                  },
                  {
                    title: "Chair Height",
                    tip: "Feet flat on floor, thighs parallel to ground",
                    icon: <Home className="w-5 h-5" />
                  },
                  {
                    title: "Workspace Organization",
                    tip: "Keep frequently used items within arm's reach",
                    icon: <Home className="w-5 h-5" />
                  }
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                    <div className="text-primary mt-1">{tip.icon}</div>
                    <div>
                      <h4 className="font-medium mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Your Workspace Journey</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Track your workspace improvements over time and share your transformations with the community.
              </p>
            </div>

            {analyses.length === 0 ? (
              <Card className="p-12 text-center">
                <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Analyses Yet</h3>
                <p className="text-muted-foreground mb-6">Start by scanning your workspace to build your improvement gallery</p>
                <Button onClick={() => setActiveTab('scan')}>
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Your Workspace
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyses.map((analysis) => (
                  <Card key={analysis.id} className="overflow-hidden hover:scale-105 transition-all">
                    <img
                      src={analysis.imageUrl}
                      alt="Workspace analysis"
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${analysis.score >= 80 ? 'bg-green-500' : analysis.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                          Score: {analysis.score}/100
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {analysis.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">
                        {analysis.type === 'before' ? 'Before Analysis' : 'After Improvement'}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {analysis.issues.length} issues found • {analysis.recommendations.length} recommendations
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}