'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import MusicSidebar from '@/components/MusicSidebar'
import StudioInterface from '@/components/StudioInterface'
import MarketplaceView from '@/components/MarketplaceView'
import LibraryView from '@/components/LibraryView'
import MusicExchangeView from '@/components/MusicExchangeView'
import AuthModal from '@/components/AuthModal'
import AppHeader from '@/components/AppHeader'
import '../styles/AppHeader.css'

type ViewMode = 'studio' | 'marketplace' | 'library' | 'exchange'

export default function HomePage() {
  const { data: session } = useSession()
  const [currentView, setCurrentView] = useState<ViewMode>('studio')
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isResizing, setIsResizing] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = Math.min(Math.max(200, e.clientX), 600)
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  useEffect(() => {
    const handleOpenExchange = () => {
      setCurrentView('exchange')
    }

    window.addEventListener('openExchange', handleOpenExchange)
    return () => window.removeEventListener('openExchange', handleOpenExchange)
  }, [])

  const renderMainContent = () => {
    switch (currentView) {
      case 'studio':
        return <StudioInterface />
      case 'marketplace':
        return <MarketplaceView />
      case 'library':
        return <LibraryView />
      case 'exchange':
        return <MusicExchangeView />
      default:
        return <StudioInterface />
    }
  }

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 28px)',
      background: '#0a0a0a'
    }}>
      {/* Header */}
      <AppHeader onTitleClick={() => setCurrentView('studio')} />
      
      {/* Main Content Area */}
      <div style={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
      <div 
        style={{ 
          width: `${sidebarWidth}px`,
          background: 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <MusicSidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          onAuthRequired={() => setShowAuthModal(true)}
        />

        {/* Resize Handle */}
        <div
          ref={resizeRef}
          onMouseDown={() => setIsResizing(true)}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            cursor: 'col-resize',
            background: isResizing ? 'rgba(139, 92, 246, 0.5)' : 'transparent',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isResizing) {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isResizing) {
              e.currentTarget.style.background = 'transparent'
            }
          }}
        />
      </div>

        {/* Main Content Area */}
        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#0a0a0a'
        }}>
          {renderMainContent()}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  )
}