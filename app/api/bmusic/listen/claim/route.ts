import { NextResponse } from 'next/server'
import { getOne, upsert } from '@/lib/bmusic/db'
import { CLAIM_PROTOCOL, verifyWalletSig } from '@/lib/bmusic/listeners'

export const dynamic = 'force-dynamic'

const KEY = /^0[23][0-9a-f]{64}$/i

/**
 * Opt in: link a listening session to a wallet identity (shown on artist boards).
 * Body: { sessionPubKey, identityKey, handle?, ts, sig }. sig = identity wallet createSignature({
 *   protocolID: [2,'bmusic listen claim'], keyID: sessionPubKey, counterparty: 'anyone', data: utf8("claim:<sessionPubKey>:<ts>") }).
 * Opt out: { identityKey, ts, sig, optOut: true } with keyID 'optout' and data "optout:<identityKey>:<ts>": unlinks
 * every session of that identity (their listening becomes anonymous again).
 */
export async function POST(request: Request) {
  let b: { sessionPubKey?: unknown; identityKey?: unknown; handle?: unknown; ts?: unknown; sig?: unknown; optOut?: unknown }
  try {
    b = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const identityKey = String(b.identityKey ?? '')
  const ts = Number(b.ts)
  const sig = String(b.sig ?? '')
  if (!KEY.test(identityKey) || !/^[0-9a-f]+$/i.test(sig)) return NextResponse.json({ error: 'identityKey, ts and sig are required' }, { status: 400 })

  if (b.optOut === true) {
    if (!(await verifyWalletSig(identityKey, CLAIM_PROTOCOL, 'optout', `optout:${identityKey}:${ts}`, sig, ts)))
      return NextResponse.json({ error: 'bad signature' }, { status: 401 })
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
    await fetch(`${url}/rest/v1/bmusic_listen_claims?identity=eq.${identityKey}`, { method: 'DELETE', headers: { apikey: key, authorization: `Bearer ${key}` } })
    return NextResponse.json({ optedOut: true })
  }

  const session = String(b.sessionPubKey ?? '')
  if (!KEY.test(session)) return NextResponse.json({ error: 'sessionPubKey is required' }, { status: 400 })
  if (!(await verifyWalletSig(identityKey, CLAIM_PROTOCOL, session, `claim:${session}:${ts}`, sig, ts)))
    return NextResponse.json({ error: 'bad signature' }, { status: 401 })
  const existing = await getOne<{ identity: string }>('bmusic_listen_claims', 'session', session)
  if (existing && existing.identity !== identityKey) return NextResponse.json({ error: 'this session is already claimed' }, { status: 409 })
  const handle = typeof b.handle === 'string' ? b.handle.slice(0, 64) : null
  await upsert('bmusic_listen_claims', { session, identity: identityKey, handle }, 'session')
  return NextResponse.json({ claimed: true })
}

export function OPTIONS() {
  return new Response(null, { status: 204 })
}
