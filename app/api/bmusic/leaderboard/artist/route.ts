import { NextResponse } from 'next/server'
import { getOne } from '@/lib/bmusic/db'
import { albumStats, ARTIST_AUTH_PROTOCOL, fanScore, potDrain, publicEntry, verifyWalletSig } from '@/lib/bmusic/listeners'

export const dynamic = 'force-dynamic'

/**
 * Artist view: every listener (anonymous ones by a short session tag, never the full key), with pot-drain flags.
 * GET ?albumId&window&identityKey&ts&sig. sig = artist wallet createSignature({ protocolID: [2,'bmusic artist auth'],
 * keyID: String(ts), counterparty: 'anyone', data: utf8("board:<albumId>:<ts>") }). The identity must be the
 * artist on that album's tracks.
 */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams
  const albumId = q.get('albumId') ?? ''
  const identityKey = q.get('identityKey') ?? ''
  const ts = Number(q.get('ts'))
  if (!(await verifyWalletSig(identityKey, ARTIST_AUTH_PROTOCOL, String(ts), `board:${albumId}:${ts}`, q.get('sig') ?? '', ts)))
    return NextResponse.json({ error: 'bad signature' }, { status: 401 })
  const track = await getOne<{ artist_identity: string }>('bmusic_streams', 'album_id', albumId, 'artist_identity')
  if (track?.artist_identity !== identityKey) return NextResponse.json({ error: 'not the artist of this album' }, { status: 403 })

  const { rows, badges } = await albumStats(albumId, q.get('window') ?? 'all')
  const ranked = [...rows].sort((a, b) => fanScore(b) - fanScore(a))
  const claimedOrder = ranked.filter((r) => r.claimed)
  return NextResponse.json({
    albumId,
    listeners: ranked.map((r, i) => ({
      ...publicEntry(r, i, r.claimed ? badges(r, claimedOrder.indexOf(r)) : []),
      identityKey: r.claimed ? r.listener : null,
      anonTag: r.claimed ? null : r.listener.slice(-8),
      potDrain: potDrain(r),
      firstAt: r.first_at, lastAt: r.last_at,
    })),
  })
}

export function OPTIONS() {
  return new Response(null, { status: 204 })
}
