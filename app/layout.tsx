import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Taskbar from '@/components/Taskbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bitcoin Music Studio',
  description: 'Create, mint, and trade music NFTs on Bitcoin BSV',
  keywords: ['Bitcoin', 'BSV', 'Music', 'NFT', 'Studio', 'Blockchain', 'Royalties'],
  authors: [{ name: 'Bitcoin Music' }],
  creator: 'Bitcoin Music',
  publisher: 'Bitcoin Music',
  openGraph: {
    title: 'Bitcoin Music Studio',
    description: 'Create, mint, and trade music NFTs on Bitcoin BSV',
    type: 'website',
    locale: 'en_US',
    siteName: 'Bitcoin Music',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bitcoin Music Studio - Create & Trade Music NFTs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Music Studio',
    description: 'Create, mint, and trade music NFTs on Bitcoin BSV',
    images: ['/twitter-image.png'],
    creator: '@bitcoinmusic',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Taskbar />
          <div className="pt-7" style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)'
          }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}