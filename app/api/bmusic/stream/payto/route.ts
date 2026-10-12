import { NextResponse } from 'next/server'
import { getOne } from '@/lib/bmusic/db'
import { streamPayTo, type StreamRow } from '@/lib/bmusic/server'

export const dynamic = 'force-dynamic'

/** GET ?trackId&segment → the output that pays for that second (BRC-29 to the artist, or their plain address). */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams
  const trackId = q.get('trackId') ?? ''
  const n = Number(q.get('segment'))
  const s = await getOne<StreamRow>('bmusic_streams', 'track_id', trackId)
  if (!s) return NextResponse.json({ error: 'unknown track' }, { status: 404 })
  if (!Number.isInteger(n) || n < 0 || n >= s.segments) return NextResponse.json({ error: 'no such segment' }, { status: 404 })
  return NextResponse.json(await streamPayTo(s, n))
}

export function OPTIONS() {
  return new Response(null, { status: 204 })
}
