import type { Metadata } from 'next'
import { SHELF } from '@/lib/bmx/albums'

// Everything on bMusicX in one list (owner 31 Oct 2026). Albums with a full-album listening page link there
// (/listen/<slug>); the rest open their album page. Unlisted and noindex for now.
const FULL: Record<string, string> = { 'welcome-to-terrornode': '/listen/terrornode' }

export const metadata: Metadata = { title: 'Listen · bMusicX', robots: { index: false, follow: false } }

export default function ListenIndex() {
  return (
    <main style={{ minHeight: '100svh', background: '#000', color: '#f1ead9', fontFamily: 'system-ui, sans-serif', padding: '24px 16px 80px', maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, margin: '0 0 4px' }}>Listen</h1>
      <p style={{ margin: '0 0 20px', color: '#8a8a86' }}>Everything on bMusicX.</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
        {SHELF.map((a) => {
          const full = FULL[a.slug]
          return (
            <li key={a.slug}>
              <a href={full ?? `/album/${a.slug}`} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
                <img src={a.cover} alt={a.title} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 12, display: 'block' }} />
                <div style={{ marginTop: 8, fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                <div style={{ color: '#8a8a86', fontSize: 13 }}>
                  {a.artist} · {a.tracks.length} {a.tracks.length === 1 ? 'track' : 'tracks'}
                  {full ? <span style={{ color: '#7fb0ff' }}> · full album</span> : null}
                </div>
              </a>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
