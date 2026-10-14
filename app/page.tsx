import type { Metadata } from 'next'
import first12 from '@/public/bmusic/streams/first-12/manifest.json'
import fourTon from '@/public/bmusic/streams/four-ton-shadow-video/manifest.json'
import Exchange, { type Album } from '@/components/bmx/Exchange'
import './bmx.css'

export const metadata: Metadata = { alternates: { canonical: 'https://bmusicx.com' } }

type Manifest = { albumId: string; title: string; artist: string; cover?: string; satsPerSegment: number; tracks: { n: number; trackId: string; title: string; segments: number; durations?: number[]; kind?: string }[] }

const LISTEN: Record<string, string> = {
  'first-12': 'https://desktop.bwalletx.com/bmusic/artist/vexvoid/album/echoes-in-the-abyss',
}

function toAlbum(m: Manifest): Album {
  return {
    albumId: m.albumId, title: m.title, artist: m.artist, satsPerSegment: m.satsPerSegment,
    cover: `/bmusic/streams/${m.albumId}/${m.cover ?? 'cover.jpg'}`,
    listenUrl: LISTEN[m.albumId] ?? 'https://desktop.bwalletx.com/bmusic',
    tracks: m.tracks.map((t) => ({
      n: t.n, trackId: t.trackId, title: t.title, kind: t.kind === 'video' ? 'video' : 'audio',
      seconds: Math.round(t.durations ? t.durations.reduce((a, b) => a + b, 0) : t.segments),
    })),
  }
}

export default function HomePage() {
  return <Exchange albums={[toAlbum(first12 as Manifest), toAlbum(fourTon as Manifest)]} />
}
