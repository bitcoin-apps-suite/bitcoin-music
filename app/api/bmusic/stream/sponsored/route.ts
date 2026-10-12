import { NextResponse } from 'next/server'
import { PublicKey, Signature, Utils } from '@bsv/sdk'
import { getOne, insert, query } from '@/lib/bmusic/db'
import { broadcastStrict, openAtRest, segmentKey, serverIdentity, serverWallet, STREAM_KEY_PROTOCOL, streamPayTo, type StreamRow } from '@/lib/bmusic/server'
import { IP_DAILY_SECONDS, release, settle, SponsorError, sponsorSecond, takeIpSecond, type Pot } from '@/lib/bmusic/sponsor'

export const dynamic = 'force-dynamic'

/** GET ?albumId → is listening sponsored right now, and how much is left. */
export async function GET(request: Request) {
  const albumId = new URL(request.url).searchParams.get('albumId') ?? ''
  const pots = await query<Pot>(`bmusic_sponsor_pots?album_id=eq.${encodeURIComponent(albumId)}&limit=1`)
  const p = pots[0]
  if (!p) return NextResponse.json({ sponsored: false })
  return NextResponse.json({ sponsored: p.active && p.spent_sats < p.cap_sats, sponsor: p.pot, capSats: p.cap_sats, spentSats: p.spent_sats, fundAddress: p.address })
}

/**
 * A second paid by the artist's sponsor pot. Body: { trackId, segment, listener, sig }.
 * sig = listener.sign(utf8 "sponsored:<trackId>:<segment>").toDER('hex').
 * Same response as POST /api/bmusic/stream (key wrapped to `listener`, `next`), plus sponsoredBy.
 * 410 = pot empty/capped/closed, or this connection's daily allowance (IP_DAILY_SECONDS) used → the player
 * falls back to paying itself. A second already sponsored for this
 * listener is re-issued without paying again.
 */
export async function POST(request: Request) {
  let body: { trackId?: unknown; segment?: unknown; listener?: unknown; sig?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const { trackId, segment, listener, sig } = body
  if (typeof trackId !== 'string' || !Number.isInteger(segment) || typeof listener !== 'string' || !/^0[23][0-9a-f]{64}$/i.test(listener)
    || typeof sig !== 'string' || !/^[0-9a-f]+$/i.test(sig))
    return NextResponse.json({ error: 'trackId, segment, listener and sig are required' }, { status: 400 })
  const n = segment as number
  let signed = false
  try {
    signed = PublicKey.fromString(listener).verify(Utils.toArray(`sponsored:${trackId}:${n}`, 'utf8'), Signature.fromDER(sig, 'hex'))
  } catch {}
  if (!signed) return NextResponse.json({ error: 'sig must be the listener key signing "sponsored:<trackId>:<segment>"' }, { status: 401 })

  const stream = await getOne<StreamRow>('bmusic_streams', 'track_id', trackId)
  if (!stream) return NextResponse.json({ error: 'unknown track' }, { status: 404 })
  if (n < 0 || n >= stream.segments) return NextResponse.json({ error: 'no such segment' }, { status: 404 })
  const pot = (await query<Pot>(`bmusic_sponsor_pots?album_id=eq.${encodeURIComponent(stream.album_id)}&limit=1`))[0]
  if (!pot) return NextResponse.json({ error: 'this album is not sponsored' }, { status: 410 })

  const already = await query<{ txid: string }>(
    `bmusic_stream_payments?track_id=eq.${encodeURIComponent(trackId)}&segment=eq.${n}&listener=eq.${listener}&sponsored_by=eq.${pot.pot}&limit=1&select=txid`,
  )
  let txid = already[0]?.txid
  if (!txid) {
    const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
    if (!(await takeIpSecond(ip)))
      return NextResponse.json({ error: `sponsored listening is ${IP_DAILY_SECONDS} seconds a day per connection; pay your own seconds to keep going` }, { status: 410 })
    const payTo = await streamPayTo(stream, n)
    let s
    try {
      s = await sponsorSecond(pot, listener, payTo)
    } catch (e) {
      if (e instanceof SponsorError) return NextResponse.json({ error: e.message }, { status: e.status })
      throw e
    }
    try {
      txid = await broadcastStrict(s.tx.toHex())
    } catch (e) {
      await release(s.utxo)
      return NextResponse.json({ error: e instanceof Error ? e.message : 'broadcast failed' }, { status: 502 })
    }
    await settle(pot, listener, s)
    await insert('bmusic_stream_payments', {
      txid, track_id: trackId, album_id: stream.album_id, segment: n, listener, output_index: 0, sats: payTo.sats, fee: s.fee,
      sponsored_by: pot.pot, derivation_prefix: payTo.derivationPrefix ?? null, derivation_suffix: payTo.derivationSuffix ?? null,
    })
  }

  const secret = openAtRest(stream.secret_enc)
  const key = segmentKey(secret, trackId, n)
  secret.fill(0)
  const { ciphertext } = await serverWallet().encrypt({ plaintext: Array.from(key), protocolID: STREAM_KEY_PROTOCOL, keyID: `${trackId}.${n}`, counterparty: listener })
  key.fill(0)
  return NextResponse.json({
    txid,
    sponsoredBy: pot.pot,
    wrappedKey: Utils.toBase64(ciphertext),
    protocolID: STREAM_KEY_PROTOCOL,
    keyID: `${trackId}.${n}`,
    serverIdentityKey: await serverIdentity(),
    next: n + 1 < stream.segments ? { segment: n + 1 } : null,
  })
}

export function OPTIONS() {
  return new Response(null, { status: 204 })
}
