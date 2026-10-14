import { ImageResponse } from 'next/og'

export const alt = 'bMusicX — Bitcoin Music Exchange'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 80, background: 'radial-gradient(circle at 80% 20%, #1e3a8a 0%, #000 60%)', color: '#fff' }}>
        <div style={{ display: 'flex', fontSize: 40, color: '#93c5fd', letterSpacing: 4 }}>BMUSICX.COM</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 150, fontWeight: 800, letterSpacing: -4 }}>
            <span style={{ color: '#3b82f6' }}>b</span>
            <span>Music</span>
            <span style={{ color: '#3b82f6' }}>X</span>
          </div>
          <div style={{ display: 'flex', fontSize: 52, color: '#cbd5e1' }}>Bitcoin Music Exchange</div>
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#94a3b8' }}>Stream by the second. Every second pays the artist.</div>
      </div>
    ),
    size,
  )
}
