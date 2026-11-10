import type { ShelfAlbum } from '@/lib/bmx/albums'

// What each /listen/<album> page plays to everyone: PREVIEWS ONLY (owner, 10 Nov 2026: "users shouldn't be able to listen
// to full albums and tracks for free, even Terrornode. They can listen to samples").
//
// Full tracks are never in public/ and never in a page's props. A buyer's full tracks come from the listen-rights API
// (lib/listen/*, docs/LISTEN-RIGHTS-API.md): the server checks their right to listen and hands back short-lived signed
// links to masters held in private storage. Do not add full-file paths here.

/** `seconds` is the full track length (what the track list shows); `sampleSeconds` is the preview clip length. */
export type ListenTrack = { title: string; src: string; seconds: number; note?: string; sampleSeconds?: number; n?: number }

/** The album's previews (45s clips, 20s for short tracks). Live (bWalletX) albums have none. */
export function listenTracks(a: ShelfAlbum): ListenTrack[] {
  return a.tracks.flatMap((t) => (t.src ? [{ n: t.n, title: t.title, src: t.src, seconds: t.seconds, note: t.note, sampleSeconds: t.sampleSeconds }] : []))
}
