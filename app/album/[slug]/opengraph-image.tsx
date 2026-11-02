import { albumBySlug } from '@/lib/bmx/albums'
import { albumOG, cardAlt } from '@/lib/bmx/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// One card per album; generateImageMetadata gives it a true, per-album alt text (og:image:alt).
export async function generateImageMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  return [{ id: 'card', alt: cardAlt(albumBySlug((await params).slug)), size, contentType }]
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  return albumOG(albumBySlug(slug), { kind: 'album', path: `/album/${slug}` })
}
