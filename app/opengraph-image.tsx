import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Bitcoin Music Studio - Create & Trade Music NFTs'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a1a3a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 60, color: 'white' }}>♪</span>
              <div
                style={{
                  width: 4,
                  height: 80,
                  background: 'white',
                  opacity: 0.8,
                }}
              />
              <span style={{ fontSize: 50, color: 'white', fontWeight: 'bold' }}>₿</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: 0,
            }}
          >
            Bitcoin Music Studio
          </h1>
          <p
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
            }}
          >
            Create, Mint & Trade Music NFTs on Bitcoin BSV
          </p>
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 60,
          }}
        >
          {['🎵 Create', '🎨 Mint NFTs', '💎 Trade', '💰 Earn Royalties'].map((feature) => (
            <div
              key={feature}
              style={{
                padding: '12px 24px',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '2px solid rgba(139, 92, 246, 0.4)',
                borderRadius: 20,
                fontSize: 24,
                color: 'white',
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}