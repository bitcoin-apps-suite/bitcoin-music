import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import AppWrapper from '@/components/AppWrapper'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'

const inter = Inter({ subsets: ['latin'] })

const description = 'bMusicX, the Bitcoin Music Exchange. Stream music by the second, and every second pays the artist directly.'

export const metadata: Metadata = {
  metadataBase: new URL('https://bmusicx.com'),
  title: { default: 'bMusicX — Bitcoin Music Exchange', template: '%s · bMusicX' },
  description,
  applicationName: 'bMusicX',
  authors: [{ name: 'The Bitcoin Corporation Ltd' }],
  publisher: 'The Bitcoin Corporation Ltd',
  openGraph: { title: 'bMusicX — Bitcoin Music Exchange', description, url: 'https://bmusicx.com', siteName: 'bMusicX', type: 'website', locale: 'en_GB', images: [{ url: '/og/bmusicx-og.png', width: 1200, height: 630, alt: 'bMusicX: a fan of album covers led by WELCOME TO TERRORNODE. Free previews of real albums. Part of bWalletX.' }] },
  twitter: { card: 'summary_large_image', title: 'bMusicX — Bitcoin Music Exchange', description, images: ['/og/bmusicx-og.png'] },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
}

export const viewport: Viewport = { themeColor: '#000000' }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} style={{ minHeight: '100vh' }}>
        <ServiceWorkerRegistration />
        <Providers>
          <AppWrapper>
            {children}
          </AppWrapper>
        </Providers>
      </body>
    </html>
  )
}