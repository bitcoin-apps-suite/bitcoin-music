import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ARTISTS, artistBySlug, artistWork, mmss } from '@/lib/bmx/albums'
import { Case, StoreFoot, StoreTop } from '@/components/bmx/Store'
import '../../store.css'

export function generateStaticParams() {
  return ARTISTS.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const ar = artistBySlug((await params).slug)
  if (!ar) return {}
  const title = `${ar.name} on bMusicX`
  return { title, description: ar.bio, alternates: { canonical: `https://bmusicx.com/artist/${ar.slug}` }, openGraph: { title, description: ar.bio }, twitter: { title, description: ar.bio } }
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const ar = artistBySlug((await params).slug)
  if (!ar) notFound()
  const { albums, guest } = artistWork(ar.name)
  return (
    <main className="sx">
      <StoreTop />
      <div className="sx-wrap">
        <a className="sx-back" href="/">&larr; All albums</a>
        <section className="sx-artist">
          <img src={ar.photo} alt={ar.name} />
          <div>
            <p className="sx-kicker">Artist</p>
            <h1 className="goldt">{ar.name}</h1>
            <p className="sx-line">{ar.bio}</p>
          </div>
        </section>
        <section className="lx-sec">
          <div className="sx-shelf-h"><h2>Releases</h2></div>
          <div className="sx-shelf">
            {albums.map((a) => (
              <a key={a.slug} href={`/album/${a.slug}`} className="sx-item">
                <Case a={a} />
                <div className="sx-item-t">{a.title}</div>
                <div className="sx-item-s">{a.tracks.length} track{a.tracks.length > 1 ? 's' : ''}</div>
              </a>
            ))}
          </div>
        </section>
        {guest.length > 0 && (
          <section className="lx-sec">
            <div className="sx-shelf-h"><h2>Also on</h2></div>
            <div className="lx-row">
              {guest.map(({ album, track }) => (
                <a key={album.slug + track.n} className="lx-tile" href={`/album/${album.slug}`}>
                  <img src={album.cover} alt="" loading="lazy" />
                  <div className="lx-tile-t">
                    <strong>{track.title.replace(/\s*\([^)]+\)$/, '')}</strong>
                    <span>Track {track.n} on {album.title} · {mmss(track.seconds)}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
      <StoreFoot />
    </main>
  )
}
