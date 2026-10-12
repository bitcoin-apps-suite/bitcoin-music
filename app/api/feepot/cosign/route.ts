import { NextResponse } from 'next/server'
import { getOne, updateWhere } from '@/lib/bmusic/db'
import { contributionOk } from '@/lib/feepot/limits'
import { feePotOn, potKey, signPotInput } from '@/lib/feepot/service'

/**
 * POST {reservation, tx} → {vin, unlockingScript} for the pot's input only (bwalletX docs/FEE-POT.md › Flow step 3).
 * The reservation must be live and unused; the pot's input must pay the fee only. 503 while off.
 */
export const dynamic = 'force-dynamic'

type Reservation = { id: string; outpoint: string; satoshis: number; change_sats: number; fee_sats: number; expires_at: string; used: boolean }

export async function POST(request: Request) {
  const key = potKey()
  if (!feePotOn() || !key) return NextResponse.json({ error: 'fee pot off' }, { status: 503 })
  let b: { reservation?: unknown; tx?: unknown }
  try {
    b = await request.json()
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const id = String(b.reservation ?? '')
  const tx = String(b.tx ?? '')
  if (!/^[0-9a-f-]{36}$/.test(id) || !/^[0-9a-f]+$/i.test(tx) || tx.length > 200_000)
    return NextResponse.json({ error: 'reservation and tx hex required' }, { status: 400 })
  const r = await getOne<Reservation>('feepot_reservations', 'id', id)
  if (!r || r.used || Date.parse(r.expires_at) < Date.now()) return NextResponse.json({ error: 'reservation expired' }, { status: 410 })
  // Mark used first (lost race = someone else signed it).
  const won = await updateWhere('feepot_reservations', { id, used: 'false' }, { used: true })
  if (!won.length) return NextResponse.json({ error: 'reservation used' }, { status: 409 })
  let signed: Awaited<ReturnType<typeof signPotInput>> = null
  try {
    signed = await signPotInput(
      tx, key,
      { outpoint: r.outpoint, satoshis: Number(r.satoshis), changeSatoshis: Number(r.change_sats), feeSats: Number(r.fee_sats) },
      contributionOk,
    )
  } catch {
    signed = null
  }
  if (!signed) return NextResponse.json({ error: 'the pot input must pay the network fee only' }, { status: 422 })
  return NextResponse.json(signed)
}
