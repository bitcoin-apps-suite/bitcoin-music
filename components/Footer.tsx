'use client'

export default function Footer() {
  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.8))',
      borderTop: '1px solid rgba(139, 92, 246, 0.2)',
      padding: '20px',
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          © 2024 The Bitcoin Corporation LTD.
        </div>
        <div style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'center'
        }}>
          Registered in England and Wales • Company No. 16735102
        </div>
        <div style={{
          fontSize: '11px',
          color: 'rgba(139, 92, 246, 0.8)',
          marginTop: '5px'
        }}>
          Building the future of music on Bitcoin BSV
        </div>
      </div>
    </footer>
  )
}