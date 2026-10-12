import { NextResponse } from 'next/server'
import { P2PKH, PublicKey, Signature, Transaction, Utils } from '@bsv/sdk'
import { getOne, insert } from '@/lib/bmusic/db'
import { broadcastStrict, openAtRest, segmentKey, serverIdentity, serverWallet, STREAM_KEY_PROTOCOL } from '@/lib/bmusic/server'

export const dynamic = 'force-dynamic'

type Stream = { track_id: string; artist_address: string; segments: number; sats_per_segment: number; secret_enc: string }

/**
 * Pay for one second, get its key (per-second streaming demo).
 * Body: { trackId, segment, rawTx (hex), listener (session public key, hex), sig }.
 * sig = DER hex of sessionKey.sign(utf8 "<trackId>:<segment>:<txid>") (@bsv/sdk; ECDSA over its sha256): binds the key to the payer, so a
 * copied rawTx can't fetch keys wrapped to someone else.
 * The transaction must pay the track's artist ≥ sats_per_segment. It is broadcast (ARC, strict: orphan or
 * rejected = 502 with the real status), each txid buys exactly one segment, and the segment key comes back
 * encrypted (BRC-2) to `listener`: protocol STREAM_KEY_PROTOCOL, keyID "<trackId>.<segment>",
 * counterparty = serverIdentityKey.
 */
export async function POST(request: Request) {
  let body: { trackId?: unknown; segment?: unknown; rawTx?: unknown; listener?: unknown; sig?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const { trackId, segment, rawTx, listener, sig } = body
  if (typeof trackId !== 'string' || !Number.isInteger(segment) || typeof rawTx !== 'string' || !/^[0-9a-f]+$/i.test(rawTx)
    || typeof listener !== 'string' || !/^0[23][0-9a-f]{64}$/i.test(listener) || typeof sig !== 'string' || !/^[0-9a-f]+$/i.test(sig))
    return NextResponse.json({ error: 'trackId, segment (integer), rawTx (hex), listener (public key) and sig are required' }, { status: 400 })

  const stream = await getOne<Stream>('bmusic_streams', 'track_id', trackId)
  if (!stream) return NextResponse.json({ error: 'unknown track' }, { status: 404 })
  const n = segment as number
  if (n < 0 || n >= stream.segments) return NextResponse.json({ error: 'no such segment' }, { status: 404 })

  let tx: Transaction
  try {
    tx = Transaction.fromHex(rawTx)
  } catch {
    return NextResponse.json({ error: 'not a transaction' }, { status: 400 })
  }
  const artistScript = new P2PKH().lock(stream.artist_address).toHex()
  if (!tx.outputs.some((o) => o.lockingScript.toHex() === artistScript && (o.satoshis ?? 0) >= stream.sats_per_segment))
    return NextResponse.json({ error: `pay ${stream.sats_per_segment} sat to ${stream.artist_address}` }, { status: 402 })

  const txid = tx.id('hex')
  let signed = false
  try {
    signed = PublicKey.fromString(listener).verify(Utils.toArray(`${trackId}:${n}:${txid}`, 'utf8'), Signature.fromDER(sig, 'hex'))
  } catch {}
  if (!signed) return NextResponse.json({ error: 'sig must be the listener key signing sha256("<trackId>:<segment>:<txid>")' }, { status: 401 })
  if (await getOne('bmusic_stream_payments', 'txid', txid, 'txid'))
    return NextResponse.json({ error: 'this transaction already paid for a second' }, { status: 409 })
  try {
    await broadcastStrict(rawTx)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'broadcast failed' }, { status: 502 })
  }
  try {
    await insert('bmusic_stream_payments', { txid, track_id: trackId, segment: n, listener })
  } catch {
    return NextResponse.json({ error: 'this transaction already paid for a second' }, { status: 409 })
  }

  const secret = openAtRest(stream.secret_enc)
  const key = segmentKey(secret, trackId, n)
  secret.fill(0)
  const { ciphertext } = await serverWallet().encrypt({
    plaintext: Array.from(key),
    protocolID: STREAM_KEY_PROTOCOL,
    keyID: `${trackId}.${n}`,
    counterparty: listener,
  })
  key.fill(0)
  return NextResponse.json({
    txid,
    wrappedKey: Utils.toBase64(ciphertext),
    protocolID: STREAM_KEY_PROTOCOL,
    keyID: `${trackId}.${n}`,
    serverIdentityKey: await serverIdentity(),
  })
}

/** CORS preflight (headers come from next.config.js). */
export function OPTIONS() {
  return new Response(null, { status: 204 })
}
