import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SHELF, albumBySlug, mmss } from '@/lib/bmx/albums'
import { Case, StatusChip, StoreFoot, StoreTop } from '@/components/bmx/Store'
import AlbumPlayer from '@/components/bmx/AlbumPlayer'
import '../../store.css'

export function generateStaticParams() {
  return SHELF.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = albumBySlug((await params).slug)
  if (!a) return {}
  const title = `${a.title} · ${a.artist}`
  return { title, description: a.line, alternates: { canonical: `https://bmusicx.com/album/${a.slug}` }, openGraph: { title, description: a.line }, twitter: { title, description: a.line } }
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const a = albumBySlug((await params).slug)
  if (!a) notFound()
  const total = a.tracks.reduce((n, t) => n + t.seconds, 0)
  return (
    <main className="sx">
      <StoreTop />
      <div className="sx-wrap">
        <a className="sx-back" href="/">&larr; All albums</a>
        <section className="sx-album">
          <div className="sx-album-art"><Case a={a} /></div>
          <div>
            <p className="sx-kicker">{a.genre}</p>
            <h1 className={a.titleStyle === 'drip' ? 'drip' : 'goldt'}>{a.title}</h1>
            <p className="sx-line">{a.line}</p>
            <div className="sx-meta">
              <span className="sx-chip">{a.artist}</span>
              <span className="sx-chip">{a.tracks.length} tracks · {mmss(total)}</span>
              <StatusChip a={a} />
            </div>
            <AlbumPlayer album={a} />
            <div className="sx-own">
              <h3>Buy and own</h3>
              <p>Not available yet.</p>
              <span className="sx-btn sx-ghost" aria-disabled="true">Coming</span>
            </div>
          </div>
        </section>
      </div>
      <StoreFoot />
    </main>
  )
}
