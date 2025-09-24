'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: '#0a0a0a',
      borderTop: '2px solid rgba(147, 51, 234, 0.2)', // Purple accent for Bitcoin Music
      padding: '48px 0 24px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px',
          marginBottom: '32px'
        }}>
          {/* Company Section */}
          <div>
            <h3 style={{
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#9333ea' }}>🎵</span>
              Bitcoin Music
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              Professional music production and NFT marketplace on Bitcoin BSV blockchain. Create, collaborate, and monetize your music.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <a
                href="https://github.com/bitcoin-apps-suite/bitcoin-music"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                GitHub
              </a>
              <a
                href="/docs"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                Documentation
              </a>
            </div>
          </div>

          {/* Platform Section */}
          <div>
            <h4 style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '12px'
            }}>
              Platform
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/studio" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                Music Studio
              </Link>
              <Link href="/marketplace" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                NFT Marketplace
              </Link>
              <Link href="/exchange" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                Token Exchange
              </Link>
              <Link href="/library" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                Music Library
              </Link>
            </div>
          </div>

          {/* Community Section */}
          <div>
            <h4 style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '12px'
            }}>
              Community
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a href="https://twitter.com/b0ase" target="_blank" rel="noopener noreferrer" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                Twitter
              </a>
              <Link href="/community" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                Discord
              </Link>
              <Link href="/tasks" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                Contributors
              </Link>
              <a href="https://github.com/bitcoin-apps-suite/bitcoin-music/issues" target="_blank" rel="noopener noreferrer" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                Report Issues
              </a>
            </div>
          </div>

          {/* Developers Section */}
          <div>
            <h4 style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '12px'
            }}>
              Developers
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/api" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                API Reference
              </Link>
              <a href="https://docs.bsvblockchain.org" target="_blank" rel="noopener noreferrer" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                BSV SDK
              </a>
              <a href="https://tonejs.github.io" target="_blank" rel="noopener noreferrer" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                Tone.js Docs
              </a>
              <Link href="/token" style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#9333ea'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
                $BMUSIC Token
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            © 2025 The Bitcoin Corporation LTD • Registered in England and Wales • Company No. 16735102
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            Building the future of music on Bitcoin BSV blockchain
          </div>
        </div>
      </div>
    </footer>
  )
}