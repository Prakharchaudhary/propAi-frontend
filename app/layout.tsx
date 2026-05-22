import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import QueryProvider from '@/components/providers/QueryProvider'
import { SettingsProvider } from '@/lib/settings-context';
import ThemeApplicator from '@/components/ThemeApplicator';

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'PropAI — AI-Powered Real Estate Platform India',
  description: 'Apna sapna ghar dhundna hua aasaan. PropAI brings voice search, AI recommendations, and instant WhatsApp connect to Indian real estate buyers and brokers.',
  keywords: 'real estate india, AI property search, buy property india, rent house india, PropAI',
}

export const viewport: Viewport = {
  themeColor: '#0a1120',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-[#0a1120]`}>
      <body className="font-sans antialiased bg-[#0a1120]">
        <QueryProvider>
        <SettingsProvider>
          <ThemeApplicator />
          {children}
        </SettingsProvider>
        </QueryProvider>
        
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
