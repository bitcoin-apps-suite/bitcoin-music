'use client'

import { useAlbumLive } from './LiveStatus'

export type Track = { n: number; trackId: string; title: string; seconds: number; kind: 'audio' | 'video' }
export type Album = { albumId: string; title: string; artist: string; cover: string; satsPerSegment: number; tracks: Track[]; listenUrl: string }

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

function AlbumCard({ album }: { album: Album }) {
  const { sponsored, releases, listened } = useAlbumLive(album.albumId, album.tracks.map((t) => t.trackId))
  const free = new Set(sponsored?.sponsored ? sponsored.sponsoredTracks ?? [] : [])
  const total = album.tracks.reduce((n, t) => n + t.seconds, 0)
  return (
    <article className="bmx-album">
      <a href={album.listenUrl} className="bmx-cover-wrap">
        <img src={album.cover} alt={`${album.title} cover`} className="bmx-cover" />
      </a>
      <div className="bmx-album-head">
        <div>
          <h2>{album.title}</h2>
          <p className="bmx-muted">{album.artist} · {album.tracks.length > 1 ? `${album.tracks.length} tracks · ` : ''}{mmss(total)}</p>
        </div>
        <a className="bmx-btn" href={album.listenUrl}>Listen</a>
      </div>
      <div className="bmx-badges">
        <span className="bmx-chip">{album.satsPerSegment} sat a second to the artist</span>
        {sponsored?.sponsored && <span className="bmx-chip bmx-chip-on">Some tracks free — the artist is paying</span>}
        {listened !== null && listened > 60 && <span className="bmx-chip">{Math.round(listened / 60).toLocaleString()} min played</span>}
      </div>
      <ol className="bmx-tracks">
        {album.tracks.map((t) => {
          const r = releases[t.trackId]
          return (
            <li key={t.trackId}>
              <a href={album.listenUrl}>
                <span className="bmx-n">{t.n}</span>
                <span className="bmx-title">{t.title}{t.kind === 'video' && <em> · video</em>}</span>
                {free.has(t.trackId) && <span className="bmx-tag bmx-tag-on">free</span>}
                {r?.minted ? <span className="bmx-tag">owned</span> : r?.forSale && r.mintPriceSats ? <span className="bmx-tag">1/1 · {r.mintPriceSats.toLocaleString()} sats</span> : null}
                <span className="bmx-dur">{mmss(t.seconds)}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </article>
  )
}

export default function Exchange({ albums }: { albums: Album[] }) {
  return (
    <main className="bmx">
      <header className="bmx-top">
        <a href="/" className="bmx-logo"><span className="bmx-b">b</span>Music<span className="bmx-b">X</span></a>
        <a href="https://bwalletx.com" className="bmx-link">Get bWalletX</a>
      </header>
      <section className="bmx-hero">
        <h1>Bitcoin Music Exchange</h1>
        <p>Music you pay for by the second. Every second you play goes straight to the artist — no subscription, no middleman. Open an album in bWalletX and press play.</p>
      </section>
      <section className="bmx-grid">
        {albums.map((a) => <AlbumCard key={a.albumId} album={a} />)}
      </section>
      <section className="bmx-how">
        <div><h3>Play</h3><p>Each second is unlocked by a tiny payment from your wallet, straight to the artist.</p></div>
        <div><h3>Sponsored</h3><p>Artists can fund a pot so new listeners hear their music free.</p></div>
        <div><h3>Fans</h3><p>Opt in and your listening counts on the artist&rsquo;s public fan board.</p></div>
      </section>
      <footer className="bmx-foot">
        <span>bMusicX · The Bitcoin Corporation Ltd</span>
        <span><a href="/tracks">Tracks</a> · <a href="/artists">Artists</a> · <a href="https://github.com/bitcoin-apps-suite/bitcoin-music">Open source</a></span>
      </footer>
    </main>
  )
}
