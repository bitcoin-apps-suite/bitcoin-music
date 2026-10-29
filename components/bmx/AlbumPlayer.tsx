'use client'

import { useEffect, useRef, useState } from 'react'
import type { ShelfAlbum } from '@/lib/bmx/albums'
import { mmss } from '@/lib/bmx/albums'

export default function AlbumPlayer({ album }: { album: ShelfAlbum }) {
  const playable = !album.live && album.tracks.some((t) => t.src)
  const audio = useRef<HTMLAudioElement | null>(null)
  const [cur, setCur] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const t = album.tracks[cur]

  useEffect(() => {
    const a = audio.current
    if (!a) return
    const tick = () => setPos(a.duration ? a.currentTime / a.duration : 0)
    const next = () => (cur + 1 < album.tracks.length ? pick(cur + 1) : setPlaying(false))
    a.addEventListener('timeupdate', tick)
    a.addEventListener('ended', next)
    return () => { a.removeEventListener('timeupdate', tick); a.removeEventListener('ended', next) }
  })

  function pick(i: number) {
    const a = audio.current
    const tr = album.tracks[i]
    if (!a || !tr?.src) return
    setCur(i)
    a.src = tr.src
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }
  function toggle() {
    const a = audio.current
    if (!a) return
    if (!a.src) return pick(cur)
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {})
    else { a.pause(); setPlaying(false) }
  }
  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = audio.current
    if (!a || !a.duration) return
    const r = e.currentTarget.getBoundingClientRect()
    a.currentTime = ((e.clientX - r.left) / r.width) * a.duration
  }

  return (
    <>
      {album.live ? (
        <div className="sx-player">
          <div className="sx-now">
            <a className="sx-pp" href={album.listenUrl} aria-label="Listen in bWalletX">&#9654;</a>
            <div className="sx-now-t"><strong>Listen in bWalletX</strong><span>{album.satsPerSecond} sat a second to the artist</span></div>
          </div>
          <p className="sx-note">Music you pay for by the second. Every second you play goes straight to the artist, with no subscription and no middleman. Open the album in bWalletX and press play.</p>
        </div>
      ) : (
        <div className="sx-player">
          <audio ref={audio} preload="none" />
          <div className="sx-now">
            <button className="sx-pp" type="button" onClick={toggle} disabled={!playable} aria-label={playing ? 'Pause' : 'Play'}>{playing ? '❚❚' : '▶'}</button>
            <div className="sx-now-t"><strong>{t.n}. {t.title}</strong><span>{album.artist} · {t.sampleSeconds ? `Sample · ${t.sampleSeconds}s of ${mmss(t.seconds)}` : mmss(t.seconds)}</span></div>
          </div>
          <button className="sx-playall" type="button" onClick={() => (playing ? toggle() : pick(cur))} disabled={!playable}>{playing ? 'Pause' : 'Play samples'}</button>
          <div className="sx-bar" onClick={seek} role="presentation"><i style={{ width: `${(pos * 100).toFixed(1)}%` }} /></div>
        </div>
      )}
      <ol className="sx-tracks">
        {album.tracks.map((tr, i) => (
          <li key={tr.n}>
            {album.live ? (
              <a href={album.listenUrl}>
                <span className="sx-tn">{tr.n}</span>
                <span className="sx-tt"><strong>{tr.title}</strong></span>
                <span className="sx-td">{mmss(tr.seconds)}</span>
              </a>
            ) : (
              <button type="button" className={i === cur && playing ? 'on' : ''} onClick={() => pick(i)}>
                <span className="sx-tn">{i === cur && playing ? '♪' : tr.n}</span>
                <span className="sx-tt"><strong>{tr.title}</strong><small>{tr.sampleSeconds ? `Sample · ${tr.sampleSeconds}s` : null}{tr.sampleSeconds && tr.note ? ' · ' : null}{tr.note}</small></span>
                <span className="sx-td">{mmss(tr.seconds)}</span>
              </button>
            )}
          </li>
        ))}
      </ol>
    </>
  )
}
