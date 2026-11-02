import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { ShelfAlbum } from '@/lib/bmx/albums'

export const OG_SIZE = { width: 1200, height: 630 }

/*
 * The album share card (1200×630), generalised from the hand-made /listen/terrornode card (owner: "really good").
 * Left: bMusicX mark, eyebrow in the album's accent, title (title art where the release has it), meta line,
 * gold "Listen now" pill, the page URL. Right: the cover with a gold border and a round label disc on its corner.
 * Background: the cover, blurred, darkened and tinted with the accent, with scanlines.
 *
 * Assets (all local, read at request time, nothing fetched from the network):
 * - public/bmx/og/<slug>.jpg: a 600×600 jpg of the cover (Satori cannot decode webp). Without it the card has no art.
 * - optional label disc: public/bmx/og/terrornode-disc.jpg for the TERRORNODE releases, the NPGX mark for NPGX;
 *   otherwise a circular crop of the cover.
 * - assets/fonts/SpaceGrotesk-*.woff (the site's display face; SIL OFL, see assets/fonts/OFL.txt).
 */

const ROOT = process.cwd()
const file = (...p: string[]) => readFile(path.join(ROOT, ...p))
const dataUri = async (mime: string, ...p: string[]) => {
  try { return `data:${mime};base64,${(await file(...p)).toString('base64')}` } catch { return null }
}

let fonts: Promise<{ name: string; data: Buffer; weight: 500 | 700; style: 'normal' }[]> | null = null
const loadFonts = () =>
  (fonts ??= Promise.all([
    file('assets/fonts/SpaceGrotesk-500.woff').then((data) => ({ name: 'Space Grotesk', data, weight: 500 as const, style: 'normal' as const })),
    file('assets/fonts/SpaceGrotesk-700.woff').then((data) => ({ name: 'Space Grotesk', data, weight: 700 as const, style: 'normal' as const })),
  ]).catch(() => [])) // cards are prerendered at build; if the fonts are ever missing at runtime, fall back to the built-in font

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

/** "Album" / "EP" / "Single", from the data (track count, or EP in the title). */
export const releaseKind = (a: ShelfAlbum) => (a.tracks.length === 1 ? 'Single' : /\bEP\b/.test(a.title) ? 'EP' : 'Album')

/** Keeps a short last word ("B)", "EP") on the line before it, so a title never ends on an orphan. */
export const titleText = (t: string) => t.replace(/ (\S{1,3})$/, '\u00a0$1')

/** Largest title size (px) that fits `width` in at most 3 lines (Space Grotesk Bold: ~0.62em a character, worst case). */
function titleSize(title: string, width: number) {
  const words = title.split(/ /)
  for (const size of [88, 80, 72, 64, 58, 52, 46]) {
    const per = width / (size * 0.62)
    let lines = 1
    let len = 0
    let ok = true
    for (const w of words) {
      if (w.length > per) { ok = false; break }
      if (len && len + 1 + w.length > per) { lines++; len = w.length } else len += (len ? 1 : 0) + w.length
    }
    if (ok && lines <= 3) return size
  }
  return 44
}

/** og:image:alt: what the card shows. */
export const cardAlt = (a: ShelfAlbum | undefined) =>
  a ? `${a.title} by ${a.artist}: ${releaseKind(a) === 'EP' ? 'EP' : releaseKind(a).toLowerCase()} cover and title on bMusicX` : 'bMusicX'

export type CardPage = { kind: 'album' | 'listen'; path: string; full?: boolean }

export async function albumOG(a: ShelfAlbum | undefined, page: CardPage) {
  const [fontData, cover, titleArt, disc] = await Promise.all([
    loadFonts(),
    a ? dataUri('image/jpeg', 'public/bmx/og', `${a.slug}.jpg`) : null,
    a?.titleImg ? dataUri('image/svg+xml', 'public', a.titleImg) : null,
    !a ? null
      : a.titleImg === '/bmx/titles/terrornode.svg' ? dataUri('image/jpeg', 'public/bmx/og/terrornode-disc.jpg')
      : a.artist === 'NPGX' ? dataUri('image/png', 'public/bmx/npgx-logo.png')
      : null,
  ])
  const accent = a?.accent ?? '#ffd24d'
  const title = a?.title ?? 'bMusicX'
  const kind = a ? releaseKind(a) : 'Album'
  const secs = a ? a.tracks.reduce((n, t) => n + (t.seconds || 0), 0) : 0
  const mins = secs >= 60 ? Math.round(secs / 60) : 0
  const meta = a ? [a.artist, `${a.tracks.length} ${a.tracks.length === 1 ? 'track' : 'tracks'}`, mins ? `${mins} ${mins === 1 ? 'minute' : 'minutes'}` : null].filter(Boolean).join(' · ') : ''
  const eyebrow = !a ? 'MUSIC ON BITCOIN'
    : a.live ? `${kind.toUpperCase()} · LISTEN IN bWALLETX` // paid listening paused (2 Nov 2026): no pay wording
    : page.full ? 'THE FULL ALBUM · NOW PLAYING'
    : `${a.featured ? 'NEW ' : ''}${kind.toUpperCase()} · ${a.tracks.length === 1 ? 'PREVIEW' : 'PREVIEWS'}`
  const size = titleSize(titleText(title), 500)
  const npgxDisc = a?.artist === 'NPGX' && a.titleImg !== '/bmx/titles/terrornode.svg'

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#050507', fontFamily: 'Space Grotesk', color: '#f4f1e8' }}>
        {/* background: the cover, blurred, darkened, tinted, scanlined */}
        {cover && <img src={cover} width={1300} height={1300} style={{ position: 'absolute', left: -50, top: -335, filter: 'blur(12px)', opacity: 0.75 }} />}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 630, display: 'flex', background: 'linear-gradient(90deg, rgba(3,3,5,.95) 0%, rgba(3,3,5,.9) 46%, rgba(3,3,5,.7) 100%)' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 630, display: 'flex', background: rgba(accent, 0.1) }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 630, display: 'flex', background: `radial-gradient(circle at 30% 62%, ${rgba(accent, 0.2)} 0%, ${rgba(accent, 0)} 55%)` }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 630, display: 'flex', background: `radial-gradient(circle at 92% 100%, ${rgba(accent, 0.34)} 0%, ${rgba(accent, 0)} 40%)` }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 630, display: 'flex', background: 'radial-gradient(circle at 6% 4%, rgba(0,0,0,.9) 0%, rgba(0,0,0,0) 28%)' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1200, height: 630, display: 'flex', backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.34) 0px, rgba(0,0,0,.34) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)' }} />

        {/* left column */}
        <div style={{ position: 'absolute', left: 64, top: 58, bottom: 40, width: 540, display: 'flex', flexDirection: 'column' }}>
          {/* bMusicX mark: gold b, white "Music", blue X (wordmark option 1, owner 31 Oct 2026) */}
          <div style={{ display: 'flex', alignItems: 'center', height: 40 }}>
            <svg width="26" height="35" viewBox="23 8 74 100"><path fill="#F5B800" d="M45 12V72H27V30Z M27 72a33 33 0 1 1 66 0a33 33 0 1 1-66 0Z M45 72a15 15 0 1 0 30 0a15 15 0 1 0-30 0Z" /></svg>
            <div style={{ display: 'flex', marginLeft: 10, fontSize: 30, fontWeight: 700, letterSpacing: -0.6, color: '#fff' }}>Music<span style={{ color: '#2F7BFF' }}>X</span></div>
          </div>
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', fontSize: 19, fontWeight: 700, letterSpacing: 4.2, color: accent }}>{eyebrow}</div>
            {titleArt
              ? <div style={{ display: 'flex', flexDirection: 'column', marginTop: 18 }}>
                  <img src={titleArt} width={540} height={150} />
                  {a?.titleSub && <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, letterSpacing: 9, color: '#ffffff', marginTop: 12, textTransform: 'uppercase' }}>{a.titleSub}</div>}
                </div>
              : <div style={{ display: 'flex', maxWidth: 520, marginTop: 14, fontSize: size, fontWeight: 700, lineHeight: 1.02, letterSpacing: -size * 0.03, color: '#ffffff' }}>{titleText(title)}</div>}
            <div style={{ display: 'flex', marginTop: 24, fontSize: 24, fontWeight: 500, color: '#f1ead9' }}>{meta}</div>
            <div style={{ display: 'flex', marginTop: 34 }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '18px 34px 18px 30px', borderRadius: 999, background: 'linear-gradient(180deg, #ffe27a 0%, #ffcc33 55%, #f0aa00 100%)', boxShadow: '0 10px 30px rgba(255,190,0,.28)', color: '#0b0b0b', fontSize: 27, fontWeight: 700 }}>
                <svg width="22" height="24" viewBox="0 0 22 24" style={{ marginRight: 14 }}><path d="M2 1.5L20.5 12L2 22.5Z" fill="#0b0b0b" /></svg>
                Listen now
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 20, fontWeight: 500, color: '#cfc9bc' }}>bmusicx.com{page.path}</div>
        </div>

        {/* right: cover with gold border, label disc on its corner */}
        {cover && (
          <div style={{ position: 'absolute', left: 622, top: 52, width: 526, height: 526, display: 'flex', borderRadius: 20, border: '3px solid #d9a92c', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,.6)' }}>
            <img src={cover} width={520} height={520} />
          </div>
        )}
        {cover && (
          <div style={{ position: 'absolute', left: 1016, top: 440, width: 158, height: 158, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: '#000', border: '5px solid #f4f1e8', boxShadow: '0 12px 30px rgba(0,0,0,.6)', overflow: 'hidden' }}>
            {disc && !npgxDisc
              ? <img src={disc} width={148} height={148} style={{ borderRadius: 999 }} />
              : disc && npgxDisc
                ? <img src={disc} width={112} height={85} />
                : <div style={{ display: 'flex', width: 120, height: 120, borderRadius: 999, overflow: 'hidden', border: `3px solid ${accent}` }}><img src={cover} width={200} height={200} style={{ marginLeft: -40, marginTop: -40 }} /></div>}
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts: fontData },
  )
}
