import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { AnalyticsProvider } from '@/contexts/AnalyticsContext'
import { CommunityProvider } from '@/contexts/CommunityContext'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'PosturePro - AI-Powered Posture & Fitness Coach',
  description: 'Transform your posture and fitness with AI-powered real-time analysis, personalized exercises, and an engaging community',
  generator: 'PosturePro',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <AnalyticsProvider>
            <CommunityProvider>
              {children}
            </CommunityProvider>
          </AnalyticsProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
