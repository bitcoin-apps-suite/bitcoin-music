import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Taskbar from '@/components/Taskbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bitcoin Music Studio',
  description: 'Create, mint, and trade music NFTs on Bitcoin BSV',
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