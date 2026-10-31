import type { Metadata } from 'next'
import { SHELF, TERRORNODE, mmss } from '@/lib/bmx/albums'
import { Case, StoreFoot, StoreTop } from '@/components/bmx/Store'
import '../store.css'

// Everything on bMusicX to listen to (owner 31 Oct 2026), in the store's own look. Albums with a full-album
// player link to /listen/<short>; the rest open their album page. Unlisted and noindex for now.
const FULL: Record<string, string> = { 'welcome-to-terrornode': '/listen/terrornode' }
const total = (s: { seconds: number }[]) => s.reduce((n, t) => n + t.seconds, 0)

export const metadata: Metadata = { title: 'Listen · bMusicX', robots: { index: false, follow: false } }

export default function ListenIndex() {
  const feat = TERRORNODE
  return (
    <main className="sx sx-has-bg">
      {feat.video && (
        <div className="sx-album-bg" aria-hidden="true">
          <video poster={feat.video.poster} autoPlay muted loop playsInline preload="metadata">
            <source src={feat.video.webm} type="video/webm" />
            <source src={feat.video.mp4} type="video/mp4" />
          </video>
        </div>
      )}
      <StoreTop />
      <div className="sx-wrap">
        <section className="sx-hero" aria-labelledby="listen-h">
          <div>
            <p className="sx-kicker">Listen · full album</p>
            {feat.titleImg
              ? <h1 id="listen-h" className="wmark"><img src={feat.titleImg} alt={feat.title} />{feat.titleSub && <span className="wsub">{feat.titleSub}</span>}</h1>
              : <h1 id="listen-h" className="goldt">{feat.title}</h1>}
            <p className="sx-line">{feat.line}</p>
            <div className="sx-meta">
              <span className="sx-chip">{feat.artist}</span>
              <span className="sx-chip">{feat.tracks.length} tracks · {mmss(total(feat.tracks))}</span>
            </div>
            <div className="sx-plays">
              <a className="sx-btn sx-gold" href="/listen/terrornode">&#9654; Play album</a>
              <a className="sx-btn sx-ghost" href={`/album/${feat.slug}`}>Tracklist &amp; mint</a>
            </div>
          </div>
          <Case a={feat} big href="/listen/terrornode" />
        </section>

        <section aria-labelledby="shelf-h">
          <div className="sx-shelf-h"><h2 id="shelf-h">Everything on bMusicX</h2></div>
          <div className="sx-shelf">
            {SHELF.map((a) => {
              const full = FULL[a.slug]
              return (
                <a key={a.slug} href={full ?? `/album/${a.slug}`} className={`sx-item${full ? ' sx-item-feat' : ''}`}>
                  <Case a={a} noStatus />
                  <div className="sx-item-t">{a.title}</div>
                  <div className="sx-item-s">{a.artist} · {a.tracks.length} {a.tracks.length === 1 ? 'track' : 'tracks'}{full ? ' · full album' : ' · samples'}</div>
                </a>
              )
            })}
          </div>
        </section>
      </div>
      <StoreFoot />
    </main>
  )
}
