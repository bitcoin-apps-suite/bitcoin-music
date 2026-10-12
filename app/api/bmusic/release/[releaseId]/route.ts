import { NextResponse } from 'next/server'
import { getOne } from '@/lib/bmusic/db'
import { mintPayTo, RELEASE_CONTENT_TYPE, releaseRecord, type Release } from '@/lib/bmusic/release'
import type { StreamRow } from '@/lib/bmusic/server'

export const dynamic = 'force-dynamic'

/**
 * GET → a release's mint offer: price, whether it's minted, and (if for sale) exactly what to inscribe and pay.
 * To mint: one transaction with output A = 1 sat to the buyer, a 1Sat inscription of `inscribe.content`
 * (contentType `inscribe.contentType`), and output B = `payTo` (≥ price). Then POST …/mint.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ releaseId: string }> }) {
  const { releaseId } = await params
  const s = await getOne<StreamRow & { title: string; kind: string }>('bmusic_streams', 'track_id', releaseId)
  const r = await getOne<Release>('bmusic_releases', 'release_id', releaseId)
  if (!s || !r) return NextResponse.json({ error: 'unknown release' }, { status: 404 })
  const kind = s.kind === 'video' ? 'video' : 'audio'
  const base = { releaseId, title: s.title, kind, payee: r.payee_mode, mintPriceSats: r.mint_price_sats }
  if (r.minted_origin) return NextResponse.json({ ...base, minted: { origin: r.minted_origin, at: r.minted_at } })
  if (r.mint_price_sats === null) return NextResponse.json({ ...base, minted: null, forSale: false })
  const reserved = r.reserved_until && Date.parse(r.reserved_until) > Date.now()
  return NextResponse.json({
    ...base,
    minted: null,
    forSale: true,
    reserved: !!reserved,
    inscribe: { contentType: RELEASE_CONTENT_TYPE, content: JSON.stringify(releaseRecord(s, r, kind)), map: { app: 'bmusic', type: 'release', releaseId, name: s.title } },
    payTo: await mintPayTo(s, r.mint_price_sats),
  })
}

export function OPTIONS() {
  return new Response(null, { status: 204 })
}
