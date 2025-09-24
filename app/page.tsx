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
import InstallPrompt from '@/components/InstallPrompt'
import '../styles/AppHeader.css'
import '../styles/MobileLayout.css'

type ViewMode = 'studio' | 'marketplace' | 'library' | 'exchange'

export default function HomePage() {
  const { data: session } = useSession()
  const [currentView, setCurrentView] = useState<ViewMode>('studio')
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isResizing, setIsResizing] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
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
      height: '100vh',
      background: '#0a0a0a'
    }}>
      {/* Header - Only show when NOT in Bitcoin OS */}
      <AppHeader onTitleClick={() => setCurrentView('studio')} />
      
      {/* Main Content Area */}
      <div 
        className="app-main-container"
        style={{ 
          display: 'flex', 
          flex: 1,
          overflow: 'hidden'
        }}
      >
        {/* Sidebar */}
        <div 
          className="music-sidebar-container"
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
        <div 
          className="main-content-area"
          style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: '#0a0a0a'
          }}
        >
          {renderMainContent()}
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          <div 
            className="mobile-menu-overlay" 
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="mobile-menu-panel">
            <div className="mobile-menu-header">
              <div className="mobile-menu-title">
                <span>🎵</span>
                <span>Bitcoin Music</span>
              </div>
              <button 
                className="mobile-menu-close"
                onClick={() => setShowMobileMenu(false)}
              >
                ×
              </button>
            </div>
            <div className="mobile-menu-content">
              <div className="mobile-menu-section">
                <h4>Navigation</h4>
                <button 
                  className={`mobile-menu-item ${currentView === 'studio' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('studio')
                    setShowMobileMenu(false)
                  }}
                >
                  <span>🎹</span>
                  <span>Studio</span>
                </button>
                <button 
                  className={`mobile-menu-item ${currentView === 'marketplace' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('marketplace')
                    setShowMobileMenu(false)
                  }}
                >
                  <span>🛍️</span>
                  <span>Marketplace</span>
                </button>
                <button 
                  className={`mobile-menu-item ${currentView === 'library' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('library')
                    setShowMobileMenu(false)
                  }}
                >
                  <span>📚</span>
                  <span>Library</span>
                </button>
                <button 
                  className={`mobile-menu-item ${currentView === 'exchange' ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView('exchange')
                    setShowMobileMenu(false)
                  }}
                >
                  <span>📈</span>
                  <span>Exchange</span>
                </button>
              </div>
              
              <div className="mobile-menu-section">
                <h4>Account</h4>
                {session ? (
                  <button 
                    className="mobile-menu-item"
                    onClick={() => {
                      // Handle logout
                      setShowMobileMenu(false)
                    }}
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button 
                    className="mobile-menu-item"
                    onClick={() => {
                      setShowAuthModal(true)
                      setShowMobileMenu(false)
                    }}
                  >
                    <span>🔑</span>
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Install Prompt */}
      <InstallPrompt />
    </div>
  )
}