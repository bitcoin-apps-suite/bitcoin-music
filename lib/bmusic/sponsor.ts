/**
 * Artist sponsor pot (owner decision 12 Oct 2026: held by the bMusic server, hard cap $5).
 * The artist funds a key this server derives for itself per pot; while the pot lasts, listeners' seconds are
 * paid from it: 1 sat to the artist (BRC-29, same output as a listener would pay) plus the network fee.
 * Each listening session holds one pot UTXO and chains its own change, so concurrent listeners never collide.
 */
import { KeyDeriver, P2PKH, PrivateKey, Transaction } from '@bsv/sdk'
import { getOne, insert, query, updateWhere } from './db'
import type { PayTo } from './server'

export const SPONSOR_PROTOCOL: [2, string] = [2, 'bmusic sponsor pot']
export const SATS_PER_KB = 100
const HOLD_MS = 2 * 60_000
const MIN_GAP_MS = 700 // one paid second per session, roughly per second

export type Pot = { pot: string; album_id: string; address: string; cap_sats: number; spent_sats: number; active: boolean }
type Utxo = { outpoint: string; pot: string; sats: number; status: string; holder: string | null; held_at: string | null }

export function potKey(pot: string): PrivateKey {
  const wif = process.env.BMUSIC_SERVER_WIF
  if (!wif) throw new Error('BMUSIC_SERVER_WIF is not set')
  return new KeyDeriver(PrivateKey.fromWif(wif)).derivePrivateKey(SPONSOR_PROTOCOL, pot, 'self')
}
export const potAddress = (pot: string) => potKey(pot).toPublicKey().toAddress()

/** The UTXO this listener is chaining, or claim a free (or abandoned) one. */
async function holdUtxo(pot: string, listener: string): Promise<{ utxo: Utxo; fresh: boolean } | null> {
  const mine = await query<Utxo>(`bmusic_sponsor_utxos?pot=eq.${pot}&status=eq.held&holder=eq.${listener}&limit=1`)
  if (mine[0]) return { utxo: mine[0], fresh: false }
  const stale = new Date(Date.now() - HOLD_MS).toISOString()
  const candidates = await query<Utxo>(
    `bmusic_sponsor_utxos?pot=eq.${pot}&or=(status.eq.free,and(status.eq.held,held_at.lt.${encodeURIComponent(stale)}))&order=sats.desc&limit=5`,
  )
  for (const c of candidates) {
    const got = await updateWhere<Utxo>('bmusic_sponsor_utxos', { outpoint: c.outpoint, status: c.status }, { status: 'held', holder: listener, held_at: new Date().toISOString() })
    if (got[0]) return { utxo: got[0], fresh: true }
  }
  return null
}

/**
 * Build and sign the sponsored payment for one second. Returns the raw tx and how to record it; the caller
 * broadcasts, then calls `settle` on success (or `release` on failure).
 */
export async function sponsorSecond(potRow: Pot, listener: string, payTo: PayTo) {
  if (!potRow.active) throw new SponsorError('the sponsor pot is closed', 410)
  const held = await holdUtxo(potRow.pot, listener)
  if (!held) throw new SponsorError('the sponsor pot is empty', 410)
  const utxo = held.utxo
  // held_at on a chained change output = when this listener's last second was paid
  if (!held.fresh && utxo.held_at && Date.now() - Date.parse(utxo.held_at) < MIN_GAP_MS)
    throw new SponsorError('one second at a time', 429)

  const key = potKey(potRow.pot)
  const lock = new P2PKH().lock(key.toPublicKey().toAddress())
  const [txid, vout] = utxo.outpoint.split('.')
  const build = (change: number) => {
    const tx = new Transaction()
    tx.addInput({ sourceTXID: txid, sourceOutputIndex: Number(vout), unlockingScriptTemplate: new P2PKH().unlock(key, 'all', false, utxo.sats, lock) })
    tx.addOutput({ lockingScript: new P2PKH().lock(payTo.address), satoshis: payTo.sats })
    if (change > 0) tx.addOutput({ lockingScript: lock, satoshis: change })
    return tx
  }
  // size with change, at the policy rate; drop dust change into the fee
  const probe = build(1)
  await probe.sign()
  let fee = Math.ceil((probe.toBinary().length * SATS_PER_KB) / 1000)
  let change = utxo.sats - payTo.sats - fee
  if (change < 50) {
    change = 0
    fee = utxo.sats - payTo.sats
    if (fee < 1) throw new SponsorError('the sponsor pot is empty', 410)
  }
  const cost = payTo.sats + fee
  if (potRow.spent_sats + cost > potRow.cap_sats) throw new SponsorError('the sponsor pot reached its cap', 410)
  const tx = build(change)
  await tx.sign()
  return { tx, utxo, fee, change, cost }
}

/** After a successful broadcast: spend the old UTXO, hold the change for the same listener, count the spend. */
export async function settle(potRow: Pot, listener: string, s: Awaited<ReturnType<typeof sponsorSecond>>) {
  const txid = s.tx.id('hex')
  await updateWhere('bmusic_sponsor_utxos', { outpoint: s.utxo.outpoint }, { status: 'spent' })
  if (s.change > 0) {
    await insert('bmusic_sponsor_utxos', { outpoint: `${txid}.1`, pot: potRow.pot, sats: s.change, status: 'held', holder: listener, held_at: new Date().toISOString() })
  }
  // spent counter: conditional on the value we read, retried once on a race
  for (let i = 0; i < 3; i++) {
    const cur = (await getOne<Pot>('bmusic_sponsor_pots', 'pot', potRow.pot))!
    const ok = await updateWhere('bmusic_sponsor_pots', { pot: potRow.pot, spent_sats: String(cur.spent_sats) }, { spent_sats: cur.spent_sats + s.cost })
    if (ok.length) break
  }
}

/** Broadcast failed: keep the UTXO with this listener (unchanged) so the next call retries from it. */
export async function release(utxo: Utxo) {
  await updateWhere('bmusic_sponsor_utxos', { outpoint: utxo.outpoint }, { held_at: new Date(0).toISOString() })
}

export class SponsorError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}
