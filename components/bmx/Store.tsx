import Script from 'next/script'
import '@/app/xshell.css'
import type { ShelfAlbum } from '@/lib/bmx/albums'
import { mmss } from '@/lib/bmx/albums'

const total = (a: ShelfAlbum) => a.tracks.reduce((n, t) => n + t.seconds, 0)

// Shared b*X shell (same markup on bmoviesx.com and bvideox.com; only the accent colour and art differ).
export function XStrip() {
  return (
    <aside className="xs-strip" aria-label="bWalletX">
      <a href="https://bwalletx.com">
        <svg viewBox="23 8 74 100" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="xs-sg" gradientUnits="userSpaceOnUse" x1="0" y1="12" x2="0" y2="105"><stop offset="0" stopColor="#FFE58A" /><stop offset=".55" stopColor="#FFD24D" /><stop offset="1" stopColor="#C98F00" /></linearGradient>
            <mask id="xs-sm"><rect width="140" height="140" fill="#fff" /><circle cx="60" cy="72" r="15" fill="#000" /></mask>
          </defs>
          <g fill="url(#xs-sg)" mask="url(#xs-sm)"><polygon points="45,12 45,72 27,72 27,30" /><circle cx="60" cy="72" r="33" /></g>
        </svg>
        <span>Part of <b>bWalletX</b></span><span className="xs-go" aria-hidden="true">&rarr;</span>
      </a>
    </aside>
  )
}

export function XHeader() {
  return (
    <header className="xs-wrap xs-nav">
      <a className="xs-brand" href="/" aria-label="bMusicX home">
        <svg viewBox="23 8 74 100" aria-hidden="true" focusable="false">
          <mask id="xs-bm"><rect width="140" height="140" fill="#fff" /><circle cx="60" cy="72" r="15" fill="#000" /></mask>
          <g fill="currentColor" mask="url(#xs-bm)"><polygon points="45,12 45,72 27,72 27,30" /><circle cx="60" cy="72" r="33" /></g>
        </svg>
        <span><span className="xs-sr">b</span><span className="xs-nm">Music</span><i>X</i></span>
      </a>
      <nav className="xs-links" aria-label="Main">
        <a href="/#shelf-h">Browse</a>
        <a className="xs-hs" href="/#artists">Artists</a>
        <a className="xs-hs" href="/#creators">For creators</a>
        {/* One wallet control: Get bWalletX (no wallet here) / Connect / paymail pill (connected). */}
        <span data-bwx-connect="" suppressHydrationWarning />
      </nav>
      <Script src="https://unpkg.com/@bwalletx/connect@0.5.0/dist/bwalletx-connect.global.js" integrity="sha384-1XiN/accJppMI7qXUHzNrUAdUWIotONkjNy7rZBrwcvPxDCFk1yC83JY2c4LZ8gg" crossOrigin="anonymous" strategy="afterInteractive" />
      <Script src="/bwx-connect.js" strategy="afterInteractive" />
    </header>
  )
}

export function StoreTop() {
  return (
    <>
      <XStrip />
      <XHeader />
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
            {feat.titleImg ? (<h1 id="hero-h" className="wmark"><img src={feat.titleImg} alt={feat.title} />{feat.titleSub && <span className="wsub">{feat.titleSub}</span>}</h1>) : (<h1 id="hero-h" className={feat.titleStyle === 'drip' ? 'drip' : 'goldt'}>{feat.title}</h1>)}
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
