import { NextResponse } from 'next/server'
import { PublicKey, Signature, Utils } from '@bsv/sdk'

export const dynamic = 'force-dynamic'

/**
 * Artist income feed for internalizeAction ('wallet payment').
 * GET ?identityKey&since=<ISO>&ts=<ms>&sig=<DER hex of identityKey.sign(utf8 "bmusic income:<since>:<ts>")>
 * ts must be within 5 minutes. Returns paid seconds on tracks whose artist_identity = identityKey, after `since`.
 */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams
  const identityKey = q.get('identityKey') ?? ''
  const since = q.get('since') ?? '1970-01-01T00:00:00Z'
  const ts = Number(q.get('ts'))
  const sig = q.get('sig') ?? ''
  if (!/^0[23][0-9a-f]{64}$/i.test(identityKey) || !Number.isFinite(ts) || Math.abs(Date.now() - ts) > 5 * 60_000 || Number.isNaN(Date.parse(since)))
    return NextResponse.json({ error: 'identityKey, since (ISO), ts (ms, within 5 min) and sig are required' }, { status: 400 })
  let ok = false
  try {
    ok = PublicKey.fromString(identityKey).verify(Utils.toArray(`bmusic income:${since}:${ts}`, 'utf8'), Signature.fromDER(sig, 'hex'))
  } catch {}
  if (!ok) return NextResponse.json({ error: 'bad signature' }, { status: 401 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const h = { apikey: key, authorization: `Bearer ${key}` }
  const tracks = (await (await fetch(`${url}/rest/v1/bmusic_streams?artist_identity=eq.${identityKey}&select=track_id`, { headers: h, cache: 'no-store' })).json()) as { track_id: string }[]
  if (!tracks.length) return NextResponse.json({ payments: [] })
  const ids = tracks.map((t) => `"${t.track_id}"`).join(',')
  const rows = await (await fetch(
    `${url}/rest/v1/bmusic_stream_payments?track_id=in.(${encodeURIComponent(ids)})&created_at=gt.${encodeURIComponent(since)}&derivation_prefix=not.is.null&order=created_at.asc&limit=1000&select=txid,output_index,sats,derivation_prefix,derivation_suffix,track_id,album_id,created_at`,
    { headers: h, cache: 'no-store' },
  )).json()
  return NextResponse.json({ payments: rows })
}

export function OPTIONS() {
  return new Response(null, { status: 204 })
}
