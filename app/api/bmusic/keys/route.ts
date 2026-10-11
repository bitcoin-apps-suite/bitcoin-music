import { NextResponse } from 'next/server'
import { PublicKey, Utils } from '@bsv/sdk'
import { upsert } from '@/lib/bmusic/db'
import { opens, readSealedTrack, sealAtRest, serverIdentity, serverWallet, sha256hex } from '@/lib/bmusic/server'
import { REGISTER_PROTOCOL } from '@/lib/bmusic/points'

export const dynamic = 'force-dynamic'

/** The key server's identity key, so an artist's wallet can wrap a track key to it. */
export async function GET() {
  try {
    return NextResponse.json({ serverIdentityKey: await serverIdentity(), registerProtocol: REGISTER_PROTOCOL })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'key server not configured' }, { status: 503 })
  }
}

/**
 * The artist hands a sealed track's key to the key server (STREAMING-SPEC §6).
 * Body: { origin, identityKey, wrappedKey } where wrappedKey = BRC-2 encrypt of the 32-byte key,
 * protocol REGISTER_PROTOCOL, keyID = origin, counterparty = the server's identity key.
 * Checks: the registrant's address is the track's artist payee; the key matches the inscribed keyHash;
 * the key actually opens the inscribed file. Decrypting with the registrant as counterparty proves their
 * wallet wrapped it, so no separate signature is needed.
 */
export async function POST(request: Request) {
  let body: { origin?: unknown; identityKey?: unknown; wrappedKey?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const { origin, identityKey, wrappedKey } = body
  if (typeof origin !== 'string' || typeof identityKey !== 'string' || typeof wrappedKey !== 'string')
    return NextResponse.json({ error: 'origin, identityKey and wrappedKey are required' }, { status: 400 })

  let artistAddress: string
  try {
    artistAddress = PublicKey.fromString(identityKey).toAddress()
  } catch {
    return NextResponse.json({ error: 'bad identity key' }, { status: 400 })
  }

  let track: Awaited<ReturnType<typeof readSealedTrack>>
  try {
    track = await readSealedTrack(origin)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'not a sealed track' }, { status: 400 })
  }
  const artist = track.rule.points.find((p) => p.role === 'artist')
  if (artist?.to !== artistAddress) return NextResponse.json({ error: 'only the track’s artist can register its key' }, { status: 403 })

  let key: Uint8Array
  try {
    const { plaintext } = await serverWallet().decrypt({
      ciphertext: Utils.toArray(wrappedKey, 'base64'),
      protocolID: REGISTER_PROTOCOL,
      keyID: origin,
      counterparty: identityKey,
    })
    key = Uint8Array.from(plaintext)
  } catch {
    return NextResponse.json({ error: 'could not unwrap the key: wrap it to the server identity key with keyID = origin' }, { status: 400 })
  }
  if (key.length !== 32 || sha256hex(key) !== track.rule.keyHash) return NextResponse.json({ error: 'key does not match the track’s keyHash' }, { status: 400 })
  if (!opens(key, track.sealed)) return NextResponse.json({ error: 'key does not open the inscribed file' }, { status: 400 })

  try {
    await upsert(
      'bmusic_tracks',
      { origin, key_hash: track.rule.keyHash, key_enc: sealAtRest(key), artist_identity: identityKey, play_rule: track.rule, content_type: track.contentType },
      'origin',
    )
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'database error' }, { status: 500 })
  } finally {
    key.fill(0)
  }
  return NextResponse.json({ ok: true, origin })
}

/** CORS preflight (headers come from next.config.js). */
export function OPTIONS() {
  return new Response(null, { status: 204 })
}
