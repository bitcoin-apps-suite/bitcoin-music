'use client'
import { memo, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import '@/app/store.css'
import '@/app/listen/listen.css'
import { artistBySlug, artistSlug, mmss, type ShelfAlbum } from '@/lib/bmx/albums'
import type { ListenTrack } from '@/lib/bmx/listen'
import { StoreFoot, StoreTop } from './Store'

// The /listen/<album> page and player (redesigned 10 Nov 2026), one template for every album.
// It plays exactly the `tracks` the page passes (lib/bmx/listen.ts, server-side): full files only for albums the owner
// has published in full, otherwise the same samples as the album page. `gate` is the slot for a pay/own step; pages pass
// one only when a working path is live (today: the bWalletX link for live albums).
//
// Audio: nothing loads until the first tap (iOS needs a tap anyway). Two audio elements: while the page is visible the
// next track is buffered in the spare one ~30s before the end and swapped in on "ended" (near-gapless). When the page is
// hidden (phone locked) the active element is re-pointed inside the "ended" event instead, which iOS keeps playing.

const SILENT = 'data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA=='
const PRELOAD_AT = 30 // seconds before the end of a track to start buffering the next one
const VOL_KEY = 'bmx:listen:vol'

type Props = { album: ShelfAlbum; tracks: ListenTrack[]; gate?: ReactNode }

const minutes = (s: number) => (s >= 3600 ? `${Math.floor(s / 3600)} hr ${Math.round((s % 3600) / 60)} min` : `${Math.round(s / 60)} min`)
const clock = (s: number) => (Number.isFinite(s) && s > 0 ? mmss(Math.floor(s)) : '0:00')
/** Track lengths round like the track list does, so 192.5s reads 3:13 in both places. */
const clockLen = (s: number) => (Number.isFinite(s) && s > 0 ? mmss(Math.round(s)) : '0:00')

/* Icons (inline, 24px grid) */
const I = {
  play: <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.05-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" /></svg>,
  pause: <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 4.5h3.2a.8.8 0 0 1 .8.8v13.4a.8.8 0 0 1-.8.8H7a.8.8 0 0 1-.8-.8V5.3a.8.8 0 0 1 .8-.8Zm6.8 0H17a.8.8 0 0 1 .8.8v13.4a.8.8 0 0 1-.8.8h-3.2a.8.8 0 0 1-.8-.8V5.3a.8.8 0 0 1 .8-.8Z" /></svg>,
  prev: <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 5a1 1 0 0 1 1 1v4.6l10.47-6.06A1 1 0 0 1 19 5.4v13.2a1 1 0 0 1-1.53.86L7 13.4V18a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Z" /></svg>,
  next: <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 5a1 1 0 0 0-1 1v4.6L6.53 4.54A1 1 0 0 0 5 5.4v13.2a1 1 0 0 0 1.53.86L17 13.4V18a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1Z" /></svg>,
  vol: <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 5.2v13.6a.8.8 0 0 1-1.33.6L5.9 16H3.8a.8.8 0 0 1-.8-.8V8.8a.8.8 0 0 1 .8-.8h2.1l3.77-3.4A.8.8 0 0 1 11 5.2Z" /><path d="M15 9a4.2 4.2 0 0 1 0 6M17.6 6.4a7.8 7.8 0 0 1 0 11.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  mute: <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 5.2v13.6a.8.8 0 0 1-1.33.6L5.9 16H3.8a.8.8 0 0 1-.8-.8V8.8a.8.8 0 0 1 .8-.8h2.1l3.77-3.4A.8.8 0 0 1 11 5.2Z" /><path d="m15.5 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  share: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
}

function Eq() {
  return <span className="lp-eq" aria-hidden="true"><i /><i /><i /></span>
}

/** The track list. Memoised so the time updates (4 a second) don't re-render it. */
const TrackList = memo(function TrackList({ tracks, cur, playing, onPick }: { tracks: ListenTrack[]; cur: number; playing: boolean; onPick: (n: number) => void }) {
  return (
    <ol className="lp-list" aria-label="Tracks">
      {tracks.map((t, n) => {
        const on = n === cur
        return (
          <li key={n}>
            <button
              type="button"
              className={on ? 'lp-row on' : 'lp-row'}
              aria-current={on ? 'true' : undefined}
              aria-label={`${on && playing ? 'Pause' : 'Play'} ${t.title}, ${mmss(t.seconds)}`}
              onClick={() => onPick(n)}
            >
              <span className="lp-n">
                {on && playing ? <Eq /> : <span className="lp-num">{n + 1}</span>}
                <span className="lp-hov" aria-hidden="true">{on && playing ? I.pause : I.play}</span>
              </span>
              <span className="lp-tt">
                <strong>{t.title}</strong>
                {(t.note || t.sampleSeconds) && (
                  <small>
                    {t.sampleSeconds ? <span className="lp-tag">{t.sampleSeconds}s preview</span> : null}
                    {t.note}
                  </small>
                )}
              </span>
              <span className="lp-td">{mmss(t.seconds)}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
})

export default function ListenPlayer({ album, tracks, gate }: Props) {
  const has = tracks.length > 0
  const els = useRef<HTMLAudioElement[]>([])
  const act = useRef(0) // which of the two elements is the live one
  const iRef = useRef(0)
  const spareFor = useRef<number | null>(null) // track index buffered in the spare element
  const unlocked = useRef(false)
  const panel = useRef<HTMLDivElement>(null)

  const [i, setI] = useState(0)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [time, setTime] = useState(0)
  const [dur, setDur] = useState(0)
  const [vol, setVol] = useState(1)
  const [muted, setMuted] = useState(false)
  const [mini, setMini] = useState(false)
  const [shareMsg, setShareMsg] = useState('')
  const [bgVideo, setBgVideo] = useState(false)

  const total = useMemo(() => album.tracks.reduce((n, t) => n + t.seconds, 0), [album.tracks])
  const samples = tracks.some((t) => t.sampleSeconds)
  const t = has ? tracks[i] : undefined
  const shownDur = dur || (t ? t.sampleSeconds ?? t.seconds : 0)
  const artistHref = artistBySlug(artistSlug(album.artist)) ? `/artist/${artistSlug(album.artist)}` : null

  const active = () => els.current[act.current]
  const spare = () => els.current[1 - act.current]

  const updateMeta = useCallback((n: number) => {
    if (!('mediaSession' in navigator) || !tracks[n]) return
    const art = new URL(album.cover, location.href).href
    const type = album.cover.endsWith('.jpg') ? 'image/jpeg' : album.cover.endsWith('.png') ? 'image/png' : 'image/webp'
    navigator.mediaSession.metadata = new MediaMetadata({
      title: tracks[n].title,
      artist: album.artist,
      album: album.title,
      artwork: [96, 256, 512].map((s) => ({ src: art, sizes: `${s}x${s}`, type })),
    })
  }, [album.artist, album.cover, album.title, tracks])

  /** Make track `n` current. `play` starts it; otherwise it is only selected. */
  const go = useCallback((n: number, play: boolean) => {
    if (!tracks[n]) return
    const a = active()
    iRef.current = n
    setI(n)
    setError(null)
    setTime(0)
    setDur(0)
    updateMeta(n)
    const s = spare()
    if (play && spareFor.current === n && s.readyState >= 3 && document.visibilityState === 'visible') {
      // Near-gapless: the next track is already buffered in the spare element.
      act.current = 1 - act.current
      spareFor.current = null
      s.volume = a.volume
      s.muted = a.muted
      s.currentTime = 0
      a.pause()
      s.play().catch(() => {
        // Spare element not allowed to play (some iOS versions): fall back to the main one.
        if (els.current[act.current] !== s) return
        act.current = 1 - act.current
        a.src = tracks[n].src
        a.play().catch(() => { setPlaying(false); setLoading(false) })
      })
      return
    }
    spareFor.current = null
    a.preload = play ? 'auto' : 'metadata'
    a.src = tracks[n].src
    if (play) {
      setLoading(true)
      a.play().catch((e: unknown) => {
        if ((e as DOMException)?.name !== 'AbortError') { setPlaying(false); setLoading(false) }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, updateMeta])

  /** First tap: unlock the spare element too (iOS wants a tap per element) by playing a silent clip in it. */
  const unlock = () => {
    if (unlocked.current) return
    unlocked.current = true
    const s = spare()
    s.src = SILENT
    s.play().then(() => s.pause()).catch(() => {})
  }

  const toggle = useCallback(() => {
    if (!has) return
    const a = active()
    if (!started) {
      unlock()
      setStarted(true)
      go(iRef.current, true)
      return
    }
    if (a.paused) {
      setLoading(a.readyState < 3)
      a.play().catch(() => { setPlaying(false); setLoading(false) })
    } else a.pause()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [has, started, go])

  const pick = useCallback((n: number) => {
    if (n === iRef.current && started) { toggle(); return }
    unlock()
    setStarted(true)
    go(n, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, toggle, go])

  const playingRef = useRef(false)
  playingRef.current = playing
  const next = useCallback(() => {
    const n = iRef.current + 1
    if (n < tracks.length) go(n, started && playingRef.current)
  }, [tracks.length, go, started])
  const prev = useCallback(() => {
    const a = active()
    if (started && a.currentTime > 3) { a.currentTime = 0; return }
    const n = iRef.current - 1
    if (n >= 0) go(n, started && playingRef.current)
    else if (started) a.currentTime = 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go, started])
  const seek = useCallback((s: number) => {
    const a = active()
    if (!started || !a || !Number.isFinite(a.duration)) return
    a.currentTime = Math.max(0, Math.min(a.duration - 0.25, s))
    setTime(a.currentTime)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started])

  // Create the two audio elements once, on the client. Nothing is fetched until the first play.
  useEffect(() => {
    if (!has) return
    const mk = () => { const a = new Audio(); a.preload = 'none'; return a }
    const list = [mk(), mk()]
    els.current = list
    let v = 1
    try { const sv = localStorage.getItem(VOL_KEY); if (sv !== null && sv !== '' && Number.isFinite(Number(sv))) v = Math.min(1, Math.max(0, Number(sv))) } catch { /* storage blocked: default volume */ }
    list.forEach((a) => { a.volume = v })
    setVol(v)

    const mine = (a: HTMLAudioElement) => a === list[act.current] && a.src !== SILENT
    const on = (a: HTMLAudioElement) => {
      const h: Record<string, () => void> = {
        play: () => { if (mine(a)) { setPlaying(true); setError(null) } },
        playing: () => { if (mine(a)) { setPlaying(true); setLoading(false) } },
        pause: () => { if (mine(a) && !a.ended) { setPlaying(false); setLoading(false) } },
        waiting: () => { if (mine(a) && !a.paused) setLoading(true) },
        canplay: () => { if (mine(a) && a.paused) setLoading(false) },
        loadedmetadata: () => { if (mine(a)) setDur(a.duration) },
        durationchange: () => { if (mine(a) && Number.isFinite(a.duration)) setDur(a.duration) },
        timeupdate: () => {
          if (!mine(a)) return
          setTime(a.currentTime)
          const d = a.duration
          if (Number.isFinite(d) && d > 0 && 'mediaSession' in navigator && navigator.mediaSession.setPositionState) {
            try { navigator.mediaSession.setPositionState({ duration: d, position: Math.min(a.currentTime, d), playbackRate: a.playbackRate }) } catch { /* older browsers */ }
          }
          // Buffer the next track in the spare element near the end.
          const n = iRef.current + 1
          if (Number.isFinite(d) && d - a.currentTime < PRELOAD_AT && n < tracks.length && spareFor.current !== n) {
            const s = list[1 - act.current]
            spareFor.current = n
            s.preload = 'auto'
            s.src = tracks[n].src
            s.load()
          }
        },
        ended: () => {
          if (!mine(a)) return
          const n = iRef.current + 1
          if (n >= tracks.length) {
            // End of the album: back to track 1, stopped.
            setPlaying(false)
            go(0, false)
            return
          }
          if (document.visibilityState !== 'visible') {
            // Locked phone / background tab: re-point this element inside "ended" so iOS keeps playing.
            iRef.current = n
            setI(n)
            setTime(0)
            setDur(0)
            updateMeta(n)
            spareFor.current = null
            a.src = tracks[n].src
            a.play().catch(() => setPlaying(false))
            return
          }
          go(n, true)
        },
        error: () => {
          if (!mine(a) || !a.getAttribute('src')) return
          setPlaying(false)
          setLoading(false)
          setError(navigator.onLine === false ? 'You look offline. Check your connection and try again.' : 'This track didn’t load.')
        },
      }
      Object.entries(h).forEach(([k, fn]) => a.addEventListener(k, fn))
      return () => Object.entries(h).forEach(([k, fn]) => a.removeEventListener(k, fn))
    }
    const offs = list.map(on)
    return () => {
      offs.forEach((off) => off())
      list.forEach((a) => { a.pause(); a.removeAttribute('src'); a.load() })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [has])

  // Lock screen / headphone controls.
  const h = useRef({ toggle, next, prev, seek })
  h.current = { toggle, next, prev, seek }
  useEffect(() => {
    if (!has || !('mediaSession' in navigator)) return
    const ms = navigator.mediaSession
    const set = (k: MediaSessionAction, fn: MediaSessionActionHandler | null) => { try { ms.setActionHandler(k, fn) } catch { /* action not supported here */ } }
    set('play', () => { if (active().paused) h.current.toggle() })
    set('pause', () => { if (!active().paused) h.current.toggle() })
    set('previoustrack', () => h.current.prev())
    set('nexttrack', () => h.current.next())
    set('seekto', (d) => { if (d.seekTime != null) h.current.seek(d.seekTime) })
    set('seekbackward', (d) => h.current.seek(active().currentTime - (d.seekOffset ?? 10)))
    set('seekforward', (d) => h.current.seek(active().currentTime + (d.seekOffset ?? 10)))
    return () => { (['play', 'pause', 'previoustrack', 'nexttrack', 'seekto', 'seekbackward', 'seekforward'] as MediaSessionAction[]).forEach((k) => set(k, null)) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [has])
  useEffect(() => {
    if ('mediaSession' in navigator && started) navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
  }, [playing, started])

  // Keyboard: Space/K play-pause, ←/→ seek 5s, Shift+←/→ previous/next track, M mute.
  useEffect(() => {
    if (!has) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return
      const el = e.target as HTMLElement | null
      const tag = el?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable) return
      const k = e.key
      if ((k === ' ' || k === 'Enter') && (tag === 'BUTTON' || tag === 'A')) return // the focused control handles it
      if (k === ' ' || k === 'k' || k === 'K') { e.preventDefault(); h.current.toggle() }
      else if (k === 'ArrowRight') { e.preventDefault(); if (e.shiftKey) h.current.next(); else h.current.seek(active().currentTime + 5) }
      else if (k === 'ArrowLeft') { e.preventDefault(); if (e.shiftKey) h.current.prev(); else h.current.seek(active().currentTime - 5) }
      else if (k === 'm' || k === 'M') setMuted((m) => !m)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [has])

  // Volume / mute apply to both elements; volume is remembered on this device.
  useEffect(() => {
    els.current.forEach((a) => { a.volume = vol; a.muted = muted })
  }, [vol, muted])
  const changeVol = (v: number) => {
    setVol(v)
    if (v > 0 && muted) setMuted(false)
    try { localStorage.setItem(VOL_KEY, String(v)) } catch { /* storage blocked: not remembered */ }
  }

  // Mini player: shown once something has played and the main player has scrolled out of view.
  useEffect(() => {
    const el = panel.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setMini(!e.isIntersecting), { rootMargin: '-64px 0px 0px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Album video behind the page: wide screens only, not for reduced motion or data saver (it is ~3 MB).
  useEffect(() => {
    if (!album.video) return
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (matchMedia('(min-width: 960px) and (prefers-reduced-motion: no-preference)').matches && !conn?.saveData) setBgVideo(true)
  }, [album.video])

  const share = async () => {
    const url = location.href.split('#')[0]
    try {
      if (navigator.share) { await navigator.share({ title: `${album.title} · ${album.artist}`, url }); return }
      await navigator.clipboard.writeText(url)
      setShareMsg('Link copied')
    } catch (e) {
      if ((e as DOMException)?.name === 'AbortError') return
      setShareMsg('Copy the address bar to share')
    }
    setTimeout(() => setShareMsg(''), 2400)
  }

  const retry = () => {
    const a = active()
    const at = time
    setError(null)
    setLoading(true)
    a.src = tracks[iRef.current].src
    a.currentTime = at
    a.play().catch(() => { setPlaying(false); setLoading(false) })
  }

  const top = useMemo(() => <StoreTop />, [])
  const foot = useMemo(() => <StoreFoot />, [])
  const pct = shownDur ? Math.min(100, (time / shownDur) * 100) : 0
  const showMini = has && started && mini
  const playLabel = playing ? 'Pause' : started && (time > 0 || i > 0) ? 'Resume' : 'Play album'
  const busy = loading && playing
  const ppIcon = busy ? <span className="lp-spin" aria-hidden="true" /> : playing ? I.pause : I.play

  return (
    <main className={`sx lp${showMini ? ' lp-mini-on' : ''}`} style={{ ['--lp-acc' as string]: album.accent ?? '#ffd24d' }}>
      <div className="lp-bg" aria-hidden="true">
        <img src={album.cover} alt="" />
        {bgVideo && album.video && (
          <video poster={album.video.poster} autoPlay muted loop playsInline preload="metadata">
            <source src={album.video.webm} type="video/webm" />
            <source src={album.video.mp4} type="video/mp4" />
          </video>
        )}
      </div>
      {top}

      <div className="sx-wrap lp-grid">
        <div className="lp-side">
          <div className="lp-art">
            <img src={album.cover} alt={`${album.title} cover`} width={1200} height={1200} />
          </div>

          {has ? (
            <div className="lp-panel" ref={panel} role="region" aria-label="Player">
              <div className="lp-now">
                <div className="lp-now-t">
                  <span className="lp-now-k">{started ? (playing ? 'Now playing' : 'Paused') : 'Up first'} · {i + 1} of {tracks.length}</span>
                  <strong title={t?.title}>{t?.title}</strong>
                </div>
                <button type="button" className="lp-icon lp-share" onClick={share} aria-label="Share this album">{I.share}</button>
              </div>

              <div className="lp-seek">
                <input
                  type="range"
                  className="lp-range"
                  min={0}
                  max={shownDur || 1}
                  step={0.1}
                  value={Math.min(time, shownDur || 1)}
                  onChange={(e) => seek(Number(e.target.value))}
                  disabled={!started}
                  aria-label="Seek"
                  aria-valuetext={`${clock(time)} of ${clockLen(shownDur)}`}
                  style={{ ['--p' as string]: `${pct}%` }}
                />
                <div className="lp-times"><span>{clock(time)}</span><span>{clockLen(shownDur)}</span></div>
              </div>

              <div className="lp-ctl">
                <span className="lp-ctl-l" aria-hidden="true" />
                <button type="button" className="lp-icon lp-skip" onClick={prev} aria-label="Previous track" disabled={!started && i === 0}>{I.prev}</button>
                <button type="button" className={`lp-pp${busy ? ' busy' : ''}`} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>{ppIcon}</button>
                <button type="button" className="lp-icon lp-skip" onClick={next} aria-label="Next track" disabled={i >= tracks.length - 1}>{I.next}</button>
                <span className="lp-vol">
                  <button type="button" className="lp-icon" onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Unmute' : 'Mute'}>
                    {muted || vol === 0 ? I.mute : I.vol}
                  </button>
                  <input
                    type="range"
                    className="lp-range lp-range-vol"
                    min={0}
                    max={1}
                    step={0.01}
                    value={muted ? 0 : vol}
                    onChange={(e) => changeVol(Number(e.target.value))}
                    aria-label="Volume"
                    style={{ ['--p' as string]: `${(muted ? 0 : vol) * 100}%` }}
                  />
                </span>
              </div>

              <p className="lp-msg" role="status" aria-live="polite">{error ? '' : busy ? 'Loading…' : shareMsg}</p>
              {error && (
                <div className="lp-err" role="alert">
                  <span>{error}</span>
                  <button type="button" onClick={retry}>Try again</button>
                  {i < tracks.length - 1 && <button type="button" onClick={() => go(i + 1, true)}>Skip</button>}
                </div>
              )}
              <p className="lp-keys"><kbd>Space</kbd> play/pause · <kbd>←</kbd><kbd>→</kbd> seek · <kbd>Shift</kbd>+<kbd>←</kbd><kbd>→</kbd> track · <kbd>M</kbd> mute</p>
            </div>
          ) : null}
        </div>

        <div className="lp-main">
          <header className="lp-head">
            <p className="sx-kicker">Album · {album.genre}</p>
            <h1 className="lp-title">
              {album.titleImg ? (
                <>
                  <img className="lp-wmark" src={album.titleImg} alt="" />
                  <span className="lp-title-t">{album.title}</span>
                </>
              ) : album.title}
            </h1>
            {album.titleSub && <p className="lp-sub">{album.titleSub}</p>}
            <p className="lp-meta">
              {artistHref ? <a href={artistHref}>{album.artist}</a> : <b>{album.artist}</b>}
              <span>{album.tracks.length} {album.tracks.length === 1 ? 'track' : 'tracks'}</span>
              <span>{minutes(total)}</span>
              {samples && <span>Previews</span>}
            </p>
            <p className="lp-line">{album.line}</p>

            <div className="lp-actions">
              {has && (
                <button type="button" className="sx-btn sx-gold lp-play" onClick={toggle}>
                  <span className="lp-play-i">{ppIcon}</span>{playLabel}
                </button>
              )}
              {gate}
              <span className="lp-soon">
                Buy the album{album.price ? ` · ${album.price}` : ''}
                <small>coming soon</small>
              </span>
              {!has && <button type="button" className="lp-icon lp-share" onClick={share} aria-label="Share this album">{I.share}</button>}
            </div>
            {!has && shareMsg && <p className="lp-msg" role="status">{shareMsg}</p>}
          </header>

          {has ? (
            <TrackList tracks={tracks} cur={i} playing={playing} onPick={pick} />
          ) : (
            <ol className="lp-list" aria-label="Tracks">
              {album.tracks.map((tr) => {
                const inner = (
                  <>
                    <span className="lp-n"><span className="lp-num">{tr.n}</span></span>
                    <span className="lp-tt"><strong>{tr.title}</strong></span>
                    <span className="lp-td">{mmss(tr.seconds)}</span>
                  </>
                )
                return <li key={tr.n}>{album.listenUrl ? <a className="lp-row" href={album.listenUrl}>{inner}</a> : <div className="lp-row">{inner}</div>}</li>
              })}
            </ol>
          )}

          <section className="lp-card" aria-labelledby="lp-status-h">
            <h2 id="lp-status-h">Listening on bMusicX</h2>
            <ul className="sx-check">
              {album.live
                ? <li className="ok">Listen in bWalletX</li>
                : <li className={has ? 'ok' : ''}>{samples ? 'Free previews of every track' : 'Free to listen: the whole album, no sign-in'}</li>}
              <li>Buy the album{album.price ? ` for ${album.price}` : ''}: coming soon</li>
              <li>Pay the artist as you listen, about 1p an hour: coming soon</li>
            </ul>
          </section>

          {album.credits && (
            <section className="lp-card" aria-labelledby="lp-credits-h">
              <h2 id="lp-credits-h">Credits</h2>
              {album.credits.map((c) => <p key={c}>{c}</p>)}
            </section>
          )}
          <p className="lp-back"><a href={`/album/${album.slug}`}>Album page</a><span aria-hidden="true">·</span><a href="/listen">More to listen to</a></p>
        </div>
      </div>
      {foot}

      {has && (
        <div className={`lp-mini${showMini ? ' show' : ''}`} aria-hidden={!showMini}>
          <span className="lp-mini-bar" style={{ transform: `scaleX(${pct / 100})` }} />
          <button type="button" className="lp-mini-info" onClick={() => panel.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })} aria-label={`Show the player: ${t?.title ?? ''}`}>
            <img src={album.cover} alt="" />
            <span className="lp-mini-t"><strong>{t?.title}</strong><span>{album.artist} · {clock(time)} / {clockLen(shownDur)}</span></span>
          </button>
          <button type="button" className="lp-icon lp-mini-pp" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>{ppIcon}</button>
          <button type="button" className="lp-icon" onClick={next} aria-label="Next track" disabled={i >= tracks.length - 1}>{I.next}</button>
        </div>
      )}
    </main>
  )
}
