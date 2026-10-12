import { NextResponse } from 'next/server'
import { albumStats, publicEntry } from '@/lib/bmusic/listeners'

export const dynamic = 'force-dynamic'

/** GET ?albumId&window=all|30d|7d → opted-in listeners ranked by fan score; anonymous listening as totals only. */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams
  const albumId = q.get('albumId') ?? ''
  const window = q.get('window') ?? 'all'
  const { claimed, badges, anonCount, anonSeconds } = await albumStats(albumId, window)
  return NextResponse.json({ albumId, window, listeners: claimed.slice(0, 100).map((r, i) => publicEntry(r, i, badges(r, i))), anonCount, anonSeconds })
}

export function OPTIONS() {
  return new Response(null, { status: 204 })
}
