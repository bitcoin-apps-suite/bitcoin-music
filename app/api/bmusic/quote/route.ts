import { randomBytes } from 'node:crypto'
import { NextResponse } from 'next/server'
import { PublicKey } from '@bsv/sdk'
import { getOne, insert } from '@/lib/bmusic/db'
import { centsToSats, QUOTE_TTL_MS, quoteOutputs, serverIdentity, usdPerBsv } from '@/lib/bmusic/server'
import type { PlayRule } from '@/lib/bmusic/points'

export const dynamic = 'force-dynamic'

/**
 * Quote one play of a sealed track (STREAMING-SPEC §5 step 1).
 * Body: { origin, identityKey } (the listener's identity key; the key comes back wrapped to it).
 * Returns the outputs the play transaction must contain, a reference, and when the quote expires.
 * bMusic's own output is BRC-29: the listener's wallet pays it with { derivationPrefix, derivationSuffix, senderIdentityKey }.
 */
export async function POST(request: Request) {
  let body: { origin?: unknown; identityKey?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const { origin, identityKey } = body
  if (typeof origin !== 'string' || typeof identityKey !== 'string') return NextResponse.json({ error: 'origin and identityKey are required' }, { status: 400 })
  try {
    PublicKey.fromString(identityKey)
  } catch {
    return NextResponse.json({ error: 'bad identity key' }, { status: 400 })
  }

  const track = await getOne<{ play_rule: PlayRule }>('bmusic_tracks', 'origin', origin, 'play_rule')
  if (!track) return NextResponse.json({ error: 'this track isn’t on bMusic yet' }, { status: 404 })
  const rule = track.play_rule as PlayRule

  try {
    const usd = await usdPerBsv()
    const { outputs, derivation, total } = await quoteOutputs(rule, identityKey, centsToSats(rule.price.usdCents, usd))
    const reference = randomBytes(16).toString('hex')
    const expiresAt = new Date(Date.now() + QUOTE_TTL_MS).toISOString()
    await insert('bmusic_plays', {
      reference,
      origin,
      listener_identity: identityKey,
      outputs,
      derivation,
      sats_total: total,
      expires_at: expiresAt,
    })
    return NextResponse.json({
      reference,
      serverIdentityKey: await serverIdentity(),
      priceUsdCents: rule.price.usdCents,
      satoshis: total,
      outputs,
      derivation: derivation && { derivationPrefix: derivation.prefix, derivationSuffix: derivation.suffix },
      expiresAt,
    })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'quote failed' }, { status: 503 })
  }
}

/** CORS preflight (headers come from next.config.js). */
export function OPTIONS() {
  return new Response(null, { status: 204 })
}
