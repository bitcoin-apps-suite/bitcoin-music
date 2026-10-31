'use client'

// bMusicX landing, laid out like bgamesx.com: centred kicker, a coverflow of album cases
// (arrows, swipe, keys and dots, so every album is reachable without sideways page scroll),
// the active album's title and play buttons, then the album shelf and artist rows.

import { useEffect, useRef, useState } from 'react'
import type { ShelfAlbum, ShelfTrack } from '@/lib/bmx/albums'
import { artistBySlug, artistSlug, mmss } from '@/lib/bmx/albums'
import { Case, StatusChip, StoreFoot, XHeader, XStrip } from './Store'
import OffersShelf from './OffersShelf'

type Artist = { name: string; picks: { album: ShelfAlbum; track?: ShelfTrack }[] }

// Artists are derived from the data: an album artist, or a "(Name)" credit in a track title.
function artistsFrom(albums: ShelfAlbum[]): Artist[] {
  const map = new Map<string, Artist>()
  const get = (name: string) => {
    if (!map.has(name)) map.set(name, { name, picks: [] })
    return map.get(name)!
  }
  for (const a of albums) {
    get(a.artist).picks.push({ album: a })
    for (const t of a.tracks) {
      const m = t.title.match(/\(([^)]+)\)$/)
      const known = m && ['VexVoid', 'Vivienne Void', 'CherryX'].find((n) => n.toLowerCase() === m[1].toLowerCase())
      if (known && known !== a.artist) get(known).picks.push({ album: a, track: t })
    }
  }
  return [...map.values()]
}

export default function Landing({ albums }: { albums: ShelfAlbum[] }) {
  const N = albums.length
  const [cur, setCur] = useState(0)
  const [drag, setDrag] = useState(0)
  const [cw, setCw] = useState(300)
  const [wide, setWide] = useState(1000)
  const flow = useRef<HTMLDivElement>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const [now, setNow] = useState<{ album: ShelfAlbum; i: number } | null>(null)
  const [playing, setPlaying] = useState(false)
  const g = albums[cur]

  useEffect(() => {
    const measure = () => {
      const el = flow.current
      if (!el) return
      setWide(el.clientWidth)
      const c = el.querySelector<HTMLElement>('.lx-cart')
      if (c) setCw(c.offsetWidth)
    }
    measure()
    addEventListener('resize', measure)
    return () => removeEventListener('resize', measure)
  }, [])

  // Audio: one shared element; plays through an album and stops at its end.
  useEffect(() => {
    const a = audio.current
    if (!a) return
    const ended = () => {
      if (!now) return
      const nx = now.album.tracks.findIndex((t, j) => j > now.i && t.src)
      if (nx >= 0) play(now.album, nx)
      else setPlaying(false)
    }
    a.addEventListener('ended', ended)
    return () => a.removeEventListener('ended', ended)
  })

  function play(album: ShelfAlbum, i = album.tracks.findIndex((t) => t.src)) {
    const a = audio.current
    const t = album.tracks[i]
    if (!a || !t?.src) return
    if (now && now.album.slug === album.slug && now.i === i) {
      if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {})
      else { a.pause(); setPlaying(false) }
      return
    }
    setNow({ album, i })
    a.src = t.src
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }
  const isOn = (album: ShelfAlbum, i?: number) => playing && now?.album.slug === album.slug && (i === undefined || now.i === i)

  const go = (i: number) => { setCur(((i % N) + N) % N); setDrag(0) }

  // Trackpad / Magic Mouse swipe: horizontal wheel (or Shift+wheel) steps one album per gesture.
  // Vertical wheel is never touched, so the page still scrolls. A long fast swipe may step twice.
  const curRef = useRef(cur)
  curRef.current = cur
  useEffect(() => {
    const el = flow.current
    if (!el || !N) return
    let acc = 0, steps = 0, idle: ReturnType<typeof setTimeout> | undefined
    const step = (d: number) => { setCur((((curRef.current + d) % N) + N) % N); setDrag(0) }
    const onWheel = (e: WheelEvent) => {
      const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1
      let dx = e.deltaX * k, dy = e.deltaY * k
      if (e.shiftKey && !dx) { dx = dy; dy = 0 }
      if (Math.abs(dx) <= Math.abs(dy) || Math.abs(dx) < 2) return
      e.preventDefault()
      clearTimeout(idle)
      idle = setTimeout(() => { acc = 0; steps = 0 }, 200) // momentum tail over: unlock
      acc += dx
      if (steps === 0 && Math.abs(acc) >= 50) { step(Math.sign(acc)); steps = 1; acc = 0 }
      else if (steps === 1 && Math.abs(acc) >= 600) { step(Math.sign(acc)); steps = 2 }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => { el.removeEventListener('wheel', onWheel); clearTimeout(idle) }
  }, [N])

  // Swipe / drag (vertical page scroll stays native via touch-action: pan-y).
  const st = useRef({ down: false, moved: false, x: 0, y: 0 })
  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.lx-arrow')) return
    st.current = { down: true, moved: false, x: e.clientX, y: e.clientY }
  }
  const onMove = (e: React.PointerEvent) => {
    const s = st.current
    if (!s.down) return
    const dx = e.clientX - s.x
    if (!s.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
      s.moved = true
      try { flow.current?.setPointerCapture(e.pointerId) } catch {}
    }
    if (s.moved) setDrag(-dx / (cw * 0.6))
  }
  const onUp = () => {
    const s = st.current
    if (!s.down) return
    s.down = false
    if (s.moved) { go(Math.round(cur + drag)); setTimeout(() => { s.moved = false }, 0) }
  }

  const narrow = wide < cw * 2.4
  const gap = cw * (narrow ? 0.42 : 0.5)
  const artists = artistsFrom(albums)

  return (
    <main className="sx">
      <XStrip />
      <section className="xs-top" aria-labelledby="xs-h1">
        {/* Neutral brand backdrop: no single release on the home hero (owner 31 Oct); TERRORNODE lives on its album page. */}
        <div className="xs-bg bmx-hero-bg" aria-hidden="true">{Array.from({ length: 48 }, (_, i) => <i key={i} style={{ height: `${18 + ((i * 37) % 70)}%`, animationDelay: `${(i % 12) * -0.35}s` }} />)}</div>
        <XHeader />
        <div className="xs-wrap xs-in">
          <h1 className="xs-h1" id="xs-h1"><i>b</i>Music<span className="xs-x">X</span></h1>
          <p className="xs-lede">Free samples of every album. VexVoid streams in full, paid by the second.</p>
          <div className="xs-ctas">
            <a className="xs-btn xs-ghost" href="#shelf-h">Browse</a>
            <a className="xs-btn xs-gold" href="https://bwalletx.com/get">Get bWalletX</a>
          </div>
        </div>
      </section>
      <audio ref={audio} preload="none" />

      <section className="lx-hero" aria-roledescription="carousel" aria-label="Albums">
        <p className="xs-kick">Pick an album</p>
        <div
          className={`lx-flow${st.current.moved ? ' drag' : ''}`}
          ref={flow}
          tabIndex={0}
          aria-label="Album cases. Use left and right arrow keys."
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') { go(cur - 1); e.preventDefault() }
            else if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault() }
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {albums.map((a, i) => {
            let o = i - cur - drag
            o = (((o % N) + N + N / 2) % N) - N / 2
            const ab = Math.abs(o), s = Math.sign(o)
            const x = ab < 1 ? o * cw * 0.62 : s * (cw * 0.62 + (ab - 1) * gap)
            const ry = Math.max(-1, Math.min(1, o)) * -42
            const z = -Math.min(ab, 1) * cw * 0.5 - Math.max(0, ab - 1) * 30
            return (
              <div
                key={a.slug}
                className={`lx-cart${i === cur && !drag ? ' on' : ''}${drag ? ' nodur' : ''}`}
                style={{
                  transform: `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${ry.toFixed(1)}deg)`,
                  zIndex: 100 - Math.round(ab * 10),
                  opacity: Math.max(0.25, 1 - ab * 0.14),
                  filter: ab < 0.5 ? 'none' : `brightness(${Math.max(0.45, 1 - ab * 0.18).toFixed(2)})`,
                }}
                onClick={() => { if (!st.current.moved && i !== cur) go(i) }}
                role="group"
                aria-label={`${a.title} by ${a.artist}`}
                aria-hidden={i !== cur}
              >
                <Case a={a} big />
              </div>
            )
          })}
          <button className="lx-arrow prev" type="button" aria-label="Previous album" onClick={() => go(cur - 1)}>&larr;</button>
          <button className="lx-arrow next" type="button" aria-label="Next album" onClick={() => go(cur + 1)}>&rarr;</button>
        </div>

        <div className="lx-info" aria-live="polite">
          {g.titleImg ? (<h1 className="wmark"><img src={g.titleImg} alt={g.title} />{g.titleSub && <span className="wsub">{g.titleSub}</span>}</h1>) : (<h1 className={g.titleStyle === 'drip' ? 'drip' : 'goldt'}>{g.title}</h1>)}
          <p>{g.line}</p>
          <div className="lx-meta">
            <span className="sx-chip">{g.artist}</span>
            <span className="sx-chip">{g.tracks.length} tracks · {mmss(g.tracks.reduce((n, t) => n + t.seconds, 0))}</span>
            <StatusChip a={g} />
          </div>
          <div className="lx-plays">
            {g.live ? (
              <a className="sx-btn sx-gold" href={g.listenUrl}>&#9654; Listen in bWalletX</a>
            ) : (
              <button className="sx-btn sx-gold" type="button" onClick={() => play(g)}>
                {isOn(g) ? '❚❚ Pause' : '▶ Play samples'}
              </button>
            )}
            <a className="sx-btn sx-ghost" href={`/album/${g.slug}`}>Tracklist</a>
          </div>
          <div className="lx-dots" role="tablist" aria-label="Choose an album">
            {albums.map((a, i) => (
              <button key={a.slug} type="button" role="tab" aria-label={a.title} aria-current={i === cur} onClick={() => go(i)} />
            ))}
          </div>
        </div>
      </section>

      <div className="sx-wrap">
        <OffersShelf />
        <section aria-labelledby="shelf-h" className="lx-sec">
          <div className="sx-shelf-h xs-cat"><div><p className="xs-eye">The catalogue</p><h2 id="shelf-h">Already on <i>bMusicX.</i></h2><p className="xs-sub">Every album here. Tap play for samples, or open the tracklist.</p></div></div>
          <div className="sx-shelf">
            {albums.map((a) => (
              <div key={a.slug} className={`sx-item lx-item${a.featured ? ' sx-item-feat' : ''}`}>
                <div className="lx-art">
                <a href={`/album/${a.slug}`}><Case a={a} /></a>
                {a.live ? (
                  <a className="lx-pp" href={a.listenUrl} aria-label={`Listen to ${a.title} in bWalletX`}>&#9654;</a>
                ) : (
                  <button className="lx-pp" type="button" onClick={() => play(a)} aria-label={isOn(a) ? 'Pause' : `Play samples from ${a.title}`}>{isOn(a) ? '❚❚' : '▶'}</button>
                )}
                </div>
                <a href={`/album/${a.slug}`}>
                  <div className="sx-item-t">{a.title}</div>
                  <div className="sx-item-s">{a.artist} · {a.tracks.length} tracks</div>
                </a>
              </div>
            ))}
          </div>
        </section>

        <div id="artists">
        {artists.map((ar) => (
          <section key={ar.name} className="lx-sec lx-artist" aria-labelledby={`ar-${ar.name}`}>
            <div className="sx-shelf-h">
              <h2 id={`ar-${ar.name}`}>{artistBySlug(artistSlug(ar.name)) ? <a href={`/artist/${artistSlug(ar.name)}`}>{ar.name}</a> : ar.name}</h2>
              <span className="lx-count">{ar.picks.filter((p) => !p.track).length ? `${ar.picks.filter((p) => !p.track).length} album${ar.picks.filter((p) => !p.track).length > 1 ? 's' : ''}` : `${ar.picks.length} track${ar.picks.length > 1 ? 's' : ''}`}</span>
            </div>
            <div className="lx-row">
              {ar.picks.map(({ album, track }) => {
                const i = track ? album.tracks.indexOf(track) : -1
                const key = album.slug + (track ? `-${track.n}` : '')
                return (
                  <div key={key} className="lx-tile">
                    <img src={album.cover} alt="" loading="lazy" />
                    <div className="lx-tile-t">
                      <strong>{track ? track.title.replace(/\s*\([^)]+\)$/, '') : album.title}</strong>
                      <span>{track ? `On ${album.title} · ${mmss(track.seconds)}` : `${album.tracks.length} tracks`}</span>
                    </div>
                    {album.live ? (
                      <a className="lx-pp sm" href={album.listenUrl} aria-label="Listen in bWalletX">&#9654;</a>
                    ) : (
                      <button className="lx-pp sm" type="button" onClick={() => play(album, track ? i : undefined)} aria-label={(track ? isOn(album, i) : isOn(album)) ? 'Pause' : 'Play'}>
                        {(track ? isOn(album, i) : isOn(album)) ? '❚❚' : '▶'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
        </div>

        <section className="sx-how" id="creators" aria-label="For creators">
          <div><h3>For creators</h3><p>Every second a fan listens in bWalletX pays the artist directly. VexVoid streams in full today; anyone can press play here for free samples of any album.</p></div>
          <div><h3>Albums</h3><p>Open an album for the full tracklist and player.</p></div>
          <div><h3>TERRORNODE</h3><p>The album is the soundtrack to the TERRORNODE game on bGamesX.</p></div>
        </section>
      </div>

      {now && (
        <div className="lx-now" role="region" aria-label="Now playing">
          <img src={now.album.cover} alt="" />
          <div className="lx-now-t"><strong>{now.album.tracks[now.i].title}</strong><span>{now.album.tracks[now.i].sampleSeconds ? `Sample · ${now.album.tracks[now.i].sampleSeconds}s · ` : ''}{now.album.title} · {now.album.artist}</span></div>
          <button className="lx-pp sm" type="button" onClick={() => play(now.album, now.i)} aria-label={playing ? 'Pause' : 'Play'}>{playing ? '❚❚' : '▶'}</button>
        </div>
      )}
      <StoreFoot />
    </main>
  )
}
