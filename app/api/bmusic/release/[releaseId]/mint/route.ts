import { NextResponse } from 'next/server'
import { Transaction, Utils } from '@bsv/sdk'
import { getOne, updateWhere } from '@/lib/bmusic/db'
import { ARTIST_AUTH_PROTOCOL, verifyWalletSig } from '@/lib/bmusic/listeners'
import { mintPayTo, OWNER_KEY_PROTOCOL, RELEASE_CONTENT_TYPE, RESERVE_MS, releaseRecord, type Release } from '@/lib/bmusic/release'
import { broadcastStrict, openAtRest, parseInscription, serverIdentity, serverWallet, type StreamRow } from '@/lib/bmusic/server'

export const dynamic = 'force-dynamic'

/**
 * Mint the 1/1 original. Body: { rawTx, identityKey, ts, sig } where sig = buyer wallet createSignature({
 * protocolID: [2,'bmusic artist auth'], keyID: String(ts), counterparty: 'anyone', data: utf8("mint:<releaseId>:<txid>:<ts>") }).
 * Checks the inscription is exactly this release's record and the artist is paid the price, reserves the
 * release (first buyer wins; others are refused BEFORE their payment is broadcast), broadcasts, records the
 * origin, and returns the owner key: the track secret wrapped (BRC-2) to the buyer's identity key, from which
 * every segment key derives (HMAC-SHA256(secret, "<trackId>:<n>")): the owner plays free without the server.
 */
export async function POST(request: Request, { params }: { params: Promise<{ releaseId: string }> }) {
  const { releaseId } = await params
  let b: { rawTx?: unknown; identityKey?: unknown; ts?: unknown; sig?: unknown }
  try {
    b = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const identityKey = String(b.identityKey ?? '')
  const ts = Number(b.ts)
  if (typeof b.rawTx !== 'string' || !/^[0-9a-f]+$/i.test(b.rawTx)) return NextResponse.json({ error: 'rawTx (hex) is required' }, { status: 400 })
  let tx: Transaction
  try {
    tx = Transaction.fromHex(b.rawTx)
  } catch {
    return NextResponse.json({ error: 'not a transaction' }, { status: 400 })
  }
  const txid = tx.id('hex')
  if (!(await verifyWalletSig(identityKey, ARTIST_AUTH_PROTOCOL, String(ts), `mint:${releaseId}:${txid}:${ts}`, String(b.sig ?? ''), ts)))
    return NextResponse.json({ error: 'bad signature' }, { status: 401 })

  const s = await getOne<StreamRow & { title: string; kind: string }>('bmusic_streams', 'track_id', releaseId)
  const r = await getOne<Release>('bmusic_releases', 'release_id', releaseId)
  if (!s || !r) return NextResponse.json({ error: 'unknown release' }, { status: 404 })
  if (r.minted_origin) return NextResponse.json({ error: 'already minted', origin: r.minted_origin }, { status: 409 })
  if (r.mint_price_sats === null) return NextResponse.json({ error: 'not for sale' }, { status: 403 })
  if (r.payee_mode !== 'artist') return NextResponse.json({ error: 'holder payouts are not switched on' }, { status: 403 })

  // the inscription: exactly this release's record, 1 sat
  const kind = s.kind === 'video' ? 'video' : 'audio'
  const want = JSON.stringify(releaseRecord(s, r, kind))
  const vout = tx.outputs.findIndex((o) => {
    const ins = (o.satoshis ?? 0) === 1 ? parseInscription(o.lockingScript) : null
    return !!ins && ins.contentType === RELEASE_CONTENT_TYPE && Utils.toUTF8(ins.content) === want
  })
  if (vout < 0) return NextResponse.json({ error: 'the transaction must inscribe this release record (GET the release for it)' }, { status: 400 })
  const pay = await mintPayTo(s, r.mint_price_sats)
  if (!tx.outputs.some((o) => o.lockingScript.toHex() === pay.lockingScript && (o.satoshis ?? 0) >= pay.sats))
    return NextResponse.json({ error: `pay the artist ${pay.sats} sats to ${pay.address}`, payTo: pay }, { status: 402 })

  // reserve: first buyer wins, before anyone's payment goes out
  const now = new Date()
  const free = r.reserved_until === null || Date.parse(r.reserved_until) < now.getTime() || r.reserved_by === identityKey
  if (!free) return NextResponse.json({ error: 'someone else is minting this right now; try again in two minutes' }, { status: 409 })
  const got = await updateWhere<Release>('bmusic_releases', { release_id: releaseId, ...(r.reserved_until ? { reserved_until: r.reserved_until } : {}) },
    { reserved_by: identityKey, reserved_until: new Date(now.getTime() + RESERVE_MS).toISOString() })
  if (!got.length) return NextResponse.json({ error: 'someone else is minting this right now' }, { status: 409 })

  try {
    await broadcastStrict(b.rawTx)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'broadcast failed' }, { status: 502 })
  }
  const origin = `${txid}_${vout}`
  await updateWhere('bmusic_releases', { release_id: releaseId }, { minted_origin: origin, minted_by: identityKey, minted_at: now.toISOString(), reserved_by: null, reserved_until: null })

  const secret = openAtRest(s.secret_enc)
  const { ciphertext } = await serverWallet().encrypt({ plaintext: Array.from(secret), protocolID: OWNER_KEY_PROTOCOL, keyID: releaseId, counterparty: identityKey })
  secret.fill(0)
  return NextResponse.json({ origin, txid, ownerKey: Utils.toBase64(ciphertext), protocolID: OWNER_KEY_PROTOCOL, keyID: releaseId, serverIdentityKey: await serverIdentity() })
}

export function OPTIONS() {
  return new Response(null, { status: 204 })
}
