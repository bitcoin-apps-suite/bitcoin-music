import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '36px',
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 60, color: 'white' }}>♪</span>
            <div
              style={{
                width: 3,
                height: 80,
                background: 'white',
                opacity: 0.8,
              }}
            />
            <span style={{ fontSize: 50, color: 'white', fontWeight: 'bold' }}>₿</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}