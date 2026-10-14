import { ImageResponse } from 'next/og'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', borderRadius: 14 }}>
        <span style={{ fontSize: 48, fontWeight: 800, color: '#3b82f6', marginTop: -6 }}>b</span>
      </div>
    ),
    size,
  )
}
