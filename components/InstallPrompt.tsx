'use client'

import { useState, useEffect } from 'react'
import { X, Download } from 'lucide-react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if running as installed PWA
    if (window.navigator && (window.navigator as any).standalone) {
      setIsInstalled(true)
      return
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show install prompt after a delay
      setTimeout(() => {
        if (!localStorage.getItem('bitcoin-music-install-dismissed')) {
          setShowInstallPrompt(true)
        }
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      console.log('Bitcoin Music app installed!')
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for browsers that don't support install prompt
      alert('To install Bitcoin Music:\n\n1. Open Chrome menu (⋮)\n2. Select "Install Bitcoin Music"\n3. Click "Install"')
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response: ${outcome}`)

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('bitcoin-music-install-dismissed', 'true')
  }

  if (isInstalled || !showInstallPrompt) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1a3a 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '90%',
        width: '400px',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Download size={24} color="white" />
      </div>

      <div style={{ flex: 1 }}>
        <h3
          style={{
            margin: '0 0 4px 0',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Install Bitcoin Music
        </h3>
        <p
          style={{
            margin: 0,
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px'
          }}
        >
          Install as Chrome app for the best experience
        </p>
      </div>

      <button
        onClick={handleInstallClick}
        style={{
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        Install
      </button>

      <button
        onClick={handleDismiss}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.5)',
          cursor: 'pointer',
          padding: '4px'
        }}
        aria-label="Dismiss"
      >
        <X size={20} />
      </button>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        @media (max-width: 480px) {
          div {
            width: calc(100% - 32px) !important;
            bottom: 60px !important;
          }
        }
      `}</style>
    </div>
  )
}