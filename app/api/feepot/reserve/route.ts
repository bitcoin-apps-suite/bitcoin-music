import { NextResponse } from 'next/server'
import { P2PKH } from '@bsv/sdk'
import { insert, rpc } from '@/lib/bmusic/db'
import { feePotDecision } from '@/lib/feepot/limits'
import { feePotOn, monthlyBudgetSats, potKey, RESERVE_TTL_MS, verifyProof } from '@/lib/feepot/service'

/**
 * POST {kind, identityKey, txBytes, timestamp, sig} → a pot input + the pot's change output for one action
 * (bwalletX docs/FEE-POT.md › Flow step 1). 503 while FEE_POT_ENABLED is off or FEE_POT_WIF is unset.
 */
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const key = potKey()
  if (!feePotOn() || !key) return NextResponse.json({ error: 'fee pot off' }, { status: 503 })
  let b: { kind?: unknown; identityKey?: unknown; txBytes?: unknown; timestamp?: unknown; sig?: unknown }
  try {
    b = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const kind = String(b.kind ?? '')
  const identityKey = String(b.identityKey ?? '').toLowerCase()
  const txBytes = Math.floor(Number(b.txBytes))
  const timestamp = Number(b.timestamp)
  if (!/^0[23][0-9a-f]{64}$/.test(identityKey) || !(txBytes > 0) || Math.abs(Date.now() - timestamp) > 5 * 60_000)
    return NextResponse.json({ error: 'identityKey, txBytes and a fresh timestamp are required' }, { status: 400 })
  if (!(await verifyProof(kind, identityKey, txBytes, timestamp, String(b.sig ?? ''))))
    return NextResponse.json({ error: 'bad signature' }, { status: 401 })

  // Usage + account age come from the DB (feepot_usage_for: today's count for this key, this month's sats, first seen).
  const [u] = await rpc<{ user_today: number; month_sats: number; first_seen: string }[]>('feepot_usage_for', { p_key: identityKey })
  const decision = feePotDecision(
    { kind, userCreatedAt: new Date(u?.first_seen ?? Date.now()), now: new Date(), txBytes },
    { userToday: Number(u?.user_today ?? 0), monthSats: Number(u?.month_sats ?? 0) },
    monthlyBudgetSats(),
  )
  if (!decision.ok) return NextResponse.json({ error: decision.reason }, { status: 429 })

  // Claim one free pot UTXO atomically (feepot_claim_utxo marks it reserved until now + TTL).
  const [utxo] = await rpc<{ outpoint: string; sats: number; beef: string }[]>('feepot_claim_utxo', {
    p_min_sats: decision.feeSats + 1, p_ttl_ms: RESERVE_TTL_MS,
  })
  if (!utxo) return NextResponse.json({ error: 'pot empty' }, { status: 410 })
  const changeSatoshis = Number(utxo.sats) - decision.feeSats
  const reservation = crypto.randomUUID()
  await insert('feepot_reservations', {
    id: reservation, identity_key: identityKey, kind, outpoint: utxo.outpoint, satoshis: utxo.sats,
    change_sats: changeSatoshis, fee_sats: decision.feeSats, expires_at: new Date(Date.now() + RESERVE_TTL_MS).toISOString(),
  })
  return NextResponse.json({
    outpoint: utxo.outpoint, inputBEEF: Array.from(Buffer.from(utxo.beef, 'hex')), satoshis: Number(utxo.sats),
    changeLockingScript: new P2PKH().lock(key.toPublicKey().toAddress()).toHex(), changeSatoshis,
    feeSats: decision.feeSats, reservation,
  })
}
