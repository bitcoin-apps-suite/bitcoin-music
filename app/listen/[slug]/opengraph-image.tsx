import { albumByListenSlug } from '@/lib/bmx/albums'
import { albumOG } from '@/lib/bmx/og'

export const alt = 'Album on bMusicX'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Same card as /album/<slug>, with "bMusicX · Listen" on top. (/listen/terrornode keeps its own jpg card.)
export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  return albumOG(albumByListenSlug((await params).slug), 'bMusicX · Listen')
}
