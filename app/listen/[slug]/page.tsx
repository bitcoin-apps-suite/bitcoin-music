import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { SHELF, albumByListenSlug, albumBySlug, listenPath, listenSlugOf, type ShelfAlbum } from '@/lib/bmx/albums'
import ListenPlayer from '@/components/bmx/ListenPlayer'
import { listenTracks } from '@/lib/bmx/listen'

// /listen/<album>: one page per album from the shelf data, same template as /listen/terrornode.
// /listen/terrornode has its own folder (its hand-made share card); /listen/welcome-to-terrornode redirects there.
// Unlisted and noindex, like /listen/terrornode.
export function generateStaticParams() {
  return SHELF.filter((a) => !a.listenSlug).map((a) => ({ slug: listenSlugOf(a) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = albumByListenSlug((await params).slug)
  if (!a) return {}
  const title = `${a.title} · ${a.artist}`
  const url = `https://bmusicx.com${listenPath(a)}`
  return {
    title: `Listen · ${a.title}`,
    description: a.line,
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: { title, description: a.line, url },
    twitter: { card: 'summary_large_image', title, description: a.line },
  }
}

/** Live albums: the existing bWalletX link and the album's own live note (paid listening is paused, 2 Nov 2026). */
function LiveGate({ a }: { a: ShelfAlbum }) {
  if (!a.live || !a.listenUrl) return null
  return (
    <div style={{ marginBottom: 8 }}>
      <a href={a.listenUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 999, background: 'linear-gradient(135deg,#ffe58a,#ffd24d 55%,#c98f00)', color: '#000', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
        &#9654; Listen in bWalletX
      </a>
      {a.liveNote && <p style={{ margin: '10px 0 0', color: '#d8d2c2', fontSize: 15 }}>{a.liveNote}</p>}
    </div>
  )
}

export default async function ListenSlug({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const a = albumByListenSlug(slug)
  if (!a) {
    const byAlbum = albumBySlug(slug)
    if (byAlbum) redirect(listenPath(byAlbum))
    notFound()
  }
  return <ListenPlayer album={a} tracks={listenTracks(a)} gate={<LiveGate a={a} />} />
}
