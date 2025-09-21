import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { AnalyticsProvider } from '@/contexts/AnalyticsContext'
import { CommunityProvider } from '@/contexts/CommunityContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AnalyticsProvider>
          <CommunityProvider>
            {children}
          </CommunityProvider>
        </AnalyticsProvider>
        <Analytics />
      </body>
    </html>
  )
}
