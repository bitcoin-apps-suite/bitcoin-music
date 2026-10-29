import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { artistBySlug, artistWork } from '@/lib/bmx/albums'

export const alt = 'Artist on bMusicX'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Uses the artist's first release jpg in public/bmx/og (Satori cannot decode webp).
export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const ar = artistBySlug((await params).slug)
  const first = ar ? artistWork(ar.name).albums[0] : undefined
  let cover: string | null = null
  if (first) {
    try { cover = `data:image/jpeg;base64,${(await readFile(path.join(process.cwd(), 'public/bmx/og', `${first.slug}.jpg`))).toString('base64')}` } catch {}
  }
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: 56, padding: 72, background: 'radial-gradient(circle at 75% 30%, #3d2c00 0%, #000 65%)', color: '#f4f1e8' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', fontSize: 34, color: '#ffd24d', letterSpacing: 2 }}>bMusicX · Artist</div>
          <div style={{ display: 'flex', fontSize: 104, fontWeight: 800, lineHeight: 1, marginTop: 24, color: '#ffd24d' }}>{ar?.name ?? 'bMusicX'}</div>
        </div>
        {cover && <img src={cover} width={420} height={420} style={{ borderRadius: 20 }} />}
      </div>
    ),
    size,
  )
}
