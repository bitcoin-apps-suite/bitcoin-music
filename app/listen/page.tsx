import type { Metadata } from 'next'
import ListenPlayer from './ListenPlayer'

// Owner's private listening page (31 Oct 2026): the whole WELCOME TO TERRORNODE album, full tracks, for the phone.
// Unlisted and noindex; not linked from the store.
export const metadata: Metadata = {
  title: 'Listen · WELCOME TO TERRORNODE',
  robots: { index: false, follow: false },
}

export default function ListenPage() {
  return <ListenPlayer />
}
