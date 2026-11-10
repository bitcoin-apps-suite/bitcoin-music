import type { Metadata } from 'next'
import ListenPlayer from '@/components/bmx/ListenPlayer'
import { TERRORNODE } from '@/lib/bmx/albums'
import { listenTracks } from '@/lib/bmx/listen'

// WELCOME TO TERRORNODE's listen page. Previews for everyone; full tracks only with a right to listen (owner, 10 Nov 2026:
// "even Terrornode"). Unlisted and noindex; not linked from the store. Same template as every /listen/<album> page; this folder exists
// for the hand-made share card (opengraph-image.jpg).
export const metadata: Metadata = {
  title: 'Listen · WELCOME TO TERRORNODE',
  description: 'WELCOME TO TERRORNODE by NPGX. 12 tracks, 33 minutes. Free previews on bMusicX.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://bmusicx.com/listen/terrornode' },
  openGraph: {
    title: 'WELCOME TO TERRORNODE · NPGX',
    description: 'NPGX · 12 tracks · 33 minutes. Free previews on bMusicX.',
    url: 'https://bmusicx.com/listen/terrornode',
    images: [{ url: 'https://bmusicx.com/bmx/og/listen-terrornode.jpg', width: 1200, height: 630, alt: 'WELCOME TO TERRORNODE by NPGX on bMusicX' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WELCOME TO TERRORNODE · NPGX',
    description: 'NPGX · 12 tracks · 33 minutes. Free previews on bMusicX.',
    images: ['https://bmusicx.com/bmx/og/listen-terrornode.jpg'],
  },
}

export default function ListenPage() {
  return <ListenPlayer album={TERRORNODE} tracks={listenTracks(TERRORNODE)} />
}
