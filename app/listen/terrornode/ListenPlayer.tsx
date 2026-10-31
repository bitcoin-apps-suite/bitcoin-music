'use client'
import { useEffect, useRef, useState } from 'react'

const A = '/bmx/listen/terrornode'
const TRACKS = [
  ['Welcome to Terrornode', '01.m4a'],
  ['March of the Erobotz', '02.m4a'],
  ['I Am TERRORNODE', '03.m4a'],
  ['KAIJU-01', '04.m4a'],
  ['Tokyo Gutter Queen', '05.mp3'],
  ['Shibuya Mosh Pit', '06.mp3'],
  ['Akihabara Fury', '07.mp3'],
  ['Shinobi Girls', '08.mp3'],
  ['赤い雨 (Red Rain Signal)', '09.m4a'],
  ['Underground Empress', '10.mp3'],
  ['Molotov Kiss', '11.mp3'],
  ['Electric Geisha (電気芸者)', '12.m4a'],
] as const

export default function ListenPlayer() {
  const audio = useRef<HTMLAudioElement>(null)
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const a = audio.current
    if (!a) return
    const want = `${A}/${TRACKS[i][1]}`
    // onEnded already loaded and started the next track; only load here when the user picked one.
    if (!a.src.endsWith(want)) {
      a.src = want
      if (playing) void a.play().catch(() => setPlaying(false))
    }
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: TRACKS[i][0],
        artist: 'NPGX',
        album: 'WELCOME TO TERRORNODE',
        artwork: [{ src: '/bmx/covers/terrornode-cover.webp', sizes: '512x512', type: 'image/webp' }],
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

  return (
    <main style={{ minHeight: '100svh', background: '#000', color: '#f1ead9', fontFamily: 'system-ui, sans-serif', padding: '24px 16px 120px', maxWidth: 560, margin: '0 auto' }}>
      <img src="/bmx/covers/terrornode-cover.webp" alt="WELCOME TO TERRORNODE" style={{ width: '100%', borderRadius: 14, display: 'block' }} />
      <h1 style={{ fontSize: 24, margin: '18px 0 2px' }}>WELCOME TO TERRORNODE</h1>
      <p style={{ margin: '0 0 16px', color: '#8a8a86' }}>NPGX · 12 tracks</p>
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
          a.src = `${A}/${TRACKS[next][1]}`
          void a.play().catch(() => setPlaying(false))
          setI(next)
        }}
        style={{ width: '100%' }}
      />
      <ol style={{ listStyle: 'none', padding: 0, margin: '16px 0 0' }}>
        {TRACKS.map(([t], n) => (
          <li key={n}>
            <button
              onClick={() => pick(n)}
              style={{ width: '100%', textAlign: 'left', padding: '14px 12px', border: 0, borderBottom: '1px solid #ffffff14', background: n === i ? '#2F7BFF22' : 'transparent', color: n === i ? '#7fb0ff' : '#f1ead9', fontSize: 16 }}
            >
              {String(n + 1).padStart(2, '0')}  {t}
            </button>
          </li>
        ))}
      </ol>
    </main>
  )
}
