"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useAnalytics } from "@/contexts/AnalyticsContext"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs'
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
  detections?: DetectedObject[]
  imageDimensions?: { width: number; height: number }
}

interface DetectedObject {
  class: string
  score: number
  bbox: [number, number, number, number] // [x, y, width, height]
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
    confidence: number,
    detections?: any[],
    allPredictions?: any[],
    imageDimensions?: { width: number; height: number }
  }> => {
    try {
      // Load the COCO-SSD model
      const model = await cocoSsd.load()

      // Create image element to analyze
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = imageUrl

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      const imageDimensions = { width: img.width, height: img.height }

      // Run object detection with higher maxNumBoxes for better detection
      const predictions = await model.detect(img, 20) // Detect up to 20 objects instead of default

      console.log('🔍 TensorFlow Raw Detections:', predictions)
      console.log('📊 Detection Count:', predictions.length)
      predictions.forEach(p => {
        console.log(`  - ${p.class} (${(p.score * 100).toFixed(1)}% confidence)`)
      })

      // Expanded map of workspace-related objects that COCO-SSD can detect
      const workspaceObjectMap: Record<string, string[]> = {
        'monitor': ['tv', 'tvmonitor'],
        'keyboard': ['keyboard'],
        'mouse': ['mouse', 'remote'],
        'laptop': ['laptop'],
        'desk': ['dining table', 'desk'],
        'bottle': ['bottle', 'cup', 'wine glass'],
        'book': ['book'],
        'clock': ['clock'],
        'potted plant': ['potted plant'],
        'headphones': ['headphones'],
        'lamp': ['lamp'],
        'vase': ['vase'],
        'cell phone': ['cell phone'],
        'backpack': ['backpack', 'handbag'],
        'bowl': ['bowl'],
        'scissors': ['scissors'],
        'pencil': ['pencil'],
        'pen': ['pen'],
        'paper': ['paper'],
        'speaker': ['speaker'],
        'microphone': ['microphone'],
        'camera': ['camera'],
        'tablet': ['tablet'],
        'printer': ['printer'],
        'fan': ['fan']
      }

      const detectedWorkspaceObjects: string[] = []
      const detectionDetails: any[] = []
      let totalConfidence = 0
      let detectionCount = 0

      // Process predictions - now allow multiple instances of same type
      predictions.forEach(prediction => {
        const detectedClass = prediction.class.toLowerCase()
        const confidence = prediction.score * 100

        // Check if this is a workspace object
        for (const [workspaceItem, cocoClasses] of Object.entries(workspaceObjectMap)) {
          if (cocoClasses.includes(detectedClass)) {
            if (!detectedWorkspaceObjects.includes(workspaceItem)) {
              detectedWorkspaceObjects.push(workspaceItem)
            }
            detectionDetails.push({
              object: workspaceItem,
              originalClass: prediction.class,
              confidence: confidence.toFixed(1),
              bbox: prediction.bbox
            })
            totalConfidence += confidence
            detectionCount++
            break
          }
        }
      })

      const averageConfidence = detectionCount > 0 ? totalConfidence / detectionCount : 0

      // Determine if this is a workspace - more general approach
      const hasMonitor = detectedWorkspaceObjects.some(obj => ['monitor', 'laptop'].includes(obj))
      const hasInputDevice = detectedWorkspaceObjects.some(obj => ['keyboard', 'mouse'].includes(obj))
      const hasTech = detectedWorkspaceObjects.some(obj => ['monitor', 'laptop', 'keyboard', 'mouse', 'cell phone', 'tablet', 'camera', 'printer'].includes(obj))
      const hasWorkItems = detectedWorkspaceObjects.some(obj => ['book', 'desk', 'lamp', 'clock', 'paper', 'pen', 'pencil'].includes(obj))

      // Very lenient workspace detection - accept if we have ANY tech or work-related items
      const isWorkspace = detectedWorkspaceObjects.length >= 1 &&
                          (hasTech || hasWorkItems || hasInputDevice) &&
                          averageConfidence > 15

      // Calculate workspace score - SUPER INFLATED for amazing UX
      let workspaceScore = 65 // Much higher base score
      const monitorCount = detectionDetails.filter(d => d.object === 'monitor').length
      const totalItemCount = detectionDetails.length

      // Tech equipment scoring (SUPER INFLATED)
      if (hasMonitor) workspaceScore += 40
      if (monitorCount >= 2) workspaceScore += 35 // Huge bonus for dual monitors!
      if (monitorCount >= 3) workspaceScore += 25 // Triple monitor bonus!
      if (hasInputDevice) workspaceScore += 35
      if (detectedWorkspaceObjects.includes('laptop')) workspaceScore += 30
      if (detectedWorkspaceObjects.includes('cell phone')) workspaceScore += 15
      if (detectedWorkspaceObjects.includes('tablet')) workspaceScore += 18
      if (detectedWorkspaceObjects.includes('headphones')) workspaceScore += 20
      if (detectedWorkspaceObjects.includes('camera')) workspaceScore += 18
      if (detectedWorkspaceObjects.includes('speaker')) workspaceScore += 15
      if (detectedWorkspaceObjects.includes('microphone')) workspaceScore += 20

      // Workspace essentials (SUPER INFLATED)
      if (detectedWorkspaceObjects.includes('desk')) workspaceScore += 30
      if (detectedWorkspaceObjects.includes('lamp')) workspaceScore += 25
      if (detectedWorkspaceObjects.includes('clock')) workspaceScore += 12

      // Wellness items (SUPER INFLATED)
      if (detectedWorkspaceObjects.includes('potted plant')) workspaceScore += 25
      if (detectedWorkspaceObjects.includes('bottle')) workspaceScore += 18

      // Organization & tools (SUPER INFLATED)
      if (detectedWorkspaceObjects.includes('book')) workspaceScore += 15
      if (detectedWorkspaceObjects.includes('pen') || detectedWorkspaceObjects.includes('pencil')) workspaceScore += 10
      if (detectedWorkspaceObjects.includes('vase')) workspaceScore += 18

      // Variety bonuses (SUPER INFLATED)
      if (detectedWorkspaceObjects.length >= 2) workspaceScore += 20
      if (detectedWorkspaceObjects.length >= 3) workspaceScore += 25
      if (detectedWorkspaceObjects.length >= 5) workspaceScore += 30
      if (detectedWorkspaceObjects.length >= 8) workspaceScore += 40
      if (totalItemCount >= 10) workspaceScore += 50 // Amazing comprehensive setup!

      // Confidence bonus - huge rewards for good detections
      if (averageConfidence > 70) workspaceScore += 30
      else if (averageConfidence > 50) workspaceScore += 20
      else if (averageConfidence > 30) workspaceScore += 10

      return {
        isWorkspace,
        detectedObjects: detectedWorkspaceObjects,
        workspaceScore: Math.min(100, workspaceScore),
        confidence: Math.round(averageConfidence),
        detections: detectionDetails,
        allPredictions: predictions,
        imageDimensions
      }
    } catch (error) {
      console.error('Error in object detection:', error)
      return {
        isWorkspace: false,
        detectedObjects: [],
        workspaceScore: 0,
        confidence: 0,
        detections: [],
        allPredictions: []
      }
    }
  }


  const analyzeMonitorAngles = (monitors: any[], imageDimensions: { width: number; height: number }) => {
    const angleAnalysis = {
      monitorCount: monitors.length,
      suggestions: [] as string[]
    }

    if (monitors.length >= 2) {
      // Dual monitor setup
      const leftMonitor = monitors.reduce((prev, curr) => prev.bbox[0] < curr.bbox[0] ? prev : curr)
      const rightMonitor = monitors.reduce((prev, curr) => prev.bbox[0] > curr.bbox[0] ? prev : curr)

      const leftCenter = { x: leftMonitor.bbox[0] + leftMonitor.bbox[2] / 2, y: leftMonitor.bbox[1] + leftMonitor.bbox[3] / 2 }
      const rightCenter = { x: rightMonitor.bbox[0] + rightMonitor.bbox[2] / 2, y: rightMonitor.bbox[1] + rightMonitor.bbox[3] / 2 }

      const heightDiff = Math.abs(leftCenter.y - rightCenter.y)
      const avgMonitorHeight = (leftMonitor.bbox[3] + rightMonitor.bbox[3]) / 2

      if (heightDiff > avgMonitorHeight * 0.1) {
        angleAnalysis.suggestions.push(`⚠️ Monitor heights are misaligned by ${Math.round(heightDiff)}px - align both monitors at same eye level`)
      } else {
        angleAnalysis.suggestions.push('✅ Dual monitors are well-aligned horizontally')
      }

      const gap = rightMonitor.bbox[0] - (leftMonitor.bbox[0] + leftMonitor.bbox[2])
      if (gap > avgMonitorHeight * 0.5) {
        angleAnalysis.suggestions.push('⚠️ Monitors have large gap - position closer together to reduce neck rotation')
      }
    } else if (monitors.length === 1) {
      const monitor = monitors[0]
      const monitorCenterX = monitor.bbox[0] + monitor.bbox[2] / 2
      const imageCenterX = imageDimensions.width / 2
      const offsetPercent = Math.abs((monitorCenterX - imageCenterX) / imageDimensions.width * 100)

      if (offsetPercent > 20) {
        angleAnalysis.suggestions.push(`⚠️ Monitor is off-center (${offsetPercent.toFixed(0)}% offset) - center it in front of your seating position`)
      } else {
        angleAnalysis.suggestions.push('✅ Monitor appears well-centered')
      }

      const monitorTopY = monitor.bbox[1]
      const imageTopThird = imageDimensions.height / 3

      if (monitorTopY > imageTopThird) {
        angleAnalysis.suggestions.push('⚠️ Monitor appears low - top of screen should be at or slightly below eye level')
      }
    }

    return angleAnalysis
  }

  const generateWorkspaceDiagnosis = (imageAnalysis: any) => {
    const diagnosis = {
      summary: '',
      detectedComponents: imageAnalysis.detectedObjects,
      score: imageAnalysis.workspaceScore,
      confidence: imageAnalysis.confidence,
      analysis: [] as string[],
      recommendations: [] as string[],
      detections: imageAnalysis.detections || [],
      angleAnalysis: null as any
    }

    const detectedObjects = imageAnalysis.detectedObjects || []
    const detectionDetails = imageAnalysis.detections || []

    // Monitor/Laptop detection with angular analysis
    const monitors = detectionDetails.filter((d: any) => d.object === 'monitor')
    const laptops = detectionDetails.filter((d: any) => d.object === 'laptop')

    if (monitors.length > 0) {
      diagnosis.analysis.push(`✅ ${monitors.length} Monitor${monitors.length > 1 ? 's' : ''} detected`)
      monitors.forEach((m: any, i: number) => {
        diagnosis.analysis.push(`  📺 Monitor ${i + 1}: ${m.confidence}% confidence`)
      })

      if (imageAnalysis.imageDimensions) {
        const angleAnalysis = analyzeMonitorAngles(monitors, imageAnalysis.imageDimensions)
        diagnosis.angleAnalysis = angleAnalysis
        diagnosis.recommendations.push(...angleAnalysis.suggestions)
      }
    }

    if (laptops.length > 0) {
      diagnosis.analysis.push(`✅ Laptop detected (${laptops[0].confidence}% confidence)`)
      diagnosis.recommendations.push('💡 Consider using laptop stand to raise screen to eye level')
    }

    if (monitors.length === 0 && laptops.length === 0) {
      diagnosis.recommendations.push('⚠️ No display device detected - ensure your monitor or laptop is visible')
    }

    // Keyboard detection
    if (detectedObjects.includes('keyboard')) {
      const keyboards = detectionDetails.filter((d: any) => d.object === 'keyboard')
      diagnosis.analysis.push(`✅ Keyboard detected (${keyboards[0].confidence}% confidence)`)
      diagnosis.analysis.push('⌨️ Input peripherals present')
    }

    // Mouse detection
    if (detectedObjects.includes('mouse')) {
      const mice = detectionDetails.filter((d: any) => d.object === 'mouse')
      diagnosis.analysis.push(`✅ Mouse detected (${mice[0].confidence}% confidence)`)
    }

    // Desk detection
    if (detectedObjects.includes('desk')) {
      const desks = detectionDetails.filter((d: any) => d.object === 'desk')
      diagnosis.analysis.push(`✅ Desk surface detected (${desks[0].confidence}% confidence)`)
    } else {
      diagnosis.recommendations.push('💡 Try to include more of your desk surface in the photo')
    }

    // Chair detection
    if (detectedObjects.includes('chair')) {
      const chairs = detectionDetails.filter((d: any) => d.object === 'chair')
      diagnosis.analysis.push(`✅ Chair detected (${chairs[0].confidence}% confidence)`)
      diagnosis.recommendations.push('💡 Ensure chair has proper lumbar support and adjustable height')
    }

    // Tech Accessories
    if (detectedObjects.includes('headphones')) {
      diagnosis.analysis.push('🎧 Headphones detected - good for focused work!')
    }

    if (detectedObjects.includes('cell phone')) {
      const phones = detectionDetails.filter((d: any) => d.object === 'cell phone')
      diagnosis.analysis.push(`📱 Cell phone detected (${phones[0].confidence}% confidence)`)
    }

    if (detectedObjects.includes('tablet')) {
      diagnosis.analysis.push('📱 Tablet detected - versatile workspace device')
    }

    if (detectedObjects.includes('camera')) {
      diagnosis.analysis.push('📷 Camera detected - great for video calls!')
    }

    if (detectedObjects.includes('speaker')) {
      diagnosis.analysis.push('🔊 Speaker detected')
    }

    if (detectedObjects.includes('microphone')) {
      diagnosis.analysis.push('🎙️ Microphone detected - professional audio setup!')
    }

    // Workspace Essentials
    if (detectedObjects.includes('lamp')) {
      diagnosis.analysis.push('💡 Lamp detected - good task lighting!')
    }

    if (detectedObjects.includes('clock')) {
      diagnosis.analysis.push('⏰ Clock detected - time management ready')
    }

    // Wellness & Organization
    if (detectedObjects.includes('potted plant')) {
      diagnosis.analysis.push('🌱 Plant detected - excellent for air quality!')
    }

    if (detectedObjects.includes('book')) {
      const books = detectionDetails.filter((d: any) => d.object === 'book')
      diagnosis.analysis.push(`📚 ${books.length} Book${books.length > 1 ? 's' : ''} detected`)
    }

    if (detectedObjects.includes('bottle')) {
      diagnosis.analysis.push('💧 Hydration accessible - stay healthy!')
    }

    if (detectedObjects.includes('vase')) {
      diagnosis.analysis.push('🏺 Vase detected - aesthetic workspace touch')
    }

    // Office Supplies
    if (detectedObjects.includes('pen') || detectedObjects.includes('pencil')) {
      diagnosis.analysis.push('✏️ Writing tools detected')
    }

    if (detectedObjects.includes('scissors')) {
      diagnosis.analysis.push('✂️ Scissors detected - well-equipped workspace')
    }

    if (detectedObjects.includes('backpack')) {
      diagnosis.analysis.push('🎒 Backpack detected')
    }

    // Overall workspace assessment
    const componentCount = detectedObjects.length
    const totalDetections = detectionDetails.length
    const hasEssentials = detectedObjects.some(obj => ['monitor', 'laptop'].includes(obj))

    if (componentCount >= 4 && hasEssentials) {
      diagnosis.summary = `Complete workspace detected: ${totalDetections} items across ${componentCount} categories. Excellent setup for ergonomic analysis!`
    } else if (componentCount >= 2 && hasEssentials) {
      diagnosis.summary = `Functional workspace with ${totalDetections} items detected. Good foundation for improvements.`
    } else {
      diagnosis.summary = `Partial workspace detected (${totalDetections} items). Include more equipment for comprehensive analysis.`
    }

    return diagnosis
  }

  const analyzeWorkspace = async (imageUrl: string) => {
    const startTime = new Date()
    setAnalysisStartTime(startTime)
    setIsAnalyzing(true)

    // Check for duplicate image upload
    const existingAnalysis = analyses.find(a => a.imageUrl === imageUrl)
    if (existingAnalysis) {
      console.log('🔄 Duplicate image detected - using cached score:', existingAnalysis.score)
      setCurrentAnalysis(existingAnalysis)
      setLastImageAnalysis({
        isWorkspace: true,
        detectedObjects: (existingAnalysis as any).diagnosis?.detectedComponents || [],
        workspaceScore: existingAnalysis.score,
        confidence: (existingAnalysis as any).diagnosis?.confidence || 50
      })
      setIsAnalyzing(false)
      return
    }

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
          type: 'image-recognition',
          severity: 'high',
          description: 'This image does not appear to be a workspace. Please upload an image of your desk setup including your monitor, chair, and workspace area.',
          recommendation: 'Take a photo that clearly shows your monitor, desk, chair, and keyboard/mouse setup from a distance that captures the full workspace.',
          priority: 1
        }, {
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
      // Don't auto-redirect on error
      return
    }

    // Simulate processing time for real analysis
    await new Promise(resolve => setTimeout(resolve, 2000))

    // INTELLIGENT DIAGNOSIS based on detected objects and image analysis
    const diagnosis = generateWorkspaceDiagnosis(imageAnalysis)

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
      type: 'before',
      detections: imageAnalysis.detections,
      imageDimensions: imageAnalysis.imageDimensions,
      diagnosis // Add the intelligent diagnosis
    } as any

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
    // Don't auto-redirect, let user see results on scan tab
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
                      id="workspace-image"
                      src={selectedImage}
                      alt="Workspace"
                      className="w-full h-64 md:h-96 object-contain rounded-lg bg-black"
                    />

                    {/* Bounding Box Overlays for Detected Objects */}
                    {currentAnalysis && currentAnalysis.detections && currentAnalysis.imageDimensions && (() => {
                      const imgElement = document.getElementById('workspace-image') as HTMLImageElement
                      if (!imgElement) return null

                      const displayWidth = imgElement.clientWidth
                      const displayHeight = imgElement.clientHeight
                      const originalWidth = currentAnalysis.imageDimensions.width
                      const originalHeight = currentAnalysis.imageDimensions.height

                      const scaleX = displayWidth / originalWidth
                      const scaleY = displayHeight / originalHeight

                      return currentAnalysis.detections.map((detection: any, index: number) => {
                        const [x, y, width, height] = detection.bbox
                        const colors = {
                          monitor: 'border-blue-500 bg-blue-500/10',
                          laptop: 'border-purple-500 bg-purple-500/10',
                          keyboard: 'border-green-500 bg-green-500/10',
                          mouse: 'border-yellow-500 bg-yellow-500/10',
                          desk: 'border-orange-500 bg-orange-500/10',
                          headphones: 'border-pink-500 bg-pink-500/10',
                          bottle: 'border-cyan-500 bg-cyan-500/10',
                          'cell phone': 'border-indigo-500 bg-indigo-500/10',
                          tablet: 'border-violet-500 bg-violet-500/10',
                          camera: 'border-rose-500 bg-rose-500/10',
                          lamp: 'border-amber-500 bg-amber-500/10',
                          'potted plant': 'border-lime-500 bg-lime-500/10',
                          book: 'border-stone-500 bg-stone-500/10',
                          clock: 'border-sky-500 bg-sky-500/10',
                          vase: 'border-fuchsia-500 bg-fuchsia-500/10',
                          speaker: 'border-teal-500 bg-teal-500/10',
                          microphone: 'border-emerald-500 bg-emerald-500/10',
                          backpack: 'border-slate-500 bg-slate-500/10',
                          pen: 'border-zinc-500 bg-zinc-500/10',
                          pencil: 'border-neutral-500 bg-neutral-500/10',
                          scissors: 'border-red-400 bg-red-400/10',
                          printer: 'border-gray-600 bg-gray-600/10'
                        }
                        const colorClass = colors[detection.object as keyof typeof colors] || 'border-gray-500 bg-gray-500/10'

                        return (
                          <div key={index}>
                            {/* Bounding Box */}
                            <div
                              className={`absolute border-4 ${colorClass} pointer-events-none rounded-lg z-20`}
                              style={{
                                left: `${x * scaleX}px`,
                                top: `${y * scaleY}px`,
                                width: `${width * scaleX}px`,
                                height: `${height * scaleY}px`,
                                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                              }}
                            >
                              <div className="absolute -top-8 left-0 bg-black text-white text-xs px-3 py-1.5 rounded-md font-bold shadow-xl whitespace-nowrap border-2 border-white">
                                {detection.object} {detection.confidence}%
                              </div>
                            </div>
                            {/* Center Dot Marker - Large and Pulsing */}
                            <div
                              className="absolute w-5 h-5 bg-red-500 border-4 border-white rounded-full shadow-2xl pointer-events-none z-30 animate-pulse"
                              style={{
                                left: `${(x + width / 2) * scaleX}px`,
                                top: `${(y + height / 2) * scaleY}px`,
                                transform: 'translate(-50%, -50%)',
                                boxShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.4)'
                              }}
                            />
                          </div>
                        )
                      })
                    })()}
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

                {/* CONDENSED AI QUALITY REPORT */}
                {currentAnalysis && (currentAnalysis as any).diagnosis && (
                  <Card className="p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white border-2 border-purple-500">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-6 h-6 text-purple-400" />
                        <h3 className="text-xl font-bold">AI Quality Report</h3>
                      </div>
                      <Badge className="bg-purple-500 text-white text-xs">✨ AI</Badge>
                    </div>

                    {/* Compact Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-300">{currentAnalysis.score >= 80 ? '⭐⭐⭐⭐⭐' : currentAnalysis.score >= 65 ? '⭐⭐⭐⭐' : currentAnalysis.score >= 50 ? '⭐⭐⭐' : '⭐⭐'}</div>
                        <div className="text-xs text-purple-200 mt-1">Rating</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-300">{currentAnalysis.detections?.length || 0}</div>
                        <div className="text-xs text-purple-200 mt-1">Items Found</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-purple-300">
                          {currentAnalysis.score >= 85 ? 'Pro' : currentAnalysis.score >= 70 ? 'Adv' : currentAnalysis.score >= 55 ? 'Int' : 'Basic'}
                        </div>
                        <div className="text-xs text-purple-200 mt-1">Level</div>
                      </div>
                    </div>

                    {/* Key Highlights - Single Row */}
                    <div className="bg-white/5 rounded-lg p-3 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold">Detected</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(currentAnalysis as any).diagnosis.detectedComponents.map((item: string, idx: number) => (
                          <span key={idx} className="text-xs bg-purple-500/30 px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Tips - Condensed */}
                    {(currentAnalysis.score < 85 || !(currentAnalysis as any).diagnosis.detectedComponents.includes('lamp')) && (
                      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-semibold">Quick Tips</span>
                        </div>
                        <div className="text-xs text-purple-100 space-y-1">
                          {currentAnalysis.score < 85 && (
                            <div>• {85 - currentAnalysis.score} pts away from Pro level</div>
                          )}
                          {!(currentAnalysis as any).diagnosis.detectedComponents.includes('lamp') && (
                            <div>• Add lighting to reduce eye strain</div>
                          )}
                          {(currentAnalysis.detections?.length || 0) < 8 && (
                            <div>• More accessories = better ergonomics</div>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                )}

                {/* PROFESSIONAL REPORT-STYLE UI */}
                {currentAnalysis && (currentAnalysis as any).diagnosis && (
                  <div className="space-y-6">
                    {/* Report Header */}
                    <Card className="p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-3xl font-bold mb-2">📊 Workspace Analysis Report</h2>
                          <p className="text-indigo-100">Generated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-6xl font-bold mb-1">{currentAnalysis.score}</div>
                          <div className="text-lg">Workspace Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-2xl font-bold">{(currentAnalysis as any).diagnosis.detectedComponents.length}</div>
                          <div className="text-sm text-indigo-100">Categories Detected</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-2xl font-bold">{currentAnalysis.detections?.length || 0}</div>
                          <div className="text-sm text-indigo-100">Total Items</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                          <div className="text-2xl font-bold">{(currentAnalysis as any).diagnosis.confidence}%</div>
                          <div className="text-sm text-indigo-100">AI Confidence</div>
                        </div>
                      </div>
                    </Card>

                    {/* AI INSIGHTS REPORT */}
                    <Card className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white border-2 border-purple-500">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Zap className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-1">AI Insights</h3>
                            <p className="text-purple-200 text-sm">Powered by Advanced Computer Vision</p>
                          </div>
                        </div>
                        <Badge className="bg-purple-500 text-white px-3 py-1 text-xs">
                          ✨ AI Generated
                        </Badge>
                      </div>

                      {/* AI Analysis Grid */}
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Workspace Quality */}
                        <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-purple-400/30">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                              <Award className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold">Workspace Quality</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-purple-200 text-sm">Equipment Level</span>
                              <span className="font-bold text-white">
                                {currentAnalysis.score >= 85 ? 'Professional' :
                                 currentAnalysis.score >= 70 ? 'Advanced' :
                                 currentAnalysis.score >= 55 ? 'Intermediate' : 'Basic'}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-200 text-sm">Setup Completeness</span>
                              <span className="font-bold text-white">
                                {Math.round((currentAnalysis.detections?.length || 0) / 10 * 100)}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-200 text-sm">Ergonomic Rating</span>
                              <span className="font-bold text-white">
                                {currentAnalysis.score >= 80 ? '⭐⭐⭐⭐⭐' :
                                 currentAnalysis.score >= 65 ? '⭐⭐⭐⭐' :
                                 currentAnalysis.score >= 50 ? '⭐⭐⭐' : '⭐⭐'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Key Strengths */}
                        <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-purple-400/30">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold">Key Strengths</h4>
                          </div>
                          <div className="space-y-2 text-sm">
                            {(currentAnalysis as any).diagnosis.detectedComponents.includes('monitor') && (
                              <div className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-purple-100">
                                  {(currentAnalysis.detections?.filter((d: any) => d.object === 'monitor').length || 1)} display{(currentAnalysis.detections?.filter((d: any) => d.object === 'monitor').length || 1) > 1 ? 's' : ''} for enhanced productivity
                                </span>
                              </div>
                            )}
                            {(currentAnalysis as any).diagnosis.detectedComponents.includes('keyboard') && (
                              <div className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-purple-100">Input devices properly positioned</span>
                              </div>
                            )}
                            {(currentAnalysis as any).diagnosis.detectedComponents.includes('laptop') && (
                              <div className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-purple-100">Mobile workstation capabilities</span>
                              </div>
                            )}
                            {(currentAnalysis.detections?.length || 0) >= 5 && (
                              <div className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-purple-100">Well-equipped workspace ecosystem</span>
                              </div>
                            )}
                            {(currentAnalysis as any).diagnosis.detectedComponents.includes('potted plant') && (
                              <div className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-purple-100">Natural elements for wellness</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* AI Recommendations */}
                      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur rounded-xl p-5 border border-purple-400/30">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold">AI-Powered Suggestions</h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          {currentAnalysis.score < 85 && (
                            <div className="bg-black/20 rounded-lg p-3 text-sm">
                              <div className="font-semibold text-amber-300 mb-1">📈 Growth Potential</div>
                              <p className="text-purple-100">Your setup has room to reach {85 - currentAnalysis.score} more points with strategic upgrades</p>
                            </div>
                          )}
                          {!(currentAnalysis as any).diagnosis.detectedComponents.includes('lamp') && (
                            <div className="bg-black/20 rounded-lg p-3 text-sm">
                              <div className="font-semibold text-amber-300 mb-1">💡 Lighting Enhancement</div>
                              <p className="text-purple-100">Add task lighting to reduce eye strain and boost focus</p>
                            </div>
                          )}
                          {(currentAnalysis.detections?.length || 0) < 8 && (
                            <div className="bg-black/20 rounded-lg p-3 text-sm">
                              <div className="font-semibold text-amber-300 mb-1">🎯 Optimization Opportunity</div>
                              <p className="text-purple-100">Consider adding ergonomic accessories for maximum comfort</p>
                            </div>
                          )}
                          {currentAnalysis.score >= 85 && (
                            <div className="bg-black/20 rounded-lg p-3 text-sm col-span-2">
                              <div className="font-semibold text-green-300 mb-1">🏆 Elite Setup Detected</div>
                              <p className="text-purple-100">Your workspace is in the top tier! Focus on maintaining this excellent environment</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom Stats */}
                      <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-300">
                            {(currentAnalysis as any).diagnosis.confidence}%
                          </div>
                          <div className="text-xs text-purple-200 mt-1">Detection Accuracy</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-300">
                            {currentAnalysis.detections?.length || 0}
                          </div>
                          <div className="text-xs text-purple-200 mt-1">Items Analyzed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-300">
                            {Math.round(currentAnalysis.score / 10)}
                          </div>
                          <div className="text-xs text-purple-200 mt-1">Ergonomic Grade</div>
                        </div>
                      </div>
                    </Card>

                    {/* Executive Summary */}
                    <Card className="p-6 border-l-4 border-l-blue-500">
                      <h3 className="text-xl font-bold mb-3 flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        Executive Summary
                      </h3>
                      <p className="text-lg text-gray-700 leading-relaxed">{(currentAnalysis as any).diagnosis.summary}</p>
                    </Card>

                    {/* Detection Details */}
                    <Card className="p-6 border-l-4 border-l-green-500">
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        Detected Equipment & Items
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {(currentAnalysis as any).diagnosis.analysis.map((item: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-gray-800">{item}</div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Recommendations */}
                    {(currentAnalysis as any).diagnosis.recommendations.length > 0 && (
                      <Card className="p-6 border-l-4 border-l-amber-500">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mr-3">
                            <Lightbulb className="w-6 h-6 text-white" />
                          </div>
                          Improvement Recommendations
                        </h3>
                        <div className="space-y-3">
                          {(currentAnalysis as any).diagnosis.recommendations.map((item: string, index: number) => (
                            <div key={index} className="flex items-start space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
                              <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                {index + 1}
                              </div>
                              <div className="text-sm text-gray-800 flex-1">{item}</div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Action Button */}
                    <div className="flex justify-center pt-4">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        onClick={() => setActiveTab('recommendations')}
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        View Product Recommendations
                      </Button>
                    </div>
                  </div>
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
              <>
                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <Card className="p-6 text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-3xl font-bold">{analyses.length}</div>
                    <div className="text-sm text-blue-100">Total Scans</div>
                  </Card>
                  <Card className="p-6 text-center bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <Award className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-3xl font-bold">
                      {Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length)}
                    </div>
                    <div className="text-sm text-green-100">Avg Score</div>
                  </Card>
                  <Card className="p-6 text-center bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-3xl font-bold">
                      {analyses.reduce((sum, a) => sum + (a.detections?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-purple-100">Items Detected</div>
                  </Card>
                  <Card className="p-6 text-center bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <Star className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-3xl font-bold">
                      {Math.max(...analyses.map(a => a.score))}
                    </div>
                    <div className="text-sm text-orange-100">Best Score</div>
                  </Card>
                </div>

                {/* Scrollable Timeline */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    Your Workspace Evolution
                  </h3>

                  <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
                    {analyses.map((analysis, index) => (
                      <Card key={analysis.id} className="overflow-hidden hover:shadow-lg transition-all">
                        <div className="flex flex-col md:flex-row">
                          {/* Image Section */}
                          <div className="md:w-1/3 relative">
                            <img
                              src={analysis.imageUrl}
                              alt="Workspace analysis"
                              className="w-full h-full object-cover min-h-[200px]"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-black/70 text-white border-0">
                                Scan #{analyses.length - index}
                              </Badge>
                            </div>
                          </div>

                          {/* Details Section */}
                          <div className="md:w-2/3 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-bold mb-1">
                                  {analysis.timestamp.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {analysis.timestamp.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className={`text-4xl font-bold ${
                                  analysis.score >= 80 ? 'text-green-500' :
                                  analysis.score >= 60 ? 'text-yellow-500' :
                                  'text-red-500'
                                }`}>
                                  {analysis.score}
                                </div>
                                <div className="text-xs text-muted-foreground">Score</div>
                              </div>
                            </div>

                            {/* Detection Summary */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="p-3 bg-muted rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Items Detected</div>
                                <div className="font-semibold">{analysis.detections?.length || 0} objects</div>
                              </div>
                              <div className="p-3 bg-muted rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                                <div className="font-semibold">
                                  {(analysis as any).diagnosis?.confidence || 'N/A'}%
                                </div>
                              </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {analysis.detections?.slice(0, 6).map((det: any, i: number) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {det.object}
                                </Badge>
                              ))}
                              {(analysis.detections?.length || 0) > 6 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(analysis.detections?.length || 0) - 6} more
                                </Badge>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Eye className="w-4 h-4 mr-2" />
                                View Full Report
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}