import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: '20%',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 30,
            color: 'white',
          }}
        >
          <span style={{ fontSize: 200 }}>♪</span>
          <div
            style={{
              width: 12,
              height: 260,
              background: 'white',
              opacity: 0.8,
            }}
          />
          <span style={{ fontSize: 180, fontWeight: 'bold' }}>₿</span>
        </div>
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  )
}