import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabase configuration
// For now, we'll use environment variables. Users need to set these up.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '')
}

// Create a single supabase client for interacting with your database
// Only create if configured, otherwise return a dummy client
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          user_id: string
          user_name: string
          user_avatar: string
          user_level: string
          user_streak: number
          user_location: string
          type: string
          content: string
          created_at: string
          likes: number
          shares: number
          liked_by: string[]
          achievement: any
          progress: any
          workout: any
          tags: string[]
          image: string | null
        }
        Insert: {
          id?: string
          user_id: string
          user_name: string
          user_avatar: string
          user_level: string
          user_streak: number
          user_location: string
          type: string
          content: string
          created_at?: string
          likes?: number
          shares?: number
          liked_by?: string[]
          achievement?: any
          progress?: any
          workout?: any
          tags?: string[]
          image?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string
          user_avatar?: string
          user_level?: string
          user_streak?: number
          user_location?: string
          type?: string
          content?: string
          created_at?: string
          likes?: number
          shares?: number
          liked_by?: string[]
          achievement?: any
          progress?: any
          workout?: any
          tags?: string[]
          image?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          user_name: string
          user_avatar: string
          content: string
          created_at: string
          likes: number
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          user_name: string
          user_avatar: string
          content: string
          created_at?: string
          likes?: number
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          user_name?: string
          user_avatar?: string
          content?: string
          created_at?: string
          likes?: number
        }
      }
    }
  }
}
