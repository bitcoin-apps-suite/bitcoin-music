import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SHELF, albumBySlug, artistBySlug, artistSlug, mmss } from '@/lib/bmx/albums'
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
        {a.video && (
          <div className="sx-album-video">
            <video poster={a.video.poster} autoPlay muted loop playsInline controls preload="metadata" aria-label={`${a.title}: music video`}>
              <source src={a.video.webm} type="video/webm" />
              <source src={a.video.mp4} type="video/mp4" />
            </video>
          </div>
        )}
        <section className="sx-album">
          <div className="sx-album-art"><Case a={a} /></div>
          <div>
            <p className="sx-kicker">{a.genre}</p>
            {a.titleImg
              ? <h1 className="wmark sx-album-wmark"><img src={a.titleImg} alt={a.title} />{a.titleSub && <span className="wsub">{a.titleSub}</span>}</h1>
              : <h1 className={a.titleStyle === 'drip' ? 'drip' : 'goldt'}>{a.title}</h1>}
            <p className="sx-line">{a.line}</p>
            <div className="sx-meta">
              {artistBySlug(artistSlug(a.artist)) ? <a className="sx-chip" href={`/artist/${artistSlug(a.artist)}`}>{a.artist}</a> : <span className="sx-chip">{a.artist}</span>}
              <span className="sx-chip">{a.tracks.length} tracks · {mmss(total)}</span>
              <StatusChip a={a} />
            </div>
            <AlbumPlayer album={a} />
            <div className="sx-own">
              <h3>Status</h3>
              <ul className="sx-check">
                {a.live ? (
                  <li className="ok">Pay by the second in bWalletX</li>
                ) : (
                  <>
                    <li className={a.tracks.some((t) => t.src) ? 'ok' : ''}>Listen to samples, free</li>
                    <li>Pay by the second in bWalletX (coming)</li>
                    <li>Own the album: numbered edition (coming)</li>
                  </>
                )}
              </ul>
            </div>
            {a.credits && (
              <div className="sx-own">
                <h3>Credits</h3>
                {a.credits.map((c) => <p key={c}>{c}</p>)}
              </div>
            )}
          </div>
        </section>
      </div>
      <StoreFoot />
    </main>
  )
}
