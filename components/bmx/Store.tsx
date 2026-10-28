import type { ShelfAlbum } from '@/lib/bmx/albums'
import { mmss } from '@/lib/bmx/albums'

const total = (a: ShelfAlbum) => a.tracks.reduce((n, t) => n + t.seconds, 0)

export function StoreTop() {
  return (
    <>
      <div className="sx-strip">Music you play in <b>bWalletX</b>. Every second you play pays the artist.</div>
      <header className="sx-wrap sx-nav">
        <a className="sx-brand" href="/" aria-label="bMusicX home">bMusic<span className="sx-gx">X</span></a>
        <a className="sx-btn sx-gold" href="https://bwalletx.com">Get bWalletX</a>
      </header>
    </>
  )
}

export function StoreFoot() {
  return (
    <footer className="sx-wrap sx-foot">
      <span>bMusicX · The Bitcoin Corporation Ltd</span>
      <nav>
        <a href="https://bwalletx.com">bWalletX</a>
        <a href="https://bgamesx.com">bGamesX</a>
        <a href="https://terrornode.com">TERRORNODE</a>
        <a href="https://github.com/bitcoin-apps-suite/bitcoin-music">Open source</a>
      </nav>
    </footer>
  )
}

export function StatusChip({ a }: { a: ShelfAlbum }) {
  return a.live
    ? <span className="sx-chip sx-chip-live"><i />Live · {a.satsPerSecond} sat a second</span>
    : <span className="sx-chip sx-chip-soon">Streaming: coming</span>
}

export function Case({ a, big, href }: { a: ShelfAlbum; big?: boolean; href?: string }) {
  const inner = (
    <>
      <div className="sx-case-win">
        <img src={a.cover} alt={`${a.title} cover`} loading={big ? 'eager' : 'lazy'} />
        <div className="sx-case-badge">
          {a.featured && <span className="sx-chip sx-chip-gold">New album</span>}
          {!big && <StatusChip a={a} />}
        </div>
        {big && (
          <div className="sx-case-cap">
            <strong>{a.title}</strong>
            <span>{a.artist} · {a.tracks.length} tracks</span>
          </div>
        )}
      </div>
      {big && a.slug === 'welcome-to-terrornode' && <img className="sx-logo-badge" src="/bmx/covers/terrornode-logo.webp" alt="" />}
    </>
  )
  return href ? <a className="sx-case" href={href}>{inner}</a> : <div className="sx-case">{inner}</div>
}

export default function Store({ albums }: { albums: ShelfAlbum[] }) {
  const feat = albums.find((a) => a.featured) ?? albums[0]
  return (
    <main className="sx">
      <StoreTop />
      <div className="sx-wrap">
        <section className="sx-hero" aria-labelledby="hero-h">
          <div>
            <p className="sx-kicker">New on bMusicX</p>
            <h1 id="hero-h" className={feat.titleStyle === 'drip' ? 'drip' : 'goldt'}>{feat.title}</h1>
            <p className="sx-line">{feat.line}</p>
            <div className="sx-meta">
              <span className="sx-chip">{feat.artist}</span>
              <span className="sx-chip">{feat.tracks.length} tracks · {mmss(total(feat))}</span>
              <StatusChip a={feat} />
            </div>
            <div className="sx-plays">
              <a className="sx-btn sx-gold" href={`/album/${feat.slug}`}>&#9654; See the tracklist</a>
              <a className="sx-btn sx-ghost" href="https://www.tokenblaster.lol/arcade/terrornode">Play the game</a>
            </div>
          </div>
          <Case a={feat} big href={`/album/${feat.slug}`} />
        </section>

        <section aria-labelledby="shelf-h">
          <div className="sx-shelf-h"><h2 id="shelf-h">Albums</h2></div>
          <div className="sx-shelf">
            {albums.map((a) => (
              <a key={a.slug} href={`/album/${a.slug}`} className={`sx-item${a.featured ? ' sx-item-feat' : ''}`}>
                <Case a={a} />
                <div className="sx-item-t">{a.title}</div>
                <div className="sx-item-s">{a.artist} · {a.tracks.length} tracks</div>
              </a>
            ))}
          </div>
        </section>

        <section className="sx-how">
          <div><h3>Play</h3><p>Each second is unlocked by a tiny payment from your wallet, straight to the artist.</p></div>
          <div><h3>Sponsored</h3><p>Artists can fund a pot so new listeners hear their music free.</p></div>
          <div><h3>Fans</h3><p>Opt in and your listening counts on the artist&rsquo;s public fan board.</p></div>
        </section>
      </div>
      <StoreFoot />
    </main>
  )
}
