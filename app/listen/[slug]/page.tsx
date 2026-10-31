import { notFound, redirect } from 'next/navigation'
import { SHELF } from '@/lib/bmx/albums'

// /listen/<album slug>: full-album pages live at short paths (e.g. /listen/terrornode); anything else opens its album page.
const FULL: Record<string, string> = { 'welcome-to-terrornode': '/listen/terrornode' }

export default async function ListenSlug({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (FULL[slug]) redirect(FULL[slug])
  if (SHELF.some((a) => a.slug === slug)) redirect(`/album/${slug}`)
  notFound()
}
