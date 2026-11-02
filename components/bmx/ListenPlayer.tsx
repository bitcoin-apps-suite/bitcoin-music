'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { ShelfAlbum } from '@/lib/bmx/albums'
import type { ListenTrack } from '@/lib/bmx/listen'

// The /listen/<album> player (first built for TERRORNODE, 31 Oct 2026), one template for every album.
// It plays exactly the `tracks` the page passes (lib/bmx/listen.ts, server-side): full files only for albums the
// owner has published in full, otherwise the same samples as the album page. `gate` is the slot for a pay/own step above the player;
// pages pass one only when a working payment path is already live (today: the bWalletX link for live albums).
export default function ListenPlayer({ album, tracks: TRACKS, gate }: { album: ShelfAlbum; tracks: ListenTrack[]; gate?: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const a = audio.current
    if (!a || !TRACKS.length) return
    const want = TRACKS[i].src
    // onEnded already loaded and started the next track; only load here when the user picked one.
    if (!a.src.endsWith(want)) {
      a.src = want
      if (playing) void a.play().catch(() => setPlaying(false))
    }
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: TRACKS[i].title,
        artist: album.artist,
        album: album.title,
        artwork: [{ src: album.cover, sizes: '512x512', type: album.cover.endsWith('.jpg') ? 'image/jpeg' : 'image/webp' }],
      })
      navigator.mediaSession.setActionHandler('nexttrack', () => setI((n) => (n + 1) % TRACKS.length))
      navigator.mediaSession.setActionHandler('previoustrack', () => setI((n) => (n - 1 + TRACKS.length) % TRACKS.length))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i])

  const pick = (n: number) => {
    setPlaying(true)
    if (n === i) void audio.current?.play()
    else setI(n)
  }

  const samples = TRACKS.some((t) => t.sampleSeconds)
  const count = album.tracks.length

  return (
    <>
    {album.video ? (
      // Album video behind everything, muted and dimmed; the music comes from the <audio> player.
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: '#000' }}>
        <video poster={album.video.poster} autoPlay muted loop playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}>
          <source src={album.video.webm} type="video/webm" />
          <source src={album.video.mp4} type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.7))' }} />
      </div>
    ) : (
      // No video: the cover, blurred and dimmed, in the same place.
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: '#000' }}>
        <img src={album.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, filter: 'blur(28px)', transform: 'scale(1.15)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,.8))' }} />
      </div>
    )}
    <main className="lx" style={{ position: 'relative', zIndex: 1, minHeight: '100svh', color: '#f1ead9', fontFamily: 'system-ui, sans-serif', padding: '24px 16px 120px', maxWidth: 560, margin: '0 auto' }}>
      <style>{'.lx a:focus-visible,.lx button:focus-visible,.lx audio:focus-visible{outline:2px solid #ffd24d;outline-offset:2px}'}</style>
      <img src={album.cover} alt={album.title} style={{ width: '100%', borderRadius: 14, display: 'block' }} />
      <h1 style={{ fontSize: 24, margin: '18px 0 2px' }}>{album.title}</h1>
      <p style={{ margin: '0 0 16px', color: '#8a8a86' }}>{album.artist} · {count} {count === 1 ? 'track' : 'tracks'}{samples ? ' · samples' : ''}</p>
      {gate}
      {TRACKS.length > 0 && (
        <audio
          ref={audio}
          controls
          preload="metadata"
          playsInline
          onPlay={() => setPlaying(true)}
          onPause={(e) => {
            // A track ending also fires "pause"; that is not the listener pausing.
            if (!e.currentTarget.ended) setPlaying(false)
          }}
          onEnded={(e) => {
            // Start the next track inside the ended event so iOS keeps playing in the background.
            const a = e.currentTarget
            const next = (i + 1) % TRACKS.length
            a.src = TRACKS[next].src
            void a.play().catch(() => setPlaying(false))
            setI(next)
          }}
          style={{ width: '100%' }}
        />
      )}
      <ol style={{ listStyle: 'none', padding: 0, margin: '16px 0 0' }}>
        {TRACKS.length > 0
          ? TRACKS.map((t, n) => (
            <li key={n}>
              <button
                onClick={() => pick(n)}
                style={{ width: '100%', textAlign: 'left', padding: '14px 12px', border: 0, borderBottom: '1px solid #ffffff14', background: n === i ? '#2F7BFF33' : 'rgba(0,0,0,.35)', color: n === i ? '#7fb0ff' : '#f1ead9', fontSize: 16 }}
              >
                {String(n + 1).padStart(2, '0')}  {t.title}
                {t.sampleSeconds ? <span style={{ color: '#c9c4b6', fontSize: 13 }}> · sample, {t.sampleSeconds}s</span> : null}
              </button>
            </li>
          ))
          : album.tracks.map((t) => (
            // Live (bWalletX) albums: no audio on this page, each track opens the album in bWalletX.
            <li key={t.n}>
              {album.listenUrl ? (
                <a href={album.listenUrl} style={{ display: 'block', padding: '14px 12px', borderBottom: '1px solid #ffffff14', background: 'rgba(0,0,0,.35)', color: '#f1ead9', fontSize: 16, textDecoration: 'none' }}>
                  {String(t.n).padStart(2, '0')}  {t.title}
                </a>
              ) : (
                <div style={{ padding: '14px 12px', borderBottom: '1px solid #ffffff14', background: 'rgba(0,0,0,.35)', color: '#f1ead9', fontSize: 16 }}>
                  {String(t.n).padStart(2, '0')}  {t.title}
                </div>
              )}
            </li>
          ))}
      </ol>
    </main>
    </>
  )
}
