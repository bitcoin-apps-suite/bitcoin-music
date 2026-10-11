import { NextResponse } from 'next/server'
import { Transaction, Utils } from '@bsv/sdk'
import { getOne, updateWhere } from '@/lib/bmusic/db'
import { broadcast, openAtRest, paysQuote, PLAY_KEY_PROTOCOL, serverIdentity, serverWallet, type QuoteOutput } from '@/lib/bmusic/server'

export const dynamic = 'force-dynamic'

/**
 * Redeem a quote (STREAMING-SPEC §5 steps 2–4).
 * Body: { reference, rawTx } (hex of the signed play transaction).
 * Checks the transaction pays every quoted output, broadcasts it, marks the quote paid (one play per
 * quote and per transaction), and returns the track key encrypted (BRC-2) to the listener's identity key:
 * protocol PLAY_KEY_PROTOCOL, keyID = reference, counterparty = serverIdentityKey on the listener's side.
 */
export async function POST(request: Request) {
  let body: { reference?: unknown; rawTx?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const { reference, rawTx } = body
  if (typeof reference !== 'string' || typeof rawTx !== 'string' || !/^[0-9a-f]+$/i.test(rawTx))
    return NextResponse.json({ error: 'reference and rawTx (hex) are required' }, { status: 400 })

  type Play = { origin: string; listener_identity: string; outputs: QuoteOutput[]; status: string; expires_at: string }
  const play = await getOne<Play>('bmusic_plays', 'reference', reference)
  if (!play) return NextResponse.json({ error: 'unknown quote' }, { status: 404 })
  if (play.status !== 'quoted') return NextResponse.json({ error: 'this quote has already been used' }, { status: 409 })
  if (Date.parse(play.expires_at) < Date.now()) return NextResponse.json({ error: 'quote expired; ask for a new one' }, { status: 410 })

  let tx: Transaction
  try {
    tx = Transaction.fromHex(rawTx)
  } catch {
    return NextResponse.json({ error: 'not a transaction' }, { status: 400 })
  }
  const short = paysQuote(tx, play.outputs)
  if (short) return NextResponse.json({ error: short }, { status: 402 })

  let txid: string
  try {
    txid = await broadcast(rawTx)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'broadcast failed' }, { status: 502 })
  }

  // claim the quote: conditional update so a replay or a race gets nothing
  let claimed: unknown[]
  try {
    claimed = await updateWhere('bmusic_plays', { reference, status: 'quoted' }, { status: 'paid', txid, paid_at: new Date().toISOString() })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'database error'
    return NextResponse.json({ error: /unique|duplicate/i.test(msg) ? 'this transaction already paid for a play' : msg }, { status: 409 })
  }
  if (!claimed.length) return NextResponse.json({ error: 'this quote has already been used' }, { status: 409 })

  const track = await getOne<{ key_enc: string; content_type: string }>('bmusic_tracks', 'origin', play.origin, 'key_enc,content_type')
  const key = openAtRest(track!.key_enc)
  const { ciphertext } = await serverWallet().encrypt({
    plaintext: Array.from(key),
    protocolID: PLAY_KEY_PROTOCOL,
    keyID: reference,
    counterparty: play.listener_identity,
  })
  key.fill(0)
  return NextResponse.json({
    txid,
    wrappedKey: Utils.toBase64(ciphertext),
    protocolID: PLAY_KEY_PROTOCOL,
    keyID: reference,
    serverIdentityKey: await serverIdentity(),
    contentType: track!.content_type,
  })
}
