import { NextResponse } from 'next/server'
import { albumStats, publicEntry } from '@/lib/bmusic/listeners'

export const dynamic = 'force-dynamic'

/** GET /api/bmusic/listener/<identityKey>?albumId → that listener's stats and badges (only if they opted in). */
export async function GET(request: Request, { params }: { params: Promise<{ identityKey: string }> }) {
  const { identityKey } = await params
  const albumId = new URL(request.url).searchParams.get('albumId') ?? ''
  const { claimed, badges } = await albumStats(albumId, 'all')
  const i = claimed.findIndex((r) => r.listener === identityKey)
  if (i < 0) return NextResponse.json({ error: 'no public listening for this identity' }, { status: 404 })
  return NextResponse.json(publicEntry(claimed[i], i, badges(claimed[i], i)))
}

export function OPTIONS() {
  return new Response(null, { status: 204 })
}
