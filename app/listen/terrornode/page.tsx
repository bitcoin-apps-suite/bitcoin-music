import type { Metadata } from 'next'
import ListenPlayer from './ListenPlayer'

// Owner's private listening page (31 Oct 2026): the whole WELCOME TO TERRORNODE album, full tracks, for the phone.
// Unlisted and noindex; not linked from the store.
export const metadata: Metadata = {
  title: 'Listen · WELCOME TO TERRORNODE',
  description: 'The full WELCOME TO TERRORNODE album by NPGX. 12 tracks, 33 minutes. Listen now on bMusicX.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'WELCOME TO TERRORNODE · the full album',
    description: 'NPGX · 12 tracks · 33 minutes. Listen now on bMusicX.',
    url: 'https://bmusicx.com/listen/terrornode',
    images: [{ url: 'https://bmusicx.com/bmx/og/listen-terrornode.jpg', width: 1200, height: 630, alt: 'WELCOME TO TERRORNODE, the full album on bMusicX' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WELCOME TO TERRORNODE · the full album',
    description: 'NPGX · 12 tracks · 33 minutes. Listen now on bMusicX.',
    images: ['https://bmusicx.com/bmx/og/listen-terrornode.jpg'],
  },
}

export default function ListenPage() {
  return <ListenPlayer />
}
