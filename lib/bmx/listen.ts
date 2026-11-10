import type { ShelfAlbum } from '@/lib/bmx/albums'

// What each /listen/<album> page plays. Server-side only (pages pass the result to the player as props),
// so full-file paths are not bundled into the store's client JS. This is the seam for any future
// pay-to-stream / owner-key gating: change what this returns, not the player.

/**
 * Full-length files, one per track in order. An access decision, not a default: only TERRORNODE has them
 * (the owner published the whole album on 31 Oct 2026). Every other album's /listen page plays the same
 * samples as its album page. Do not add entries without the owner's sign-off.
 */
const FULL: Record<string, string[]> = {
  'welcome-to-terrornode': ['01.m4a', '02.m4a', '03.m4a', '04.m4a', '05.mp3', '06.mp3', '07.mp3', '08.mp3', '09.m4a', '10.mp3', '11.mp3', '12.m4a'].map((f) => `/bmx/listen/terrornode/${f}`),
}

/** `seconds` is the full track length (what the track list shows); `sampleSeconds` is set when only a clip plays. */
export type ListenTrack = { title: string; src: string; seconds: number; note?: string; sampleSeconds?: number }

export const hasFull = (a: ShelfAlbum) => !!FULL[a.slug]

/** The album's full files if it has them, otherwise its samples; none for live (bWalletX) albums. */
export function listenTracks(a: ShelfAlbum): ListenTrack[] {
  const full = FULL[a.slug]
  if (full) return a.tracks.flatMap((t, i) => (full[i] ? [{ title: t.title, src: full[i], seconds: t.seconds, note: t.note }] : []))
  if (a.live) return []
  return a.tracks.flatMap((t) => (t.src ? [{ title: t.title, src: t.src, seconds: t.seconds, note: t.note, sampleSeconds: t.sampleSeconds }] : []))
}
