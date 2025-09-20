'use client'

import React from 'react'
import BitcoinMusicLogo from './BitcoinMusicLogo'

interface AppHeaderProps {
  onTitleClick?: () => void
}

export default function AppHeader({ onTitleClick }: AppHeaderProps) {
  return (
    <header style={{
      background: '#1a1a1a',
      color: '#ffffff',
      padding: '16px 24px',
      borderBottom: '1px solid #333',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '96px',
    }}>
      {/* Logo and title in center */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <BitcoinMusicLogo size={32} />
          <h1 
            onClick={onTitleClick}
            style={{
              margin: 0,
              fontSize: '2rem',
              fontWeight: 200,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              cursor: onTitleClick ? 'pointer' : 'default',
            }}
            title="Return to main view"
          >
            <span style={{ color: '#8b5cf6' }}>Bitcoin</span> Music
          </h1>
        </div>
        <p style={{
          margin: 0,
          fontSize: '1rem',
          fontWeight: 300,
          color: 'rgba(255, 255, 255, 0.7)',
          letterSpacing: '0.02em',
          textAlign: 'center',
        }}>
          Create, mint and trade music on the blockchain
        </p>
      </div>
    </header>
  )
}