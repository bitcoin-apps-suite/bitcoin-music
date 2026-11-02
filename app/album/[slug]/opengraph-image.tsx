import { albumBySlug } from '@/lib/bmx/albums'
import { albumOG } from '@/lib/bmx/og'

export const alt = 'Album on bMusicX'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  return albumOG(albumBySlug((await params).slug))
}
