/**
 * Sponsor pot admin (run locally with the server env; nothing secret is printed).
 *
 *   pnpm exec tsx --env-file=.env.local scripts/bmusic/sponsor-pot.ts init <pot> <albumId> <capUsd>
 *   pnpm exec tsx --env-file=.env.local scripts/bmusic/sponsor-pot.ts split <pot>          # after funding the address
 *   pnpm exec tsx --env-file=.env.local scripts/bmusic/sponsor-pot.ts status <pot>
 *   pnpm exec tsx --env-file=.env.local scripts/bmusic/sponsor-pot.ts sweep <pot> <toAddress>  # close + return the rest
 */
import { P2PKH, Transaction } from '@bsv/sdk'
import { getOne, insert, query, updateWhere, upsert } from '../../lib/bmusic/db'
import { broadcastStrict, usdPerBsv } from '../../lib/bmusic/server'
import { potAddress, potKey, SATS_PER_KB, type Pot } from '../../lib/bmusic/sponsor'

const CHUNK = 60_000 // ≈ 2,500 sponsored seconds per listening session before it moves to the next chunk

type Woc = { tx_hash: string; tx_pos: number; value: number }
const unspent = async (addr: string): Promise<Woc[]> => {
  const r = await fetch(`https://api.whatsonchain.com/v1/bsv/main/address/${addr}/unspent/all`)
  const j = await r.json()
  return (j.result ?? j) as Woc[]
}

async function spendAll(pot: string, inputs: { txid: string; vout: number; sats: number }[], outputs: (fee: number) => { address: string; sats: number }[]) {
  const key = potKey(pot)
  const lock = new P2PKH().lock(key.toPublicKey().toAddress())
  const build = (fee: number) => {
    const tx = new Transaction()
    for (const i of inputs) tx.addInput({ sourceTXID: i.txid, sourceOutputIndex: i.vout, unlockingScriptTemplate: new P2PKH().unlock(key, 'all', false, i.sats, lock) })
    for (const o of outputs(fee)) tx.addOutput({ lockingScript: new P2PKH().lock(o.address), satoshis: o.sats })
    return tx
  }
  const probe = build(0)
  await probe.sign()
  const fee = Math.ceil((probe.toBinary().length * SATS_PER_KB) / 1000) + 1
  const tx = build(fee)
  await tx.sign()
  const txid = await broadcastStrict(tx.toHex())
  return { txid, tx }
}

async function main() {
  const [cmd, pot, a, b] = process.argv.slice(2)
  if (cmd === 'init') {
    const usd = await usdPerBsv()
    const cap = Math.round((Number(b) / usd) * 1e8)
    await upsert('bmusic_sponsor_pots', { pot, album_id: a, address: potAddress(pot), cap_sats: cap, active: true }, 'pot')
    console.log(`pot ${pot} for ${a}: cap $${b} = ${cap} sats at $${usd}/BSV`)
    console.log(`fund this address: ${potAddress(pot)}`)
  } else if (cmd === 'split') {
    const row = (await getOne<Pot>('bmusic_sponsor_pots', 'pot', pot))!
    const known = new Set((await query<{ outpoint: string }>(`bmusic_sponsor_utxos?pot=eq.${pot}&select=outpoint`)).map((u) => u.outpoint))
    const fresh = (await unspent(row.address)).filter((u) => !known.has(`${u.tx_hash}.${u.tx_pos}`))
    if (!fresh.length) return console.log('no new funding on', row.address)
    const total = fresh.reduce((n, u) => n + u.value, 0)
    const { txid, tx } = await spendAll(pot, fresh.map((u) => ({ txid: u.tx_hash, vout: u.tx_pos, sats: u.value })), (fee) => {
      const n = Math.max(1, Math.floor((total - fee) / CHUNK))
      const each = Math.floor((total - fee) / n)
      return Array.from({ length: n }, () => ({ address: row.address, sats: each }))
    })
    for (const [vout, o] of tx.outputs.entries()) await insert('bmusic_sponsor_utxos', { outpoint: `${txid}.${vout}`, pot, sats: o.satoshis, status: 'free' })
    console.log(`split ${total} sats into ${tx.outputs.length} chunks: ${txid}`)
  } else if (cmd === 'status') {
    const row = (await getOne<Pot>('bmusic_sponsor_pots', 'pot', pot))!
    const utxos = await query<{ sats: number; status: string }>(`bmusic_sponsor_utxos?pot=eq.${pot}&status=neq.spent&select=sats,status`)
    const left = utxos.reduce((n, u) => n + u.sats, 0)
    console.log(`${pot}: active=${row.active} spent ${row.spent_sats}/${row.cap_sats} sats cap, ${left} sats in ${utxos.length} chunks, address ${row.address}`)
  } else if (cmd === 'sweep') {
    await updateWhere('bmusic_sponsor_pots', { pot }, { active: false })
    const row = (await getOne<Pot>('bmusic_sponsor_pots', 'pot', pot))!
    const all = await unspent(row.address)
    if (!all.length) return console.log('nothing to sweep')
    const total = all.reduce((n, u) => n + u.value, 0)
    const { txid } = await spendAll(pot, all.map((u) => ({ txid: u.tx_hash, vout: u.tx_pos, sats: u.value })), (fee) => [{ address: a, sats: total - fee }])
    for (const u of all) await updateWhere('bmusic_sponsor_utxos', { outpoint: `${u.tx_hash}.${u.tx_pos}` }, { status: 'spent' })
    console.log(`swept ${total} sats to ${a}: ${txid}`)
  } else {
    console.log('commands: init | split | status | sweep')
  }
}
main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
