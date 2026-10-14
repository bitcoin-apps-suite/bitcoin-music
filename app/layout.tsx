import type { Metadata } from 'next'
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
  openGraph: { title: 'bMusicX — Bitcoin Music Exchange', description, url: 'https://bmusicx.com', siteName: 'bMusicX', type: 'website', locale: 'en_GB' },
  twitter: { card: 'summary_large_image', title: 'bMusicX — Bitcoin Music Exchange', description },
  manifest: '/manifest.json',
}

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