import { albumByListenSlug, listenPath } from '@/lib/bmx/albums'
import { hasFull } from '@/lib/bmx/listen'
import { albumOG, cardAlt } from '@/lib/bmx/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Same card as /album/<slug>, with the listen URL. (/listen/terrornode keeps its hand-made jpg card.)
export async function generateImageMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  return [{ id: 'card', alt: cardAlt(albumByListenSlug((await params).slug)), size, contentType }]
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const a = albumByListenSlug((await params).slug)
  return albumOG(a, { kind: 'listen', path: a ? listenPath(a) : '/listen', full: a ? hasFull(a) : false })
}
