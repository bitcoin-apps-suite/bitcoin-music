import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { albumBySlug } from '@/lib/bmx/albums'

export const alt = 'Album on bMusicX'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Satori cannot decode webp, so each album has a small jpg cover in public/bmx/og/<slug>.jpg.
export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const a = albumBySlug((await params).slug)
  const title = a?.title ?? 'bMusicX'
  const drip = a?.titleStyle === 'drip'
  let cover: string | null = null
  if (a) {
    try { cover = `data:image/jpeg;base64,${(await readFile(path.join(process.cwd(), 'public/bmx/og', `${a.slug}.jpg`))).toString('base64')}` } catch {}
  }
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: 56, padding: 72, background: drip ? 'radial-gradient(circle at 75% 30%, #5a0006 0%, #000 65%)' : 'radial-gradient(circle at 75% 30%, #3d2c00 0%, #000 65%)', color: '#f4f1e8' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', fontSize: 34, color: '#ffd24d', letterSpacing: 2 }}>bMusicX</div>
          <div style={{ display: 'flex', fontSize: title.length > 16 ? 84 : 110, fontWeight: 800, lineHeight: 1, marginTop: 24, color: drip ? '#ff3b30' : '#ffd24d' }}>{title}</div>
          <div style={{ display: 'flex', fontSize: 38, color: '#a9a69c', marginTop: 24 }}>{a ? `${a.artist} · ${a.tracks.length} tracks` : ''}</div>
        </div>
        {cover && <img src={cover} width={420} height={420} style={{ borderRadius: 20 }} />}
      </div>
    ),
    size,
  )
}
